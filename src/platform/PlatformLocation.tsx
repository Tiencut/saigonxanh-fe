import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {LoaderCircle,LocateFixed,MapPin} from 'lucide-react';

export type SearchPosition={latitude:number;longitude:number;source:'device'|'map';accuracy?:number};
type LocationState={position:SearchPosition|null;status:'idle'|'locating'|'located'|'denied'|'error'|'unsupported';message:string;locate:()=>void;chooseArea:(latitude:number,longitude:number)=>void};
const Context=createContext<LocationState|null>(null);
export function PlatformLocationProvider({children}:{children:ReactNode}) {
 const {pathname}=useLocation(),started=useRef(false),pending=useRef(false),alive=useRef(true);
 const [position,setPosition]=useState<SearchPosition|null>(null),[status,setStatus]=useState<LocationState['status']>('idle'),[message,setMessage]=useState('');
 const generation=useRef(0);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 const locate=useCallback(()=>{
  if(pending.current)return;
  if(!navigator.geolocation){setStatus('unsupported');setMessage('Thiết bị chưa hỗ trợ định vị. Chọn khu vực trên bản đồ để tìm hoạt động.');return;}
  const id=++generation.current;pending.current=true;setStatus('locating');setMessage('Đang lấy vị trí của bạn…');
  navigator.geolocation.getCurrentPosition(result=>{
   if(!alive.current||id!==generation.current)return;
   pending.current=false;
   const {latitude,longitude,accuracy}=result.coords;
   if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180){setStatus('error');setMessage('Vị trí chưa hợp lệ. Bạn có thể chọn khu vực trên bản đồ.');return;}
   setPosition({latitude,longitude,accuracy,source:'device'});setStatus('located');setMessage('Đã lấy vị trí. Ưu tiên hoạt động gần bạn nhất.');
  },error=>{
   if(!alive.current||id!==generation.current)return;
   pending.current=false;setStatus(error.code===1?'denied':'error');
   setMessage(error.code===1?'Chưa được cấp quyền vị trí. Cho phép trong trình duyệt hoặc chọn khu vực trên bản đồ.':'Chưa lấy được vị trí. Thử lại hoặc chọn khu vực trên bản đồ.');
  },{enableHighAccuracy:false,timeout:10000,maximumAge:120000});
 },[]);
 const chooseArea=useCallback((latitude:number,longitude:number)=>{
  generation.current++;pending.current=false;setPosition({latitude,longitude,source:'map'});setStatus('located');setMessage('Đang tìm hoạt động quanh khu vực bạn chọn.');
 },[]);
 useEffect(()=>{if(['/', '/activities','/map'].includes(pathname)&&!started.current){started.current=true;locate();}},[pathname,locate]);
 return <Context.Provider value={{position,status,message,locate,chooseArea}}>{children}</Context.Provider>;
}
export function usePlatformLocation(){const value=useContext(Context);if(!value)throw new Error('Platform location provider missing');return value;}
export function PlatformLocationStatus() {
 const {position,status,message,locate}=usePlatformLocation();
 return <div className="ctx-location-status" data-state={status}>
  {status==='locating'?<LoaderCircle size={16} className="ctx-location-spinner"/>:<MapPin size={16}/>}
  <span role="status">{message||'Vị trí chỉ dùng để tìm hoạt động phù hợp.'}</span>
  {status!=='locating'&&<button type="button" onClick={locate}><LocateFixed size={14}/>{position?.source==='device'?'Cập nhật vị trí':'Dùng vị trí của tôi'}</button>}
 </div>;
}
