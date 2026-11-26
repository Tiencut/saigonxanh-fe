import {Link} from 'react-router-dom';
import {ArrowUpRight, Map, MapPin} from 'lucide-react';
import {PlatformLocationStatus,usePlatformLocation} from './PlatformLocation';

export function PlatformHero() {
 const {position,status,locate}=usePlatformLocation();
 return <section className="ctx-home-hero" aria-labelledby="ctx-home-title">
  <div className="ctx-hero-copy">
   <p className="ctx-intro">Kết nối cộng đồng vì môi trường</p>
   <h1 id="ctx-home-title">Việc xanh gần bạn.<br/>Cùng nhau bắt đầu.</h1>
   <p>Tìm hoạt động tình nguyện, tham gia cùng cộng đồng và góp sức cho môi trường trong lành hơn.</p>
   <div className="ctx-actions">
    <a className="ctx-primary" href="#nearby-activities" onClick={()=>{if(!position&&status!=='locating')locate();}}><MapPin size={18}/>Tìm hoạt động gần tôi</a>
    <Link className="ctx-text-link" to="/map"><Map size={18}/>Khám phá bản đồ</Link>
   </div>
   <PlatformLocationStatus/>
  </div>
  <figure className="ctx-hero-photo">
   <img src="/images/platform/community-volunteers-hero-v2.webp" alt="Ảnh minh họa AI: hai tình nguyện viên thu gom chai nhựa bên dòng sông xanh" width="1672" height="941" fetchPriority="high"/>
   <figcaption><span>Ảnh minh họa AI</span><Link to="/organizations">Gặp gỡ các tổ chức <ArrowUpRight size={17}/></Link></figcaption>
  </figure>
 </section>;
}
