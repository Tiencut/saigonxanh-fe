import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,CalendarDays,MapPin,Search} from 'lucide-react';
import {usePlatformLocation,PlatformLocationStatus} from './PlatformLocation';
import {useNearbyActivities} from './useNearbyActivities';
import {PlatformActivityMap} from './PlatformActivityMap';
import {PlatformActivityCard} from './PlatformActivityCard';

export function PlatformActivities({embedded=false,mapView=false}:{embedded?:boolean;mapView?:boolean}) {
 const {position}=usePlatformLocation();
 const [query,setQuery]=useState(''),[status,setStatus]=useState('ALL'),[radius,setRadius]=useState('ALL'),[selected,setSelected]=useState<string|null>(null);
 const {data,loading,error,retry}=useNearbyActivities(position,query,status,radius);
 useEffect(()=>setSelected(null),[position]);
 useEffect(()=>{if(selected&&!data.some(item=>item.id===selected))setSelected(null);},[data,selected]);
 function select(id:string){setSelected(id);document.getElementById('ctx-activity-'+id)?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 return <section id="nearby-activities" className={'ctx-content ctx-activity-section ctx-nearby-section'+(embedded?' is-home':'')} aria-labelledby="ctx-activities-title">
  <div className="ctx-section-heading"><div className="ctx-nearby-heading"><span className="ctx-section-icon"><MapPin size={28}/></span><div>{embedded?<h2 id="ctx-activities-title">Hoạt động gần bạn</h2>:<h1 id="ctx-activities-title">{mapView?'Bản đồ hoạt động cộng đồng':'Tìm hoạt động để cùng tham gia'}</h1>}<p>{position?'Ưu tiên các hoạt động gần khu vực tìm kiếm nhất.':'Khám phá hoạt động từ các tổ chức đã xác minh.'}</p></div></div>{embedded&&<Link to="/activities">Xem tất cả <ArrowUpRight size={16}/></Link>}</div>
  <PlatformLocationStatus/>
  <div className="ctx-activity-tools">
   <label className="ctx-activity-search"><span><Search size={15}/>Tìm hoạt động</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Tên hoạt động, địa điểm hoặc tổ chức"/></label>
   <label>Trạng thái<select value={status} onChange={event=>setStatus(event.target.value)}><option value="ALL">Tất cả</option><option value="UPCOMING">Sắp diễn ra</option><option value="ONGOING">Đang diễn ra</option></select></label>
   <label>Phạm vi<select value={radius} disabled={!position} onChange={event=>setRadius(event.target.value)}><option value="ALL">Tất cả khoảng cách</option><option value="5">Trong 5 km</option><option value="10">Trong 10 km</option><option value="25">Trong 25 km</option><option value="50">Trong 50 km</option><option value="100">Trong 100 km</option></select></label>
  </div>
  <div className="ctx-nearby-layout">
   <PlatformActivityMap activities={data} selected={selected} onSelect={select}/>
   <div className="ctx-nearby-results" aria-busy={loading}>
    <div className="ctx-results-caption"><span role="status">{loading?'Đang tìm hoạt động…':`${data.length} hoạt động${position?' · Ưu tiên gần nhất':''}`}</span>{position&&<small>Khoảng cách đường thẳng</small>}</div>
    {error?<div className="ctx-activity-empty" role="alert"><h3>Chưa tải được hoạt động</h3><p>Kiểm tra kết nối mạng rồi thử lại.</p><button className="ctx-secondary" onClick={retry}>Thử lại</button></div>:!loading&&!data.length?<div className="ctx-activity-empty"><CalendarDays size={32}/><h3>{query||status!=='ALL'||radius!=='ALL'?'Chưa có hoạt động phù hợp':'Chưa có hoạt động công khai sắp diễn ra'}</h3><p>{radius!=='ALL'?'Thử mở rộng phạm vi hoặc chọn một khu vực khác trên bản đồ.':'Bạn có thể tìm hiểu cộng đồng và theo dõi kế hoạch tại trang tổ chức.'}</p>{query||status!=='ALL'||radius!=='ALL'?<button className="ctx-secondary" onClick={()=>{setQuery('');setStatus('ALL');setRadius('ALL');}}>Xóa bộ lọc</button>:<Link className="ctx-secondary" to="/organizations">Tìm tổ chức <ArrowUpRight size={16}/></Link>}</div>:<div className="ctx-activity-feed">{data.map((item,index)=><PlatformActivityCard key={item.id} item={item} index={index} selected={selected===item.id} onSelect={()=>select(item.id)}/>)}</div>}
   </div>
  </div>
  <p className="ctx-nearby-footnote">Chọn điểm trên bản đồ để tìm theo khu vực. Hoạt động chưa có tọa độ vẫn xuất hiện khi chọn tất cả khoảng cách.</p>
 </section>;
}
