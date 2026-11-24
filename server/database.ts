import pg, { type PoolClient } from 'pg';
import { randomUUID } from 'node:crypto';
let pool: pg.Pool | undefined, ready: Promise<void> | undefined;
export const failure = (status:number,message:string):never=>{throw Object.assign(new Error(message),{status});};
export function database() {
  if(!process.env.DATABASE_URL) failure(503,'O cadastro ainda está em configuração. Tente novamente mais tarde.');
  if(!pool){pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:10,connectionTimeoutMillis:5000,idleTimeoutMillis:30000});pool.on('error',(error:any)=>console.error('Database connection unavailable:',error.code||'connection'));}
  return pool;
}
export async function migrateDatabase() {
  if(!ready) ready=(async()=>{
    const c=await database().connect();
    try {
      await c.query('BEGIN'); await c.query('SELECT pg_advisory_xact_lock(7182501)');
      await c.query(`
CREATE TABLE IF NOT EXISTS tutor_accounts(id uuid PRIMARY KEY,email text NOT NULL UNIQUE,name text NOT NULL,password_hash text NOT NULL,verified boolean NOT NULL DEFAULT false,is_admin boolean NOT NULL DEFAULT false,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS tutor_sessions(hash text PRIMARY KEY,account_id uuid NOT NULL REFERENCES tutor_accounts(id) ON DELETE CASCADE,expires_at timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS tutor_sessions_account_idx ON tutor_sessions(account_id);
CREATE TABLE IF NOT EXISTS tutor_email_tokens(hash text PRIMARY KEY,account_id uuid NOT NULL REFERENCES tutor_accounts(id) ON DELETE CASCADE,purpose text NOT NULL CHECK(purpose IN ('verify','reset')),expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS tutor_documents(path text PRIMARY KEY,parent text NOT NULL,data jsonb NOT NULL,updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS tutor_documents_parent_idx ON tutor_documents(parent);
CREATE TABLE IF NOT EXISTS tutor_installation(key text PRIMARY KEY,value text NOT NULL);
CREATE TABLE IF NOT EXISTS tutor_rate_limits(key text PRIMARY KEY,count integer NOT NULL,expires_at timestamptz NOT NULL);
`);
      await c.query('COMMIT');
    } catch(e){await c.query('ROLLBACK');throw e;} finally{c.release();}
  })().catch(e=>{ready=undefined;throw e;});
  return ready;
}
export async function transaction<T>(work:(c:PoolClient)=>Promise<T>):Promise<T>{
  await migrateDatabase();const c=await database().connect();
  try{await c.query('BEGIN');await c.query('SELECT pg_advisory_xact_lock(7182502)');const result=await work(c);await c.query('COMMIT');return result;}
  catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
}
export async function sql(query:string,values:any[]=[]){await migrateDatabase();return database().query(query,values);}
export const timestamp=()=>({$serverTimestamp:true});
export function timestamps(value:any,now=Date.now()):any{
  if(value&&typeof value==='object'&&value.$serverTimestamp===true)return now;
  if(Array.isArray(value))return value.map(v=>timestamps(v,now));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,timestamps(v,now)]));
  return value;
}
export async function readDocument(path:string,c?:PoolClient){const r=c?await c.query('SELECT data FROM tutor_documents WHERE path=$1',[path]):await sql('SELECT data FROM tutor_documents WHERE path=$1',[path]);return r.rows[0]?.data;}
export async function putDocument(c:PoolClient,path:string,data:any){await c.query('INSERT INTO tutor_documents(path,parent,data) VALUES($1,$2,$3::jsonb) ON CONFLICT(path) DO UPDATE SET data=excluded.data,updated_at=now()',[path,path.slice(0,path.lastIndexOf('/')),JSON.stringify(timestamps(data))]);}
const ref=(path:string)=>({
 path,id:path.split('/').at(-1)!,
 async get(){const value=await readDocument(path);return{exists:!!value,data:()=>value};},
 async set(data:any){await transaction(c=>putDocument(c,path,data));},
 async update(data:any){await transaction(async c=>{const old=await readDocument(path,c);if(!old)failure(404,'Registro não encontrado.');await putDocument(c,path,{...old,...data});});}
});
export const documentStore={
 doc:ref,collection:(path:string)=>({doc:(id=randomUUID())=>ref(path+'/'+id)}),
 runTransaction:<T>(work:(tx:{get:(r:ReturnType<typeof ref>)=>Promise<any>;set:(r:ReturnType<typeof ref>,data:any)=>void;update:(r:ReturnType<typeof ref>,data:any)=>void})=>Promise<T>)=>transaction(async c=>{
  const writes:Array<()=>Promise<void>>=[];
  const result=await work({
   get:async r=>{const value=await readDocument(r.path,c);return{exists:!!value,data:()=>value};},
   set:(r,data)=>{writes.push(()=>putDocument(c,r.path,data));},
   update:(r,data)=>{writes.push(async()=>{const old=await readDocument(r.path,c);if(!old)failure(404,'Registro não encontrado.');await putDocument(c,r.path,{...old,...data});});}
  });for(const write of writes)await write();return result;
 })
};
