import {useEffect,useState} from 'react';
import {Link,Routes,Route,Navigate,useParams} from 'react-router-dom';
import {ArrowUpRight,MapPin,Users} from 'lucide-react';
import {api,useAuth} from '../api';
import type {PublicConfig} from '../App';
import {SgxAuthPage} from '../saigonxanh/components/SgxAuthPage';
import {PlatformAdmin} from './PlatformAdmin';
import {PlatformHeader} from './PlatformHeader';
import {PlatformLocationProvider} from './PlatformLocation';
import {PlatformActivities as Activities} from './PlatformActivities';
import {PlatformOrganizationInvite} from './PlatformOrganizationInvite';
import {SaiGonXanhApp} from '../saigonxanh/SaiGonXanhApp';
import {OrganizationWorkspace} from '../organizations/OrganizationWorkspace';
import {OrganizationBrandProvider} from '../organizations/OrganizationBrand';
import './platform.css';
import {PlatformHero} from './PlatformHero';
import {JoinOrganization} from './JoinOrganization';
import './platform-home.css';
import './platform-discovery.css';
import './platform-nearby.css';

type Org={id:string;slug:string;name:string;description:string;region:string;iconUrl:string;url:string};

export function PlatformApp({config}:{config:PublicConfig}){
  return (
    <PlatformLocationProvider>
      <PlatformShell config={config}/>
    </PlatformLocationProvider>
  );
}

function PlatformFooter(){
  return (
    <footer className="ctx-footer">
      <strong>Chung Tay Xanh</strong>
      <p>Nền tảng kết nối các tổ chức và người tình nguyện vì môi trường.</p>
      <Link to="/join">Đăng ký tổ chức</Link>
      <span>© {new Date().getFullYear()} Chung Tay Xanh</span>
    </footer>
  );
}

function OrgRouteSwitcher(){
  const {orgSlug}=useParams<{orgSlug:string}>();
  const [orgConfig,setOrgConfig]=useState<PublicConfig|null>(null);
  const [loading,setLoading]=useState(true);
  const [notFound,setNotFound]=useState(false);

  useEffect(()=>{
    if(!orgSlug)return;
    setLoading(true);
    setNotFound(false);
    api<PublicConfig>(`/public/config?org=${orgSlug}`)
      .then((cfg)=>{
        if(!cfg.organization){
          setNotFound(true);
        } else {
          setOrgConfig(cfg);
          document.title=cfg.display_name;
          if(cfg.theme){
            document.documentElement.style.setProperty('--primary',cfg.theme.primary);
            document.documentElement.style.setProperty('--background',cfg.theme.background);
          }
        }
      })
      .catch(()=>setNotFound(true))
      .finally(()=>setLoading(false));
  },[orgSlug]);

  if(loading){
    return (
      <main className="boot" style={{display:'flex',minHeight:'60vh',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#64748b',fontSize:16}}>Đang tải thông tin tổ chức…</p>
      </main>
    );
  }

  if(notFound||!orgConfig||!orgConfig.organization){
    return (
      <div className="ctx-platform">
        <PlatformHeader/>
        <main className="ctx-content" style={{textAlign:'center',padding:'60px 20px'}}>
          <h1 style={{fontSize:24,fontWeight:700,marginBottom:12}}>Không tìm thấy tổ chức</h1>
          <p style={{color:'#64748b',marginBottom:24}}>Tổ chức &ldquo;{orgSlug}&rdquo; không tồn tại hoặc chưa được kích hoạt công khai.</p>
          <Link to="/organizations" className="ctx-primary" style={{display:'inline-block',textDecoration:'none'}}>
            Xem danh sách tổ chức
          </Link>
        </main>
        <PlatformFooter/>
      </div>
    );
  }

  const baseRoute=`/${orgSlug}`;

  return (
    <OrganizationBrandProvider
      value={{
        organization: orgConfig.organization,
        reload: async()=>{
          const updated=await api<PublicConfig>(`/public/config?org=${orgSlug}`);
          setOrgConfig(updated);
          document.title=updated.display_name;
        },
      }}
    >
      {orgSlug==='saigonxanh' ? (
        <SaiGonXanhApp baseRoute={baseRoute}/>
      ) : (
        <OrganizationWorkspace config={orgConfig} baseRoute={baseRoute}/>
      )}
    </OrganizationBrandProvider>
  );
}

function PlatformShell({config}:{config:PublicConfig}){
  const {user,logout}=useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <PlatformHome/>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/organizations"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <Directory/>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/activities"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <Activities/>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/map"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <Activities mapView/>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/join"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <JoinOrganization/>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <SgxAuthPage config={config}/>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <SgxAuthPage config={config} register/>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/account"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <main className="ctx-content">
              <h1>Tài khoản của bạn</h1>
              {user ? (
                <>
                  <p>{user.name} · {user.email}</p>
                  <p>Cùng một tài khoản có thể tham gia nhiều tổ chức. Phiên đăng nhập hiện được quản lý riêng theo từng tên miền.</p>
                  <Link to="/organizations">Tìm tổ chức để tham gia</Link>
                  <p><button className="ctx-secondary" onClick={()=>void logout()}>Đăng xuất</button></p>
                </>
              ) : (
                <Navigate to="/login" replace/>
              )}
            </main>
            <PlatformFooter/>
          </div>
        }
      />
      <Route
        path="/admin/*"
        element={
          <div className="ctx-platform ctx-platform-admin">
            {user ? <PlatformAdmin/> : <Navigate to="/login?next=%2Fadmin" replace/>}
          </div>
        }
      />

      {/* GitHub-style organization routing (e.g. /saigonxanh, /saigonxanh/map, /saigonxanh/admin) */}
      <Route path="/:orgSlug/*" element={<OrgRouteSwitcher/>}/>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="ctx-platform">
            <PlatformHeader/>
            <main className="ctx-content">
              <h1>Không tìm thấy trang</h1>
              <Link to="/">Về trang chủ</Link>
            </main>
            <PlatformFooter/>
          </div>
        }
      />
    </Routes>
  );
}

