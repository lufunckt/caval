import React,{useState} from 'react';
import {localRequest} from '../lib/local-client';
export function AccountAction({action}:{action:string}){
 const[busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false);
 const setup=action==='configurar',reset=action==='redefinir';
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError('');const form=new FormData(e.currentTarget);
  try{
   const token=setup?String(form.get('token')):new URLSearchParams(location.hash.slice(1)).get('token');
   if(setup)await localRequest('/api/auth/bootstrap',{token,password:form.get('password')});
   else await localRequest('/api/auth/complete-token',{token,purpose:reset?'reset':'verify',...(reset?{password:form.get('password')}:{})});
   history.replaceState(null,'',location.pathname);setDone(true);
  }catch(e:any){setError(e.message);}finally{setBusy(false);}
 }
 return <div className="tp-root"><section className="tp-onboarding tp-paper">
  <span className="tp-eyebrow">Área do Tutor</span><h1>{setup?'Primeiro acesso do Érico':reset?'Uma nova senha':'Confirme seu e-mail'}</h1>
  {done?<><p role="status">{setup?'Administrador configurado. Complete o perfil para começar.':reset?'Senha atualizada. Entre novamente na sua conta.':'E-mail confirmado. Sua conta já pode participar da comunidade.'}</p><a className="tp-primary" href="/area-do-tutor">Acessar minha conta</a></>:<form onSubmit={submit}>
   {setup&&<><p>Use a chave de instalação configurada no servidor. Ela só funciona no primeiro acesso.</p><label>Chave de instalação<input name="token" type="password" autoComplete="off" required maxLength={256}/></label></>}
   {(setup||reset)&&<label>{setup?'Senha do administrador':'Nova senha'}<input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required/><small>Use pelo menos 12 caracteres.</small></label>}
   {error&&<p className="tp-notice tp-error" role="alert">{error}</p>}
   <button className="tp-primary" disabled={busy}>{busy?'Aguarde.':setup?'Configurar administrador':reset?'Salvar nova senha':'Confirmar meu e-mail'}</button><a className="tp-back" href="/area-do-tutor">Voltar ao login</a>
  </form>}
 </section></div>;
}
