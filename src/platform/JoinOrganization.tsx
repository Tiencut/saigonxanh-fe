import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Building2,CheckCircle2,FileText,Leaf,LoaderCircle,LockKeyhole,Mail,MapPin,Megaphone,Send,UserRound,UsersRound} from 'lucide-react';
import {api,ApiError} from '../api';
import {JoinLandscape} from './JoinLandscape';
import './platform-join.css';

const fields = [
 {name:'name',label:'Tên tổ chức',placeholder:'Nhập tên tổ chức của bạn',icon:Building2,max:150,auto:'organization'},
 {name:'contactName',label:'Người liên hệ',placeholder:'Họ và tên người liên hệ',icon:UserRound,max:100,auto:'name'},
 {name:'email',label:'Email liên hệ',placeholder:'Email để chúng tôi liên hệ với bạn',icon:Mail,max:200,auto:'email'},
 {name:'region',label:'Khu vực hoạt động',placeholder:'Ví dụ: Hà Nội, Đà Nẵng, toàn quốc…',icon:MapPin,max:100,auto:'address-level1'},
] as const;

export function JoinOrganization() {
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false);
 const feedback=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(done||error)feedback.current?.focus();},[done,error]);
 async function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();if(busy)return;
  const payload=Object.fromEntries([...new FormData(event.currentTarget)].map(([key,value])=>[key,typeof value==='string'?value.trim():value]));
  setBusy(true);setError('');
  try {
   await api('/platform/applications',{method:'POST',body:JSON.stringify(payload)});
   setDone(true);
  } catch(cause) {
   setError(cause instanceof ApiError&&cause.status===429
    ?'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau ít phút.'
    :'Chưa gửi được đăng ký. Vui lòng kiểm tra thông tin và kết nối mạng rồi thử lại.');
  } finally {setBusy(false);}
 }
 return <main className="ctx-join-page">
  <div className="ctx-join-container">
   <header className="ctx-join-heading"><h1>Đưa tổ chức của bạn lên Chung Tay Xanh</h1><p>Gửi thông tin để quản trị nền tảng liên hệ, xác minh và hỗ trợ tạo không gian riêng.<br/>{' '}Đăng ký không đồng nghĩa với việc được công khai ngay.</p></header>
   <div className="ctx-join-layout">
    <section className="ctx-registration" aria-labelledby="ctx-registration-title">
     {done?<div className="ctx-join-success" role="status" ref={feedback} tabIndex={-1}>
      <CheckCircle2 size={42}/><h2>Đã nhận thông tin đăng ký</h2><p>Quản trị nền tảng sẽ xem xét và liên hệ qua email bạn đã cung cấp để xác minh tổ chức.</p><Link className="ctx-primary" to="/organizations">Xem các tổ chức <ArrowRight size={18}/></Link>
     </div>:<>
      <div className="ctx-registration-heading"><span className="ctx-join-icon"><FileText size={25}/></span><div><h2 id="ctx-registration-title">Thông tin đăng ký tổ chức</h2><p>Vui lòng cung cấp thông tin đầy đủ để chúng tôi có thể liên hệ và hỗ trợ bạn tốt nhất.</p></div></div>
      <form onSubmit={submit} aria-busy={busy}>
       <fieldset disabled={busy}>
        {fields.map(({name,label,placeholder,icon:Icon,max,auto})=><label key={name} htmlFor={`ctx-join-${name}`}><span>{label} <span className="ctx-required" aria-label="bắt buộc">*</span></span><span className="ctx-input-wrap"><Icon size={19} aria-hidden="true"/><input id={`ctx-join-${name}`} name={name} type={name==='email'?'email':'text'} required minLength={2} maxLength={max} autoComplete={auto} placeholder={placeholder}/></span></label>)}
        <label htmlFor="ctx-join-message"><span>Giới thiệu hoạt động <span className="ctx-required" aria-label="bắt buộc">*</span></span><span className="ctx-input-wrap ctx-textarea-wrap"><FileText size={19} aria-hidden="true"/><textarea id="ctx-join-message" name="message" required minLength={20} maxLength={3000} rows={4} placeholder="Giới thiệu về sứ mệnh, lĩnh vực và các hoạt động nổi bật của tổ chức…" aria-describedby="ctx-message-hint"/></span><small id="ctx-message-hint">Từ 20 đến 3.000 ký tự.</small></label>
       </fieldset>
       {error&&<div className="ctx-join-error" role="alert" tabIndex={-1} ref={feedback}>{error}</div>}
       <button type="submit" className="ctx-primary ctx-join-submit" disabled={busy}>{busy?<LoaderCircle className="ctx-join-spinner" size={18}/>:<Send size={18}/>} {busy?'Đang gửi…':'Gửi đăng ký'}{!busy&&<ArrowRight size={18}/>}</button>
       <p className="ctx-join-privacy"><LockKeyhole size={15} aria-hidden="true"/>Thông tin liên hệ chỉ phục vụ việc tiếp nhận và xác minh đăng ký, không công khai trong danh sách tổ chức.</p>
      </form>
     </>}
    </section>
    <aside className="ctx-join-aside" aria-labelledby="ctx-join-aside-title">
     <div className="ctx-join-aside-copy"><p className="ctx-join-aside-intro">Cùng nhau vì một Việt Nam xanh hơn</p><h2 id="ctx-join-aside-title">Kết nối tổ chức.<br/>Tạo tác động lớn hơn.</h2><p>Giới thiệu cộng đồng của bạn và kết nối với những người muốn cùng hành động vì môi trường.</p>
      <ul className="ctx-join-benefits">
       <li><span className="ctx-join-icon"><UsersRound size={24}/></span><div><h3>Kết nối cộng đồng</h3><p>Giúp người tình nguyện tìm thấy tổ chức và cách tham gia.</p></div></li>
       <li><span className="ctx-join-icon"><Megaphone size={24}/></span><div><h3>Lan tỏa hoạt động</h3><p>Chia sẻ chương trình và sự kiện do tổ chức của bạn quản lý.</p></div></li>
       <li><span className="ctx-join-icon"><Leaf size={24}/></span><div><h3>Không gian riêng cho tổ chức</h3><p>Quản lý thông tin, hoạt động và nhận diện của từng cộng đồng.</p></div></li>
      </ul>
     </div>
     <JoinLandscape/>
    </aside>
   </div>
  </div>
 </main>;
}
