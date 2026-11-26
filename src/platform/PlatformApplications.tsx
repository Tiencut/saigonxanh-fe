import {useEffect,useRef,useState,type FormEvent} from 'react';
import {ArrowLeft,ArrowRight,Search} from 'lucide-react';
import {api,ApiError} from '../api';

export type Application={id:string;name:string;contactName:string;email:string;region:string;message:string;status:string;createdAt:string;organizationId:string|null;organization?:{id:string;name:string;slug:string}|null};
const statusNames:Record<string,string>={PENDING:'Chờ xem xét',CONTACTED:'Đã liên hệ',APPROVED:'Đã duyệt',REJECTED:'Từ chối'};
const slugify=(name:string)=>name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
const messages:Record<string,string>={OWNER_ACCOUNT_REQUIRED:'Người phụ trách chưa có tài khoản hoạt động. Hãy đề nghị họ đăng ký trước, rồi thử lại.',ORGANIZATION_SLUG_EXISTS:'Mã tổ chức đã tồn tại. Hãy chọn mã khác.',APPLICATION_ALREADY_CONVERTED:'Hồ sơ này đã tạo tổ chức. Hãy tải lại danh sách.',APPLICATION_REJECTED:'Hãy mở lại hồ sơ trước khi duyệt.',APPLICATION_CHANGED:'Hồ sơ vừa được thay đổi. Hãy tải lại danh sách.'};

