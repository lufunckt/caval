export async function localRequest(path:string,body?:unknown){
 const response=await fetch(path,{credentials:'same-origin',method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json','X-Tutor-Request':'1'},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const data=await response.json().catch(()=>({message:'Não foi possível acessar o serviço.'}));
 if(!response.ok)throw Object.assign(new Error(data.message||'Não foi possível concluir.'),{status:response.status});
 return data;
}
export const changed=()=>window.dispatchEvent(new Event('tutor:data-changed'));
