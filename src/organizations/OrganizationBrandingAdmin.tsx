import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api';
import { useOrganizationBrand } from './OrganizationBrand';

type Draft = {name:string;logoLightUrl:string;logoDarkUrl:string;iconUrl:string};
const slots = [['logoLightUrl','Logo trên nền sáng'],['logoDarkUrl','Logo trên nền tối'],['iconUrl','Biểu tượng']] as const;
export function OrganizationBrandingAdmin() {
  const {organization,reload}=useOrganizationBrand();
  const [draft,setDraft]=useState<Draft|null>(null),[busy,setBusy]=useState(''),[error,setError]=useState(''),[message,setMessage]=useState('');
  useEffect(()=>{if(organization)setDraft({name:organization.name,logoLightUrl:organization.logoLightUrl,logoDarkUrl:organization.logoDarkUrl,iconUrl:organization.iconUrl});},[organization]);
  const update=(field:keyof Draft,value:string)=>{setDraft(old=>old?{...old,[field]:value}:null);setMessage('');};
  const upload=async(slot:keyof Draft,file?:File)=>{
    if(!file)return;
    setError('');setMessage('');
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){setError('Chọn PNG, JPG hoặc WebP, tối đa 5 MB.');return;}
    setBusy(slot);
    try{const form=new FormData();form.append('file',file);const result=await api<{url:string}>('/organizations/current/logo',{method:'POST',body:form});update(slot,result.url);}
    catch(e){setError(e instanceof Error?e.message:'Không tải được ảnh.');}
    finally{setBusy('');}
  };
  const save=async(event:FormEvent)=>{
    event.preventDefault();setBusy('save');setError('');setMessage('');
    try{await api('/organizations/current/branding',{method:'PUT',body:JSON.stringify(draft)});await reload();setMessage('Đã lưu nhận diện tổ chức.');}
    catch(e){setError(e instanceof Error?e.message:'Không lưu được thay đổi.');}
    finally{setBusy('');}
  };
  if(!draft)return <p role="status">Đang tải nhận diện tổ chức…</p>;
  return <section className="organization-branding"><h2>Nhận diện tổ chức</h2>
    <p>Thay đổi chỉ áp dụng cho tổ chức đang quản lý: <strong>{organization?.name}</strong>. Ưu tiên PNG nền trong suốt; logo nền tối nên có màu sáng.</p>
    <form onSubmit={save}><label className="brand-name">Tên hiển thị tổ chức<input name="organizationName" required minLength={2} maxLength={150} value={draft.name} onChange={e=>update('name',e.target.value)} /></label>
      <div className="organization-logo-grid">{slots.map(([slot,label])=><div key={slot}>
        <div className={`organization-logo-preview ${slot==='logoDarkUrl'?'dark':''}`}>{draft[slot]?<img src={draft[slot]} alt={label} onError={()=>setError('Ảnh chưa tải được. Kiểm tra đường dẫn hoặc tải lại ảnh.')} />:<span>Chưa có ảnh</span>}</div>
        <label>{label}<input name={slot} value={draft[slot]} onChange={e=>update(slot,e.target.value)} placeholder="Đường dẫn ảnh từ thư viện hoặc ảnh đã tải" /></label>
        <label className="upload-label">Tải ảnh thay thế<input type="file" name={`${slot}File`} accept="image/png,image/jpeg,image/webp" disabled={!!busy} onChange={e=>{void upload(slot,e.target.files?.[0]);e.target.value='';}} /></label>
      </div>)}</div>
      <p>Ảnh tải lên sẽ được tối ưu để dùng trên web, giữ nền trong suốt. Bấm Lưu để áp dụng.</p>
      {error&&<p role="alert">{error}</p>}
      <div className="brand-actions"><button className="btn-primary-admin" disabled={!!busy} type="submit">{busy==='save'?'Đang lưu…':busy?'Đang tải ảnh…':'Lưu nhận diện'}</button><span role="status">{message}</span></div>
    </form>
  </section>;
}
