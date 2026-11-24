import {Router} from 'express';
import type {PoolClient} from 'pg';
import {sql,readDocument,putDocument,transaction} from './database';
import {authenticated,requireVerified,failure,route,apiError,privateHeaders,sameOrigin,rateLimit,type Actor} from './local-auth';
import {safePhoto} from './tutor-policy';
const topics=['geral','passeios','sozinho','convivencia','latidos'];
function segments(value:unknown,collection=false){
 if(typeof value!=='string'||value.length>600)failure(400,'Endereço de registro inválido.');
 const parts=(value as string).split('/');
 if(parts.length>4||parts.length%2!==(collection?1:0)||parts.some(p=>!/^[a-zA-Z0-9_-]{1,128}$/.test(p)))failure(400,'Endereço de registro inválido.');
 return parts;
}
const allow=(yes:boolean)=>{if(!yes)failure(403,'Você não tem permissão para esta ação.');};
const text=(v:any,max:number,required=true)=>{if(typeof v!=='string'||v.length>max||required&&!v.trim())failure(400,'Confira os campos e o tamanho do texto.');return v.trim();};
const keys=(data:any,fields:string[])=>{if(!data||typeof data!=='object'||Array.isArray(data)||Object.keys(data).some(k=>!fields.includes(k)))failure(400,'Campos de registro inválidos.');};
async function canRead(a:Actor,p:string[],c?:PoolClient){
 const[root,uid,child]=p;
 if(root==='users'){
  if(p.length===1){allow(a.isAdmin);return;}
  allow(a.isAdmin||uid===a.uid);
  if(!child||['logs','consultations'].includes(child))return;
  if(child==='messages'){requireVerified(a);const profile=await readDocument('users/'+uid,c);allow(a.isAdmin||profile?.isAuthorized===true);return;}
 }
 if(root==='tutor_public_profiles'&&p.length<=2){requireVerified(a);return;}
 if(root==='forum_posts'&&(p.length<=2||['comments','likes'].includes(child))){requireVerified(a);return;}
 if(root==='tutor_rooms'&&topics.includes(uid)&&child==='messages'){requireVerified(a);return;}
 failure(403,'Você não tem permissão para acessar estes registros.');
}
async function writeOne(a:Actor,op:any,c:PoolClient){
 if(!op||typeof op!=='object')failure(400,'Operação inválida.');
 const p=segments(op.path),path=p.join('/'),[root,id,child,rid]=p,old=await readDocument(path,c),input=op.data;
 if(!['set','update','delete'].includes(op.type))failure(400,'Operação inválida.');
 if(op.type==='update'&&!old)failure(404,'Registro não encontrado.');
 if(op.type==='delete'){
  await canRead(a,p,c);
  allow(root==='forum_posts'&&(a.isAdmin||old?.authorId===a.uid||child==='likes'&&rid===a.uid)||root==='users'&&child==='logs'&&(a.isAdmin||id===a.uid));
  await c.query("DELETE FROM tutor_documents WHERE path=$1 OR left(path,length($1)+1)=$1||'/'",[path]);return;
 }
 if(root==='users'&&p.length===2){
  allow(a.isAdmin||id===a.uid);
  keys(input,['uid','name','dogName','dogBreed','dogAge','focusArea','nextConsult','consultProgress','xpPoints','streakCount','unlockedBadges','isAuthorized','createdAt','updatedAt','dogPhoto','dogAvatar']);
  if(old){if(!a.isAdmin)allow(Object.keys(input).every(k=>['name','dogName','dogBreed','dogAge','dogPhoto','dogAvatar','updatedAt'].includes(k)));}
  else{allow(id===a.uid);allow(input.isAuthorized!==true&&!input.xpPoints&&!input.consultProgress&&!input.streakCount&&!input.unlockedBadges?.length);}
  const data={...(old||{focusArea:'',nextConsult:'',consultProgress:0,xpPoints:0,streakCount:0,unlockedBadges:[],isAuthorized:false}),...input,uid:id,createdAt:old?.createdAt||Date.now(),updatedAt:Date.now()};
  data.name=text(data.name,120);data.dogName=text(data.dogName,80);data.dogBreed=text(data.dogBreed,80);data.dogAge=text(data.dogAge,40);
  text(data.focusArea,200,false);text(data.nextConsult,200,false);
  if(typeof data.isAuthorized!=='boolean'||!Number.isFinite(data.consultProgress)||data.consultProgress<0||data.consultProgress>100||!Number.isFinite(data.xpPoints)||data.xpPoints<0||!Number.isFinite(data.streakCount)||data.streakCount<0||!Array.isArray(data.unlockedBadges)||data.unlockedBadges.length>50)failure(400,'Perfil inválido.');
  for(const field of ['dogPhoto','dogAvatar'])if(data[field]!==undefined&&(typeof data[field]!=='string'||data[field]&&!safePhoto(data[field])))failure(400,'Escolha uma foto JPG, PNG ou WebP válida.');
  await putDocument(c,path,data);return;
 }
 if(root==='tutor_public_profiles'&&p.length===2){
  allow(id===a.uid);keys(input,['uid','avatar','updatedAt']);
  if(typeof input.avatar!=='string'||input.avatar.length>100000||input.avatar&&!safePhoto(input.avatar))failure(400,'Avatar inválido.');
  await putDocument(c,path,{uid:a.uid,avatar:input.avatar,updatedAt:Date.now()});return;
 }
 requireVerified(a);const profile=await readDocument('users/'+a.uid,c);allow(!!profile);
 if(input?.authorId&&input.authorId!==a.uid)failure(403,'Autor inválido.');
 const author={authorId:a.uid,author:profile.name,createdAt:Date.now()};
 if(root==='forum_posts'){
  if(p.length===2){
   allow(!old&&op.type==='set');keys(input,['id','authorId','author','dog','content','topic','likes','createdAt']);
   if(!topics.includes(input.topic))failure(400,'Escolha um assunto válido.');
   await putDocument(c,path,{id,...author,dog:profile.dogName,content:text(input.content,3000),topic:input.topic,likes:0});return;
  }
  allow(!!await readDocument('forum_posts/'+id,c));
  if(child==='likes'){allow(rid===a.uid);keys(input,['uid','createdAt']);await putDocument(c,path,{uid:a.uid,createdAt:old?.createdAt||Date.now()});return;}
  if(child==='comments'){allow(!old);keys(input,['authorId','author','text','createdAt']);await putDocument(c,path,{...author,text:text(input.text,1500)});return;}
 }
 if(root==='tutor_rooms'&&topics.includes(id)&&child==='messages'){
  allow(!old);keys(input,['id','authorId','author','text','createdAt']);await putDocument(c,path,{id:rid,...author,text:text(input.text,4000)});return;
 }
 if(root==='users'&&child==='logs'){
  allow(id===a.uid&&!old);keys(input,['id','userId','date','emotion','notes','createdAt']);
  if(!['calmo','focado','ansioso','disperso'].includes(input.emotion))failure(400,'Escolha uma observação válida.');
  await putDocument(c,path,{id:rid,userId:a.uid,date:new Date().toISOString().slice(0,10),emotion:input.emotion,notes:text(input.notes,5000),createdAt:Date.now()});return;
 }
 if(root==='users'&&child==='messages'){
  await canRead(a,p,c);allow(!old);keys(input,['id','authorId','author','sender','text','createdAt']);
  await putDocument(c,path,{id:rid,...author,sender:a.isAdmin?'erico':'tutor',text:text(input.text,4000)});return;
 }
 failure(403,'Esta operação precisa ser feita pelo painel autorizado.');
}
export const dataRouter=Router();dataRouter.use(privateHeaders);
dataRouter.use((req,res,next)=>{authenticated(req).then(a=>{(req as any).identity=a;next();}).catch(next);});
dataRouter.use(sameOrigin);
dataRouter.get('/document',route(async(req,res)=>{const p=segments(req.query.path);await canRead(req.identity!,p);res.json({item:await readDocument(p.join('/'))||null});}));
dataRouter.get('/collection',route(async(req,res)=>{
 const p=segments(req.query.path,true),parent=p.join('/');await canRead(req.identity!,p);
 const field=typeof req.query.field==='string'?req.query.field:'createdAt';
 if(!['createdAt','updatedAt','startsAt','date'].includes(field))failure(400,'Ordenação inválida.');
 const maximum=Math.min(100,Math.max(1,Number(req.query.limit)||50)),direction=req.query.direction==='asc'?'ASC':'DESC';
 const projection=parent==='users'?"data - 'dogPhoto' - 'dogAvatar'":'data';
 const r=await sql('SELECT path,'+projection+' AS data FROM tutor_documents WHERE parent=$1 ORDER BY data->>$2 '+direction+',path ASC LIMIT $3',[parent,field,maximum]);
 const items=r.rows.map(row=>({id:row.path.split('/').at(-1),data:row.data}));let total=items.length;
 if(p[0]==='forum_posts'&&p[2]==='likes'){
  total=Number((await sql('SELECT count(*) FROM tutor_documents WHERE parent=$1',[parent])).rows[0].count);
  if(!items.some(i=>i.id===req.identity!.uid)){const own=await readDocument(parent+'/'+req.identity!.uid);if(own)items.push({id:req.identity!.uid,data:own});}
 }
 res.json({items,total});
}));
dataRouter.post('/batch',route(async(req,res)=>{
 await rateLimit('write:'+req.identity!.uid,120,60);const operations=req.body.operations;
 if(!Array.isArray(operations)||!operations.length||operations.length>8)failure(400,'Quantidade de operações inválida.');
 await transaction(async c=>{for(const op of operations)await writeOne(req.identity!,op,c);});res.json({success:true});
}));dataRouter.use(apiError);
