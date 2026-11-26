import {useEffect,useRef,useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {Leaf,Menu,X} from 'lucide-react';
import {useAuth} from '../api';

export function PlatformHeader() {
 const {user}=useAuth(),{pathname}=useLocation();
 const [open,setOpen]=useState(false),toggle=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setOpen(false);},[pathname]);
 return <header className="ctx-header" onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);toggle.current?.focus();}}}>
  <Link className="ctx-brand" to="/"><Leaf size={28}/><span>Chung Tay Xanh<small>Kết nối cộng đồng vì môi trường</small></span></Link>
  <button ref={toggle} className="ctx-menu" aria-label={open?'Đóng điều hướng':'Mở điều hướng'} aria-controls="ctx-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  <nav id="ctx-navigation" aria-label="Điều hướng chính" data-open={open} onClick={()=>setOpen(false)}>
   <NavLink to="/" end>Trang chủ</NavLink><NavLink to="/activities">Hoạt động</NavLink><NavLink to="/organizations">Tổ chức</NavLink><NavLink to="/map">Bản đồ</NavLink><NavLink to="/join">Dành cho tổ chức</NavLink>
   <div className="ctx-header-account">{user?<><NavLink to="/account">Tài khoản</NavLink>{user.roles.includes('PLATFORM_ADMIN')&&<NavLink to="/admin">Quản trị</NavLink>}</>:<><NavLink to="/login">Đăng nhập</NavLink><NavLink className="ctx-register-link" to="/register">Đăng ký</NavLink></>}</div>
  </nav>
 </header>;
}
