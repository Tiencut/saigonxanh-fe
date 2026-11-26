import {useEffect,useState} from 'react';
import {CalendarDays,MapPin,Users,ArrowUpRight} from 'lucide-react';
import {activityImage,formatDistance,type PlatformActivity} from './activityTypes';

export function PlatformActivityCard({item,index,selected,onSelect}:{item:PlatformActivity;index:number;selected:boolean;onSelect:()=>void}) {
 const image=activityImage(item),[failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[image]);
 return <article id={'ctx-activity-'+item.id} className={'ctx-nearby-card'+(selected?' is-selected':'')} data-activity-id={item.id}>
  <button className="ctx-card-visual" onClick={onSelect} aria-pressed={selected} aria-label={'Xem '+item.title+' trên bản đồ'} disabled={item.latitude===null||item.longitude===null}>
   {image&&!failed?<img src={image} alt="" loading="lazy" onError={()=>setFailed(true)}/>:<CalendarDays size={32} aria-hidden="true"/>}
   <span className="ctx-card-index">{index+1}</span>
  </button>
  <div className="ctx-card-details"><div className="ctx-card-topline"><span className="ctx-card-status" data-status={item.status}>{item.status==='ONGOING'?'Đang diễn ra':'Sắp diễn ra'}</span><span className="ctx-card-distance">{item.distanceKm!==null?<><MapPin size={12}/>{formatDistance(item.distanceKm)}</>:item.latitude===null?'Chưa có tọa độ':null}</span></div>
   <h3><button disabled={item.latitude===null||item.longitude===null} onClick={onSelect}>{item.title}</button></h3>
   <p className="ctx-card-location"><MapPin size={13}/>{item.location||'Xem địa điểm tại tổ chức'}</p>
   <div className="ctx-card-meta"><time dateTime={item.startDate}><CalendarDays size={13}/>{new Date(item.startDate).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'})}</time><span><Users size={13}/>{item.currentVolunteers}{item.targetVolunteers>0?'/'+item.targetVolunteers:''} người</span></div>
   <div className="ctx-card-bottom"><span>{item.organization.name}</span><a href={item.url}>Xem và tham gia <ArrowUpRight size={14}/></a></div>
  </div>
 </article>;
}