export function PlatformApplications({rows,reload,onManage}:{rows:Application[];reload:()=>Promise<void>;onManage:(id:string)=>void}) {
 const [selected,setSelected]=useState<string|null>(null),[query,setQuery]=useState(''),[filter,setFilter]=useState('ALL');
 const [approving,setApproving]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[confirmReject,setConfirmReject]=useState(false);
 const feedback=useRef<HTMLParagraphElement>(null);
 useEffect(()=>{if(error||notice)feedback.current?.focus();},[error,notice]);
 const application=rows.find(row=>row.id===selected);
 const visible=rows.filter(row=>(filter==='ALL'||row.status===filter)&&(row.name+' '+row.email+' '+row.region).toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
 function select(id:string|null){setSelected(id);setApproving(false);setConfirmReject(false);setError('');setNotice('');}
 async function changeStatus(status:string) {
  if(!application||busy)return;setBusy(true);setError('');setNotice('');
  try {await api('/platform/admin/applications/'+application.id,{method:'PATCH',body:JSON.stringify({status})});await reload();setNotice('Đã cập nhật trạng thái hồ sơ.');}
  catch(e){setError(e instanceof ApiError?messages[e.code]||'Không cập nhật được hồ sơ. Hãy thử lại.':'Không kết nối được máy chủ.');}
  finally{setBusy(false);}
 }
 async function approve(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();if(!application||busy)return;setBusy(true);setError('');setNotice('');
  const payload=Object.fromEntries(new FormData(event.currentTarget));
  try {await api('/platform/admin/applications/'+application.id+'/approve',{method:'POST',body:JSON.stringify(payload)});setApproving(false);await reload();setNotice('Đã duyệt và tạo tổ chức ở trạng thái ẩn. Người phụ trách đã được cấp quyền chủ sở hữu.');}
  catch(e){setError(e instanceof ApiError?messages[e.code]||'Không tạo được tổ chức. Hãy kiểm tra thông tin và thử lại.':'Không kết nối được máy chủ.');}
  finally{setBusy(false);}
 }
 return <section className="ctx-applications" aria-labelledby="ctx-applications-title">
  <h2 id="ctx-applications-title">Đăng ký tham gia ({rows.length})</h2>
  <p className="ctx-review-description">Xem thông tin, liên hệ người phụ trách và tạo tổ chức từ hồ sơ đã xác minh.</p>
  {(error||notice)&&<p ref={feedback} tabIndex={-1} role={error?'alert':'status'}>{error||notice}</p>}
  {application?<div className="ctx-application-detail">
   <button className="ctx-secondary" disabled={busy} onClick={()=>select(null)}><ArrowLeft size={16}/> Danh sách đăng ký</button>
   <header><div><h3>{application.name}</h3><p>{statusNames[application.status]} · Gửi ngày {new Date(application.createdAt).toLocaleDateString('vi-VN')}</p></div></header>
   <dl><div><dt>Người liên hệ</dt><dd>{application.contactName}</dd></div><div><dt>Email</dt><dd><a href={'mailto:'+application.email}>{application.email}</a></dd></div><div><dt>Khu vực</dt><dd>{application.region}</dd></div></dl>
   <h3>Giới thiệu hoạt động</h3><p className="ctx-application-message">{application.message}</p>
   {application.organizationId?<div className="ctx-approval-result"><h3>Đã tạo tổ chức</h3><p>{application.organization?.name} · {application.organization?.slug}</p><p>Tổ chức được tạo ở trạng thái ẩn. Kiểm tra nhận diện, domain và quyền trước khi công khai.</p><button className="ctx-primary" onClick={()=>onManage(application.organizationId!)}>Quản lý tổ chức <ArrowRight size={16}/></button></div>:<>
    <div className="ctx-review-actions">
     {application.status==='REJECTED'?<button className="ctx-secondary" disabled={busy} onClick={()=>void changeStatus('PENDING')}>Mở lại hồ sơ</button>:<>
      {application.status!=='CONTACTED'&&<button className="ctx-secondary" disabled={busy} onClick={()=>void changeStatus('CONTACTED')}>Đánh dấu đã liên hệ</button>}
      <button className="ctx-primary" disabled={busy||approving} onClick={()=>{setApproving(true);setError('');}}>Duyệt và tạo tổ chức</button>
      <button className="ctx-secondary" disabled={busy} onClick={()=>setConfirmReject(true)}>Từ chối</button>
     </>}
    </div>
    {confirmReject&&<div className="ctx-inline-confirm" role="group" aria-label="Xác nhận từ chối hồ sơ"><span>Từ chối hồ sơ của <strong>{application.name}</strong>? Hồ sơ vẫn được lưu và có thể mở lại.</span><button type="button" className="ctx-danger-button" disabled={busy} onClick={()=>{setConfirmReject(false);void changeStatus('REJECTED');}}>Xác nhận từ chối</button><button type="button" className="ctx-secondary" disabled={busy} onClick={()=>setConfirmReject(false)}>Hủy</button></div>}
    {approving&&<form className="ctx-approval-form" onSubmit={approve}>
     <h3>Xác nhận thông tin tổ chức</h3><p>Thông tin đã được điền từ hồ sơ. Người phụ trách phải có tài khoản trên Chung Tay Xanh. Duyệt sẽ cấp quyền chủ sở hữu cho email bên dưới.</p>
     <fieldset disabled={busy}><div className="ctx-form-grid">
      <label>Tên tổ chức *<input name="name" required minLength={2} maxLength={150} defaultValue={application.name}/></label>
      <label>Mã tổ chức *<input name="slug" required pattern="[a-z][a-z0-9-]{2,39}" maxLength={40} defaultValue={slugify(application.name)} aria-describedby="ctx-slug-help"/><small id="ctx-slug-help">3–40 ký tự: chữ thường, số và dấu gạch ngang; bắt đầu bằng chữ.</small></label>
      <label>Khu vực<input name="region" maxLength={100} defaultValue={application.region}/></label>
      <label>Email liên hệ *<input name="contactEmail" type="email" required defaultValue={application.email}/></label>
      <label>Email tài khoản phụ trách *<input name="ownerEmail" type="email" required defaultValue={application.email}/></label>
     </div><label>Giới thiệu<textarea name="description" maxLength={1000} rows={4} defaultValue={application.message.slice(0,1000)}/></label></fieldset>
     <p className="ctx-review-description">Chưa công khai tổ chức, chưa gắn domain và không thêm dữ liệu mẫu.</p>
     <div className="ctx-review-actions"><button type="submit" className="ctx-primary" disabled={busy}>{busy?'Đang tạo…':'Xác nhận duyệt và tạo'}</button><button type="button" className="ctx-secondary" disabled={busy} onClick={()=>setApproving(false)}>Hủy</button></div>
    </form>}
   </>}
  </div>:<>
   <div className="ctx-review-filters"><label><span><Search size={15}/> Tìm hồ sơ</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tên tổ chức, email, khu vực"/></label><label>Trạng thái<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="ALL">Tất cả</option>{Object.entries(statusNames).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label></div>
   {!visible.length?<p className="ctx-empty">{rows.length?'Không có hồ sơ phù hợp với bộ lọc.':'Chưa có đăng ký mới.'}</p>:<div className="ctx-application-list">{visible.map(row=><article key={row.id}><div><h3>{row.name}</h3><p>{row.contactName} · {row.email}</p><small>{row.region} · {new Date(row.createdAt).toLocaleDateString('vi-VN')}</small></div><span>{statusNames[row.status]}</span><button className="ctx-secondary" onClick={()=>select(row.id)}>Xem hồ sơ</button></article>)}</div>}
  </>}
 </section>;
}
