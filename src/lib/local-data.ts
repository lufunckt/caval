/* View adapter. Authorization is enforced by the server, independently of this client. */
import {localRequest,changed} from './local-client';
export const db={};
type Ref={path:string;id:string;kind:'collection'|'document';field?:string;direction?:string;maximum?:number};
export const collection=(base:any,...parts:string[]):Ref=>({path:[base?.path,...parts].filter(Boolean).join('/'),id:parts.at(-1)||'',kind:'collection'});
export const doc=(base:any,...parts:string[]):Ref=>{
 if(base?.kind==='collection'&&!parts.length)parts=[crypto.randomUUID()];
 const path=[base?.path,...parts].filter(Boolean).join('/');return{path,id:path.split('/').at(-1)!,kind:'document'};
};
export const serverTimestamp=()=>({$serverTimestamp:true});
export const orderBy=(field:string,direction='asc')=>({field,direction});
export const limit=(maximum:number)=>({maximum});
export const query=(ref:Ref,...constraints:any[]):Ref=>Object.assign({},ref,...constraints);
const draft=(ref:Ref)=>ref.path.startsWith('dog_questionnaires/');
const snap=(value:any,id='')=>({id,exists:()=>!!value,data:()=>value});
export async function getDoc(ref:Ref){
 if(draft(ref)){let value=null;try{value=JSON.parse(localStorage.getItem('erico-draft:'+ref.path)||'null');}catch{}return snap(value,ref.id);}
 const data=await localRequest('/api/data/document?'+new URLSearchParams({path:ref.path}));return snap(data.item,ref.id);
}
async function write(operations:any[]){await localRequest('/api/data/batch',{operations});changed();}
export async function setDoc(ref:Ref,data:any,_options?:unknown){
 if(draft(ref)){localStorage.setItem('erico-draft:'+ref.path,JSON.stringify(data));return;}
 await write([{type:'set',path:ref.path,data}]);
}
export const updateDoc=(ref:Ref,data:any)=>write([{type:'update',path:ref.path,data}]);
export const deleteDoc=(ref:Ref)=>write([{type:'delete',path:ref.path}]);
export async function addDoc(ref:Ref,data:any){const item=doc(ref);await setDoc(item,data);return item;}
export function writeBatch(_db:unknown){
 const operations:any[]=[];return{
  set:(ref:Ref,data:any)=>{operations.push({type:'set',path:ref.path,data});},
  update:(ref:Ref,data:any)=>{operations.push({type:'update',path:ref.path,data});},
  commit:()=>write(operations)
 };
}
type Listener={next:(snapshot:any)=>void;error?:(error:unknown)=>void};
const subscriptions=new Map<string,{listeners:Set<Listener>;run:()=>void;cleanup:()=>void;last?:any}>();
export function onSnapshot(ref:Ref,next:Listener['next'],error?:Listener['error']){
 const key=JSON.stringify(ref);let subscription=subscriptions.get(key);
 if(!subscription){
  const listeners=new Set<Listener>();let active=true,busy=false;const current:any={listeners};
  const run=async()=>{
   if(!active||busy||document.visibilityState==='hidden')return;busy=true;
   try{
    let result:any;
    if(ref.kind==='document')result=await getDoc(ref);
    else{const data=await localRequest('/api/data/collection?'+new URLSearchParams({path:ref.path,field:ref.field||'createdAt',direction:ref.direction||'desc',limit:String(ref.maximum||50)}));result={docs:data.items.map((item:any)=>snap(item.data,item.id)),size:data.total};}
    if(active){current.last=result;for(const l of listeners)l.next(result);}
   }catch(e){if(active)for(const l of listeners)l.error?.(e);}finally{busy=false;}
  };
  const timer=setInterval(run,ref.path.includes('/messages')?3000:ref.path.startsWith('tutor_public_profiles')?60000:ref.path.includes('/comments')||ref.path.includes('/likes')?15000:5000);
  window.addEventListener('tutor:data-changed',run);document.addEventListener('visibilitychange',run);
  current.run=run;current.cleanup=()=>{active=false;clearInterval(timer);window.removeEventListener('tutor:data-changed',run);document.removeEventListener('visibilitychange',run);};
  subscription=current;subscriptions.set(key,current);
 }
 const listener={next,error};subscription!.listeners.add(listener);
 if(subscription!.last)next(subscription!.last);subscription!.run();
 return()=>{subscription!.listeners.delete(listener);if(!subscription!.listeners.size){subscription!.cleanup();subscriptions.delete(key);}};
}