function usePlatformData<T>(route:string){const [data,setData]=useState<T|null>(null),[error,setError]=useState('');useEffect(()=>{let live=true;api<T>(route).then(value=>{if(live)setData(value);}).catch(e=>{if(live)setError(e.message);});return()=>{live=false;};},[route]);return {data,error};}
function PlatformHome(){return <main className="ctx-home"><PlatformHero/><Activities embedded/><Directory embedded/><PlatformOrganizationInvite/></main>;}
function Directory({embedded=false,mapIntro=false}:{embedded?:boolean;mapIntro?:boolean}){
 const {data,error}=usePlatformData<Org[]>('/platform/directory'),[query,setQuery]=useState('');
 const rows=(data||[]).filter(o=>(o.name+' '+o.region).toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
 return <section className="ctx-content ctx-directory"><div className="ctx-section-heading"><div>{embedded?<h2>Tổ chức đồng hành</h2>:<h1>{mapIntro?'Bản đồ và tổ chức môi trường':'Tổ chức trên Chung Tay Xanh'}</h1>}<p>{mapIntro?'Mở bản đồ tại từng tổ chức để xem điểm rác và hoạt động trong phạm vi của đơn vị đó.':'Chỉ hiển thị tổ chức đã được quản trị nền tảng xác minh.'}</p></div>{embedded&&<Link to="/organizations">Xem tất cả <ArrowUpRight size={16}/></Link>}</div>
 {!embedded&&<label className="ctx-search">Tìm tổ chức hoặc khu vực<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tên tổ chức, tỉnh hoặc thành phố"/></label>}
 {error?<p role="alert">Không tải được danh sách. <button onClick={()=>location.reload()}>Thử lại</button></p>:!data?<p role="status">Đang tải tổ chức…</p>:!rows.length?<p className="ctx-empty">Chưa có tổ chức phù hợp.</p>:<div className="ctx-org-list">{rows.map(org=><article key={org.id}><div className="ctx-org-heading">{org.iconUrl?<img src={org.iconUrl} alt=""/>:<Users size={30}/>}<div><h3>{org.name}</h3><span><MapPin size={14}/>{org.region||'Thông tin khu vực đang cập nhật'}</span></div></div><p>{org.description||'Xem thông tin, hoạt động và cách tham gia tại trang của tổ chức.'}</p><div className="ctx-org-links"><Link to={org.url}>Trang tổ chức <ArrowUpRight size={16}/></Link><Link to={org.url+'/map'}>Bản đồ môi trường</Link></div></article>)}</div>}</section>;
}
