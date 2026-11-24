import React,{createContext,useContext,useEffect,useState} from 'react';
import {localRequest} from '../lib/local-client';
import {db,doc,onSnapshot,setDoc} from '../lib/local-data';
export interface UserProfile{
 uid:string;name:string;dogName:string;dogBreed:string;dogAge:string;focusArea:string;nextConsult:string;consultProgress:number;xpPoints:number;streakCount:number;unlockedBadges:string[];isAuthorized:boolean;dogPhoto?:string;dogAvatar?:string;createdAt:any;updatedAt:any;
}
export interface AuthUser{uid:string;email:string;displayName:string;emailVerified:boolean;isAdmin:boolean;reload:()=>Promise<void>}
interface Context{
 user:AuthUser|null;userProfile:UserProfile|null;isAuthLoading:boolean;profileError:string;
 loginWithEmail:(email:string,password:string)=>Promise<void>;
 registerWithEmail:(name:string,email:string,password:string)=>Promise<void>;
 resetPassword:(email:string)=>Promise<void>;logout:()=>Promise<void>;
 createProfile:(name:string,dogName:string,breed:string,age:string)=>Promise<void>;
}
const AuthCtx=createContext<Context|undefined>(undefined);
export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const[user,setUser]=useState<AuthUser|null>(null),[userProfile,setProfile]=useState<UserProfile|null>(null),[isAuthLoading,setLoading]=useState(true),[profileError,setError]=useState('');
 async function refresh(){const data=await localRequest('/api/auth/session');setUser(data.user?{...data.user,reload:refresh}:null);if(!data.user)setLoading(false);}
 useEffect(()=>{
  refresh().catch(()=>{setError('Não foi possível carregar sua conta. Tente novamente.');setLoading(false);});
  const timer=setInterval(()=>{if(document.visibilityState!=='hidden')refresh().catch(()=>{});},30000);return()=>clearInterval(timer);
 },[]);
 useEffect(()=>{
  setProfile(null);if(!user)return;setLoading(true);
  return onSnapshot(doc(db,'users',user.uid),s=>{setProfile(s.exists()?s.data():null);setLoading(false);setError('');},()=>{setError('Não foi possível carregar seu perfil. Tente novamente.');setLoading(false);});
 },[user?.uid]);
 const loginWithEmail=async(email:string,password:string)=>{await localRequest('/api/auth/login',{email,password});await refresh();};
 const registerWithEmail=async(name:string,email:string,password:string)=>{await localRequest('/api/auth/register',{name,email,password});await refresh();};
 const resetPassword=async(email:string)=>{await localRequest('/api/auth/reset-password',{email});};
 const logout=async()=>{await localRequest('/api/auth/logout',{});setUser(null);setProfile(null);setError('');};
 const createProfile=async(name:string,dogName:string,dogBreed:string,dogAge:string)=>{
  if(!user)throw Error('Entre para continuar.');
  await setDoc(doc(db,'users',user.uid),{name:name.trim(),dogName:dogName.trim(),dogBreed:dogBreed.trim()||'Não informado',dogAge:dogAge.trim()||'Não informado',isAuthorized:false});
 };
 return <AuthCtx.Provider value={{user,userProfile,isAuthLoading,profileError,loginWithEmail,registerWithEmail,resetPassword,logout,createProfile}}>{children}</AuthCtx.Provider>;
};
export const useAuth=()=>{const value=useContext(AuthCtx);if(!value)throw Error('AuthProvider necessário.');return value;};
