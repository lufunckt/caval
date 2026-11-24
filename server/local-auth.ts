import {Router,type Request,type Response,type NextFunction} from 'express';
import {createHash,randomBytes,randomUUID,scrypt,timingSafeEqual} from 'node:crypto';
import nodemailer from 'nodemailer';
import {sql,transaction,failure} from './database';
export {failure};
export type Actor={uid:string;email:string;name:string;email_verified:boolean;isAdmin:boolean};
export type AuthRequest=Request&{identity?:Actor};
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
const opaque=()=>randomBytes(32).toString('base64url');
const secure=()=>process.env.NODE_ENV==='production'&&process.env.COOKIE_SECURE!=='false';
const cookieName=()=>secure()?'__Host-erico_session':'erico_session';
const origin=()=>new URL(process.env.APP_ORIGIN||'http://localhost:3000').origin;
const smtpReady=()=>!!process.env.SMTP_HOST&&!!process.env.MAIL_FROM;
const adminEmail=()=>(process.env.ADMIN_EMAIL||'ericocavalheiro.psico@gmail.com').trim().toLowerCase();
export const route=(fn:(req:AuthRequest,res:Response)=>Promise<any>)=>(req:Request,res:Response,next:NextFunction)=>{Promise.resolve(fn(req as AuthRequest,res)).catch(next);};
export function privateHeaders(_req:Request,res:Response,next:NextFunction){res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Content-Type-Options','nosniff');next();}
export function sameOrigin(req:Request,_res:Response,next:NextFunction){
 if(!['GET','HEAD','OPTIONS'].includes(req.method)){
  if(req.headers['x-tutor-request']!=='1'||!req.is('application/json'))return next(Object.assign(new Error('Recarregue a página para continuar.'),{status:403}));
  if(req.headers.origin&&req.headers.origin!==origin())return next(Object.assign(new Error('Origem não autorizada.'),{status:403}));
 }next();
}
export async function rateLimit(key:string,maximum:number,seconds=900){
 const r=await sql("INSERT INTO tutor_rate_limits(key,count,expires_at) VALUES($1,1,now()+$2*interval '1 second') ON CONFLICT(key) DO UPDATE SET count=CASE WHEN tutor_rate_limits.expires_at<now() THEN 1 ELSE tutor_rate_limits.count+1 END,expires_at=CASE WHEN tutor_rate_limits.expires_at<now() THEN excluded.expires_at ELSE tutor_rate_limits.expires_at END RETURNING count",[digest(key),seconds]);
 if(r.rows[0].count>maximum)failure(429,'Muitas tentativas. Aguarde alguns minutos.');
}
const derive=(password:string,salt:string)=>new Promise<Buffer>((resolve,reject)=>scrypt(password,salt,64,{N:32768,r:8,p:3,maxmem:64*1024*1024},(error,key)=>error?reject(error):resolve(key)));
export async function hashPassword(password:string){
 if(typeof password!=='string'||password.length<12||password.length>128)failure(400,'Use uma senha de 12 a 128 caracteres.');
 const salt=opaque();return 'scrypt$'+salt+'$'+(await derive(password,salt)).toString('hex');
}
export async function checkPassword(password:string,stored:string){
 if(typeof password!=='string'||password.length>128)return false;
 const [format,salt,hex]=stored.split('$');
 if(format!=='scrypt'||!salt||!/^[a-f0-9]{128}$/.test(hex||''))return false;
 return timingSafeEqual(await derive(password,salt),Buffer.from(hex,'hex'));
}
const actor=(r:any):Actor=>({uid:r.id,email:r.email,name:r.name,email_verified:r.verified,isAdmin:r.is_admin});
export const publicUser=(a:Actor|null)=>a&&({uid:a.uid,email:a.email,displayName:a.name,emailVerified:a.email_verified,isAdmin:a.isAdmin});
function sessionCookie(req:Request){return(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName()+'='))?.slice(cookieName().length+1);}
export async function currentActor(req:Request):Promise<Actor|null>{
 const raw=sessionCookie(req);if(!raw||!/^[\w-]{43}$/.test(raw))return null;
 const r=await sql('SELECT a.* FROM tutor_sessions s JOIN tutor_accounts a ON a.id=s.account_id WHERE s.hash=$1 AND s.expires_at>now()',[digest(raw)]);
 return r.rows[0]?actor(r.rows[0]):null;
}
export async function authenticated(req:AuthRequest):Promise<Actor>{return req.identity??await currentActor(req)??failure(401,'Entre na sua conta para continuar.');}
export const requireVerified=(a:Actor)=>{if(!a.email_verified)failure(403,'Confirme seu e-mail antes de continuar.');};
async function issueSession(res:Response,uid:string){
 const raw=opaque();await sql("INSERT INTO tutor_sessions(hash,account_id,expires_at) VALUES($1,$2,now()+interval '7 days')",[digest(raw),uid]);
 res.cookie(cookieName(),raw,{httpOnly:true,secure:secure(),sameSite:'lax',path:'/',maxAge:7*86400000});
}
const emailValue=(v:unknown)=>{
 if(typeof v!=='string'||v.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))failure(400,'Informe um e-mail válido.');
 return(v as string).trim().toLowerCase();
};
async function sendToken(uid:string,email:string,purpose:'verify'|'reset'){
 if(!smtpReady())failure(503,'O envio de e-mails ainda está em configuração. Fale com Érico para obter ajuda.');
 const raw=opaque();
 await transaction(async c=>{
  await c.query('DELETE FROM tutor_email_tokens WHERE account_id=$1 AND purpose=$2',[uid,purpose]);
  await c.query("INSERT INTO tutor_email_tokens(hash,account_id,purpose,expires_at) VALUES($1,$2,$3,now()+$4*interval '1 minute')",[digest(raw),uid,purpose,purpose==='verify'?1440:30]);
 });
 const verify=purpose==='verify',link=origin()+'/area-do-tutor?acao='+(verify?'verificar':'redefinir')+'#token='+raw;
 const transport=nodemailer.createTransport({
  host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT)||587,secure:process.env.SMTP_SECURE==='true',
  requireTLS:process.env.SMTP_REQUIRE_TLS!=='false',connectionTimeout:10000,socketTimeout:15000,
  ...(process.env.SMTP_USER?{auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}}:{}),
  disableFileAccess:true,disableUrlAccess:true
 });
 try{await transport.sendMail({from:process.env.MAIL_FROM,to:email,subject:verify?'Confirme seu e-mail — Área do Tutor':'Redefina sua senha — Área do Tutor',text:(verify?'Confirme seu e-mail':'Escolha uma nova senha')+' acessando este link:\n\n'+link+'\n\nSe você não solicitou, ignore esta mensagem.',textEncoding:'quoted-printable'});}
 catch{failure(503,'Não foi possível enviar o e-mail agora. Sua conta continua disponível; tente reenviar mais tarde.');}
}
export const authRouter=Router();authRouter.use(privateHeaders,sameOrigin);
authRouter.get('/session',route(async(req,res)=>res.json({user:publicUser(await currentActor(req))})));
authRouter.get('/config',route(async(_req,res)=>{
 const configured=!!process.env.DATABASE_URL;
 const installed=configured?(await sql("SELECT value FROM tutor_installation WHERE key='bootstrap_complete'")).rowCount:0;
 res.json({databaseConfigured:configured,emailConfigured:smtpReady(),setupAvailable:configured&&!installed&&(process.env.ADMIN_BOOTSTRAP_TOKEN?.length||0)>=32});
}));
authRouter.post('/register',route(async(req,res)=>{
 await rateLimit('register:'+req.ip,6);
 const email=emailValue(req.body.email),name=typeof req.body.name==='string'?req.body.name.trim():'';
 if(!name||name.length>120)failure(400,'Informe seu nome.');
 const passwordHash=await hashPassword(req.body.password),id=randomUUID();
 try{await sql('INSERT INTO tutor_accounts(id,email,name,password_hash) VALUES($1,$2,$3,$4)',[id,email,name,passwordHash]);}
 catch(e:any){if(e.code==='23505')failure(409,'Este e-mail já tem uma conta. Entre ou recupere sua senha.');throw e;}
 await issueSession(res,id);
 let notice='Conta criada. Você pode completar o perfil. A confirmação por e-mail ainda está em configuração.';
 if(smtpReady()){try{await sendToken(id,email,'verify');notice='Conta criada. Confirme seu e-mail para participar da comunidade.';}catch{notice='Conta criada. O envio de confirmação está indisponível; tente reenviar pelo seu perfil.';}}
 res.status(201).json({user:publicUser({uid:id,email,name,email_verified:false,isAdmin:false}),notice});
}));
let dummy:Promise<string>|undefined;
authRouter.post('/login',route(async(req,res)=>{
 await rateLimit('login:'+req.ip,30);const email=emailValue(req.body.email);await rateLimit('login-account:'+email,10);
 const row=(await sql('SELECT * FROM tutor_accounts WHERE email=$1',[email])).rows[0];dummy??=hashPassword(opaque());
 const matches=await checkPassword(req.body.password,row?.password_hash||await dummy);
 if(!row||!matches)failure(401,'Confira seu e-mail e sua senha.');
 await issueSession(res,row.id);res.json({user:publicUser(actor(row))});
}));
authRouter.post('/logout',route(async(req,res)=>{
 const raw=sessionCookie(req);if(raw)await sql('DELETE FROM tutor_sessions WHERE hash=$1',[digest(raw)]);
 res.clearCookie(cookieName(),{httpOnly:true,secure:secure(),sameSite:'lax',path:'/'});res.json({success:true});
}));
authRouter.post('/verification-email',route(async(req,res)=>{
 const a=await authenticated(req);await rateLimit('verification:'+a.uid,5);
 if(!a.email_verified)await sendToken(a.uid,a.email,'verify');res.json({success:true});
}));
authRouter.post('/reset-password',route(async(req,res)=>{
 await rateLimit('reset:'+req.ip,8);
 if(!smtpReady())failure(503,'A recuperação por e-mail ainda está em configuração. Fale com Érico.');
 const email=emailValue(req.body.email),row=(await sql('SELECT id FROM tutor_accounts WHERE email=$1',[email])).rows[0];
 if(row)await sendToken(row.id,email,'reset');res.json({success:true});
}));
authRouter.post('/complete-token',route(async(req,res)=>{
 await rateLimit('token:'+req.ip,25);const{token,purpose}=req.body;
 if(typeof token!=='string'||!/^[\w-]{43}$/.test(token)||!['verify','reset'].includes(purpose))failure(400,'Link inválido ou expirado.');
 const passwordHash=purpose==='reset'?await hashPassword(req.body.password):'';
 await transaction(async c=>{
  const row=(await c.query('SELECT * FROM tutor_email_tokens WHERE hash=$1 AND purpose=$2 AND expires_at>now() FOR UPDATE',[digest(token),purpose])).rows[0];
  if(!row)failure(400,'Link inválido ou expirado. Solicite outro.');
  if(purpose==='verify')await c.query('UPDATE tutor_accounts SET verified=true WHERE id=$1',[row.account_id]);
  else{await c.query('UPDATE tutor_accounts SET password_hash=$1 WHERE id=$2',[passwordHash,row.account_id]);await c.query('DELETE FROM tutor_sessions WHERE account_id=$1',[row.account_id]);}
  await c.query('DELETE FROM tutor_email_tokens WHERE account_id=$1 AND purpose=$2',[row.account_id,purpose]);
 });res.json({success:true});
}));
authRouter.post('/bootstrap',route(async(req,res)=>{
 await rateLimit('bootstrap:'+req.ip,5);const expected=process.env.ADMIN_BOOTSTRAP_TOKEN||'';
 if(expected.length<32||typeof req.body.token!=='string'||req.body.token.length>256||!timingSafeEqual(Buffer.from(digest(expected)),Buffer.from(digest(req.body.token))))failure(403,'Chave de instalação inválida.');
 const passwordHash=await hashPassword(req.body.password);
 const id=await transaction(async c=>{
  if((await c.query("SELECT value FROM tutor_installation WHERE key='bootstrap_complete'")).rowCount||(await c.query('SELECT id FROM tutor_accounts WHERE is_admin=true')).rowCount)failure(409,'O administrador já foi configurado. Use o login.');
  const existing=(await c.query('SELECT id FROM tutor_accounts WHERE email=$1',[adminEmail()])).rows[0],id=existing?.id||randomUUID();
  await c.query('INSERT INTO tutor_accounts(id,email,name,password_hash,verified,is_admin) VALUES($1,$2,$3,$4,true,true) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash,verified=true,is_admin=true',[id,adminEmail(),'Érico Cavalheiro',passwordHash]);
  await c.query("INSERT INTO tutor_installation(key,value) VALUES('bootstrap_complete','true')");await c.query('DELETE FROM tutor_sessions WHERE account_id=$1',[id]);return id;
 });await issueSession(res,id);res.json({success:true});
}));
authRouter.use(apiError);
export function apiError(e:any,_req:Request,res:Response,_next:NextFunction){
 const status=Number(e?.status)||500;if(status>=500)console.error('Tutor backend request failed:',e?.code||'internal');
 res.status(status).json({message:status<500||status===503?e.message:'Não foi possível concluir. Tente novamente mais tarde.'});
}
