import {useEffect,useState} from 'react';
import {api} from '../api';
import type {PlatformActivity} from './activityTypes';
import type {SearchPosition} from './PlatformLocation';

export function useNearbyActivities(position:SearchPosition|null,query:string,status:string,radius:string) {
 const [data,setData]=useState<PlatformActivity[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 const [search,setSearch]=useState(query);
 useEffect(()=>{const timer=setTimeout(()=>setSearch(query),250);return()=>clearTimeout(timer);},[query]);
 useEffect(()=>{
  const controller=new AbortController();setLoading(true);setError(false);
  const params=new URLSearchParams({limit:'30'});
  if(position){params.set('lat',position.latitude.toFixed(6));params.set('lng',position.longitude.toFixed(6));if(radius!=='ALL')params.set('radius',radius);}
  if(search.trim())params.set('q',search.trim());if(status!=='ALL')params.set('status',status);
  api<PlatformActivity[]>('/platform/activities?'+params,{signal:controller.signal}).then(rows=>{if(!controller.signal.aborted)setData(rows);}).catch(()=>{if(!controller.signal.aborted)setError(true);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[position?.latitude,position?.longitude,search,status,radius,attempt]);
 return {data,loading,error,retry:()=>setAttempt(value=>value+1)};
}
