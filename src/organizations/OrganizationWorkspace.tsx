import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Link,Routes,Route} from 'react-router-dom';
import {api,useAuth} from '../api';
import type {PublicConfig} from '../App';
import {OrganizationLogo,OrganizationName} from './OrganizationBrand';
import {SaiGonXanhAdmin} from '../saigonxanh/SaiGonXanhAdmin';
import {SgxAuthPage} from '../saigonxanh/components/SgxAuthPage';
import {SgxAccountPage} from '../saigonxanh/components/SgxAccountPage';
import {SaiGonXanhMap} from '../saigonxanh/SaiGonXanhMap';
import '../platform/platform.css';

export function OrganizationWorkspace({config, baseRoute = ''}:{config:PublicConfig; baseRoute?: string}){
 const user=useAuth(s=>s.user);
 const homeLink = baseRoute || '/';
 const mapLink = baseRoute ? `${baseRoute}/map` : '/map';
 const accountLink = user ? (baseRoute ? `${baseRoute}/account` : '/account') : (baseRoute ? `${baseRoute}/login` : '/login');
 const adminLink = baseRoute ? `${baseRoute}/admin` : '/admin';
 return <div className="ctx-platform"><header className="ctx-header"><Link to={homeLink} className="ctx-brand"><OrganizationLogo style={{width:48,height:48}}/><OrganizationName/></Link><nav data-open="true"><Link to={mapLink}>Bản đồ</Link><Link to={accountLink}>{user?'Tài khoản':'Đăng nhập'}</Link>{user?.roles.includes('ADMIN')&&<Link to={adminLink}>Quản trị tổ chức</Link>}</nav></header><Routes><Route path="admin/*" element={<SaiGonXanhAdmin baseRoute={baseRoute}/>}/><Route path="login" element={<SgxAuthPage config={config}/>}/><Route path="register" element={<SgxAuthPage config={config} register/>}/><Route path="account" element={<SgxAccountPage config={config}/>}/><Route path="map" element={<SaiGonXanhMap/>}/><Route path="*" element={<OrganizationHome config={config} baseRoute={baseRoute}/>}/></Routes><footer className="ctx-footer"><OrganizationName/><a href="https://chungtayxanh.id.vn">Một tổ chức trên Chung Tay Xanh</a></footer></div>;
}
function OrganizationHome({config, baseRoute = ''}:{config:PublicConfig; baseRoute?: string}){
 const [campaigns,setCampaigns]=useState<any[]|null>(null),[error,setError]=useState(''),[selected,setSelected]=useState<any>(null),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{api<any[]>('/public/saigonxanh/campaigns').then(setCampaigns).catch(e=>setError(e.message));},[]);
 const handledCampaign=useRef(false);
 useEffect(()=>{const id=new URLSearchParams(location.search).get('campaign');if(!id||handledCampaign.current||!campaigns)return;const row=campaigns.find(item=>item.id===id&&['UPCOMING','ONGOING'].includes(item.status));if(row){handledCampaign.current=true;setSelected(row);}},[campaigns]);
 async function register(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setNotice('');try{await api('/public/saigonxanh/campaigns/'+selected.id+'/register',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))});setNotice('Đã tiếp nhận đăng ký tham gia.');setSelected(null);}catch(e){setNotice(e instanceof Error?e.message:'Không đăng ký được.');}finally{setBusy(false);}}
 return <main className="ctx-content"><p className="ctx-eyebrow">TỔ CHỨC MÔI TRƯỜNG</p><h1>{config.display_name}</h1><p>{(config.organization as any)?.description||'Thông tin giới thiệu đang được tổ chức cập nhật.'}</p><Link className="ctx-secondary" to={baseRoute ? `${baseRoute}/map` : "/map"}>Xem bản đồ môi trường</Link><section id="volunteer-campaigns" style={{marginTop:32}}><h2>Chiến dịch của tổ chức</h2>{error?<p role="alert">{error}</p>:!campaigns?<p role="status">Đang tải…</p>:!campaigns.length?<p className="ctx-empty">Tổ chức chưa công bố chiến dịch.</p>:<div className="ctx-activities">{campaigns.map(c=><article key={c.id}><div><h3>{c.title}</h3><p>{c.location}</p><time>{new Date(c.startDate).toLocaleDateString('vi-VN')}</time></div>{['UPCOMING','ONGOING'].includes(c.status)&&<button className="ctx-secondary" onClick={()=>setSelected(c)}>Đăng ký tham gia</button>}</article>)}</div>}{notice&&<p role="status">{notice}</p>}{selected&&<form onSubmit={register}><h3>Tham gia {selected.title}</h3>{[['fullName','Họ tên'],['phone','Điện thoại'],['email','Email']].map(([name,label])=><label key={name}>{label} *<input name={name} type={name==='email'?'email':'text'} required/></label>)}<button className="ctx-primary" disabled={busy}>Gửi đăng ký</button><button type="button" className="ctx-secondary" onClick={()=>setSelected(null)}>Hủy</button></form>}</section></main>;
}
