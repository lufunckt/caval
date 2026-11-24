import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {randomBytes} from 'node:crypto';
import pg from 'pg';
if(!process.env.DATABASE_URL||!/(?:_test|demo_tutor)$/.test(new URL(process.env.DATABASE_URL).pathname.slice(1)))throw Error('Use only a disposable PostgreSQL database named *_test.');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
const base='http://127.0.0.1:3557',password='Test-only-password-742!',bootstrap=randomBytes(32).toString('hex');
let server;const mail=[];const sockets=new Set();
const smtp=net.createServer(socket=>{
 sockets.add(socket);socket.on('close',()=>sockets.delete(socket));socket.write('220 localhost Test SMTP\r\n');
 let buffer='',data=false,message=[];
 socket.on('data',chunk=>{
  buffer+=chunk.toString();
  while(buffer.includes('\n')){
   const i=buffer.indexOf('\n'),line=buffer.slice(0,i).replace(/\r$/,'');buffer=buffer.slice(i+1);
   if(data){if(line==='.'){mail.push(message.join('\n'));message=[];data=false;socket.write('250 queued\r\n');}else message.push(line);continue;}
   const command=line.split(' ')[0].toUpperCase();
   if(command==='EHLO'||command==='HELO')socket.write('250-localhost\r\n250 8BITMIME\r\n');
   else if(command==='DATA'){data=true;socket.write('354 send message\r\n');}
   else if(command==='QUIT'){socket.end('221 bye\r\n');}
   else socket.write('250 ok\r\n');
  }
 });
});
async function start(){
 server=spawn(process.execPath,['dist/server.cjs'],{env:{...process.env,NODE_ENV:'production',PORT:'3557',APP_ORIGIN:base,COOKIE_SECURE:'false',ADMIN_EMAIL:'educator@example.com',ADMIN_BOOTSTRAP_TOKEN:bootstrap,SMTP_HOST:'127.0.0.1',SMTP_PORT:'32525',SMTP_SECURE:'false',SMTP_REQUIRE_TLS:'false',SMTP_USER:'',SMTP_PASSWORD:'',MAIL_FROM:'Tutor Test <test@example.com>',GEMINI_API_KEY:'',DAILY_API_KEY:''},stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{
  let output='';const timer=setTimeout(()=>reject(Error('Server startup timed out: '+output)),20000);
  server.stdout.on('data',b=>{output+=b;if(output.includes('Server running')){clearTimeout(timer);resolve();}});
  server.stderr.on('data',b=>output+=b);
  server.once('exit',code=>{clearTimeout(timer);reject(Error('Server exited: '+code+' '+output));});
 });
}
async function stop(){if(!server)return;const child=server;server=undefined;await new Promise(resolve=>{child.once('exit',resolve);child.kill('SIGTERM');});}
async function request(path,body,cookie='',headers={}){
 const response=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json','X-Tutor-Request':'1',Origin:base,...(cookie?{Cookie:cookie}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const value=await response.json();return{status:response.status,data:value,cookie:response.headers.get('set-cookie')?.split(';')[0],headers:response.headers};
}
function token(){const message=mail.at(-1).replace(/=\r?\n/g,'').replace(/=3D/g,'=');const result=message.match(/#token=([\w-]{43})/);assert.ok(result,'Verification/reset email contains an opaque token');return result[1];}
const profile=(name)=>({name,dogName:'Biscoito',dogBreed:'SRD',dogAge:'2 anos',isAuthorized:false});
const op=(type,path,data)=>({type,path,...(data===undefined?{}:{data})});
const write=(account,operations)=>request('/api/data/batch',{operations},account.cookie);
const read=(account,path)=>request('/api/data/document?'+new URLSearchParams({path}),undefined,account.cookie);
const list=(account,path)=>request('/api/data/collection?'+new URLSearchParams({path}),undefined,account.cookie);
let alice,bob,unverified,admin;
async function signup(name,email,verify=true){
 const result=await request('/api/auth/register',{name,email,password});
 assert.equal(result.status,201);assert.match(result.headers.get('set-cookie'),/HttpOnly/);assert.match(result.headers.get('set-cookie'),/SameSite=Lax/);
 const account={uid:result.data.user.uid,cookie:result.cookie,email};
 assert.equal(result.data.user.isAdmin,false);
 assert.equal((await write(account,[op('set','users/'+account.uid,profile(name))])).status,200);
 if(verify)assert.equal((await request('/api/auth/complete-token',{token:token(),purpose:'verify'})).status,200);
 return account;
}
before(async()=>{
 await new Promise(resolve=>smtp.listen(32525,'127.0.0.1',resolve));await start();
 await pool.query('TRUNCATE tutor_accounts,tutor_sessions,tutor_email_tokens,tutor_documents,tutor_installation,tutor_rate_limits CASCADE');
 alice=await signup('Alice','alice@example.com');bob=await signup('Bob','bob@example.com');unverified=await signup('Unverified','unverified@example.com',false);
});
after(async()=>{await stop();for(const socket of sockets)socket.destroy();await new Promise(resolve=>smtp.close(resolve));await pool.end();});

test('password hashes, HttpOnly sessions, failed login and CSRF protection',async()=>{
 const row=(await pool.query('SELECT password_hash FROM tutor_accounts WHERE id=$1',[alice.uid])).rows[0];
 assert.match(row.password_hash,/^scrypt\$/);assert.notEqual(row.password_hash,password);
 assert.equal((await request('/api/auth/login',{email:alice.email,password:'incorrect'})).status,401);
 assert.equal((await request('/api/auth/login',{email:alice.email,password},'',{Origin:'https://another.example'})).status,403);
 assert.equal((await request('/api/auth/login',{email:alice.email,password},'',{'X-Tutor-Request':''})).status,403);
 const login=await request('/api/auth/login',{email:alice.email,password});assert.equal(login.status,200);
 assert.equal((await request('/api/auth/session',undefined,alice.cookie)).data.user.emailVerified,true);
 assert.equal((await request('/api/data/collection?path=forum_posts')).status,401);
 assert.equal((await list(unverified,'forum_posts')).status,403);
});
test('only the one-time installation key can create the administrator',async()=>{
 assert.equal((await request('/api/auth/bootstrap',{token:'wrong',password})).status,403);
 const result=await request('/api/auth/bootstrap',{token:bootstrap,password});assert.equal(result.status,200);
 const identity=await request('/api/auth/session',undefined,result.cookie);assert.equal(identity.data.user.isAdmin,true);
 admin={uid:identity.data.user.uid,cookie:result.cookie};
 assert.equal((await write(admin,[op('set','users/'+admin.uid,profile('Érico'))])).status,200);
 assert.equal((await request('/api/auth/bootstrap',{token:bootstrap,password})).status,409);
 assert.equal((await write(alice,[op('update','users/'+alice.uid,{isAuthorized:true})])).status,403);
});
test('private profiles, admin listing, transaction rollback and path restrictions',async()=>{
 assert.equal((await read(bob,'users/'+alice.uid)).status,403);
 assert.equal((await list(alice,'users')).status,403);
 assert.equal((await list(admin,'users')).status,200);
 assert.equal((await read(alice,'../tutor_accounts')).status,400);
 assert.equal((await write(alice,[op('update','users/'+alice.uid,{dogName:'Must roll back'}),op('update','users/'+bob.uid,{dogName:'Forbidden'})])).status,403);
 assert.equal((await read(alice,'users/'+alice.uid)).data.item.dogName,'Biscoito');
});
test('community author checks, comments, idempotent likes and moderation',async()=>{
 assert.equal((await write(alice,[op('set','forum_posts/forged',{content:'fake',topic:'geral',authorId:bob.uid})])).status,403);
 assert.equal((await write(alice,[op('set','forum_posts/post_a',{content:'Passeio tranquilo hoje.',topic:'passeios',authorId:alice.uid,author:'untrusted',dog:'untrusted'})])).status,200);
 assert.equal((await read(bob,'forum_posts/post_a')).data.item.author,'Alice');
 assert.equal((await write(bob,[op('set','forum_posts/post_a/comments/comment_b',{text:'Que bom!',authorId:bob.uid})])).status,200);
 assert.equal((await write(bob,[op('set','forum_posts/post_a/likes/'+bob.uid,{uid:bob.uid})])).status,200);
 assert.equal((await write(bob,[op('set','forum_posts/post_a/likes/'+bob.uid,{uid:bob.uid})])).status,200);
 assert.equal((await list(alice,'forum_posts/post_a/likes')).data.total,1);
 assert.equal((await write(bob,[op('delete','forum_posts/post_a')])).status,403);
 assert.equal((await write(admin,[op('delete','forum_posts/post_a')])).status,200);
 assert.equal((await list(alice,'forum_posts/post_a/comments')).data.total,0);
});
test('forums, private diary and educator-granted individual chat',async()=>{
 assert.equal((await write(alice,[op('set','tutor_rooms/geral/messages/forum_a',{authorId:alice.uid,text:'Uma dúvida sobre passeios.'})])).status,200);
 assert.equal((await list(bob,'tutor_rooms/geral/messages')).data.items.length,1);
 assert.equal((await write(alice,[op('set','users/'+alice.uid+'/logs/log_a',{emotion:'calmo',notes:'Observação privada.'})])).status,200);
 assert.equal((await list(bob,'users/'+alice.uid+'/logs')).status,403);
 assert.equal((await list(admin,'users/'+alice.uid+'/logs')).status,200);
 assert.equal((await list(alice,'users/'+alice.uid+'/messages')).status,403);
 assert.equal((await write(admin,[op('update','users/'+alice.uid,{isAuthorized:true})])).status,200);
 assert.equal((await write(alice,[op('set','users/'+alice.uid+'/messages/msg_a',{authorId:alice.uid,text:'Oi Érico.',sender:'erico'})])).status,200);
 assert.equal((await list(admin,'users/'+alice.uid+'/messages')).data.items[0].data.sender,'tutor');
 assert.equal((await list(bob,'users/'+alice.uid+'/messages')).status,403);
});
test('consultations are server-managed, participant-scoped and optional integrations fail clearly',async()=>{
 const startsAt=Date.now()+60000;
 assert.equal((await write(alice,[op('set','users/'+alice.uid+'/consultations/illegal',{startsAt})])).status,403);
 assert.equal((await request('/api/tutor/consultations',{tutorId:bob.uid,startsAt,duration:60},alice.cookie)).status,403);
 const result=await request('/api/tutor/consultations',{tutorId:alice.uid,startsAt,duration:60},admin.cookie);
 assert.equal(result.status,201);const id=result.data.id;
 assert.equal((await list(alice,'users/'+alice.uid+'/consultations')).data.items.length,1);
 assert.equal((await request('/api/tutor/consultations/'+id+'/join',{},bob.cookie)).status,403);
 assert.equal((await request('/api/tutor/consultations/'+id+'/join',{},alice.cookie)).status,503);
 assert.equal((await request('/api/tutor/avatar',{photo:'data:image/jpeg;base64,/9j/AA==',consent:true},alice.cookie)).status,503);
});
test('confirmation/reset tokens are single-use and resetting a password revokes all sessions',async()=>{
 assert.equal((await request('/api/auth/verification-email',{},unverified.cookie)).status,200);
 const verify=token();assert.equal((await request('/api/auth/complete-token',{token:verify,purpose:'verify'})).status,200);
 assert.equal((await request('/api/auth/complete-token',{token:verify,purpose:'verify'})).status,400);
 assert.equal((await request('/api/auth/reset-password',{email:bob.email})).status,200);
 const reset=token(),nextPassword='A-different-test-password-942!';
 assert.equal((await request('/api/auth/complete-token',{token:reset,purpose:'reset',password:nextPassword})).status,200);
 assert.equal((await request('/api/auth/session',undefined,bob.cookie)).data.user,null);
 assert.equal((await request('/api/auth/complete-token',{token:reset,purpose:'reset',password:nextPassword})).status,400);
 assert.equal((await request('/api/auth/login',{email:bob.email,password:nextPassword})).status,200);
});
test('the visible portal can register, onboard and publish against PostgreSQL',async()=>{
 const{chromium}=await import('@playwright/test');const browser=await chromium.launch({channel:'chrome'});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(base+'/area-do-tutor');
  await page.getByLabel('Seu nome',{exact:true}).fill('Browser Tutor');
  await page.getByLabel('E-mail',{exact:true}).fill('browser@example.com');
  await page.getByLabel('Senha',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Criar conta gratuita',exact:true}).click();
  await page.getByLabel('Nome do cão',{exact:true}).fill('Biscoito Browser');
  await page.getByRole('button',{name:'Entrar na Área do Tutor',exact:true}).click();
  await page.getByRole('button',{name:'Já confirmei',exact:true}).waitFor();
  const verification=token();await page.request.post(base+'/api/auth/complete-token',{headers:{'X-Tutor-Request':'1',Origin:base},data:{token:verification,purpose:'verify'}});
  await page.getByRole('button',{name:'Já confirmei',exact:true}).click();
  await page.getByRole('button',{name:'Já confirmei',exact:true}).waitFor({state:'hidden'});
  const menu=page.getByRole('button',{name:'Abrir menu',exact:true});await menu.waitFor({state:'visible'});await menu.click();
  await page.getByRole('navigation',{name:'Área do Tutor',exact:true}).getByRole('button',{name:'Comunidade',exact:true}).click();
  const textarea=page.locator('textarea[name=content]');await textarea.fill('Publicação de teste do navegador.');
  await page.getByRole('button',{name:/Publicar/}).click();
  await page.getByText('Publicação de teste do navegador.',{exact:true}).waitFor({timeout:15000});
  assert.equal(await page.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 }finally{await browser.close();}
});
test('sessions and data survive application restart; expired sessions are rejected',async()=>{
 await stop();await start();
 assert.equal((await request('/api/auth/session',undefined,alice.cookie)).data.user.uid,alice.uid);
 assert.equal((await read(alice,'users/'+alice.uid)).data.item.dogName,'Biscoito');
 await pool.query("UPDATE tutor_sessions SET expires_at=now()-interval '1 second' WHERE account_id=$1",[alice.uid]);
 assert.equal((await read(alice,'users/'+alice.uid)).status,401);
});
