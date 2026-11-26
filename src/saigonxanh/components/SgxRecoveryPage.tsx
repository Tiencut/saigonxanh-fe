import { OrganizationLogo, OrganizationName } from '../../organizations/OrganizationBrand';
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { post, useAuth } from '../../api';
import './sgxAuth.css';

export function SgxRecoveryPage({kind,enabled}:{kind:'forgot'|'reset'|'verify';enabled:boolean}) {
  const [params]=useSearchParams();
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[code,setCode]=useState('');
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState(''),[done,setDone]=useState(false);
  const title=kind==='verify'?'Xác minh email':kind==='forgot'?'Quên mật khẩu':'Đặt lại mật khẩu';
  const token=params.get('token');
  async function submit(event:FormEvent){
    event.preventDefault();if(busy)return;
    setBusy(true);setError('');
    try {
      if(kind==='forgot') {
        await post('/auth/reset/request',{email:email.trim().toLowerCase()});
        setMessage('Nếu email đã được đăng ký, bạn sẽ nhận được liên kết đặt lại mật khẩu. Vui lòng kiểm tra cả thư mục spam.');
      } else {
        await post(`/auth/${kind}/confirm`,{token,password:kind==='reset'?password:undefined,code:code||undefined});
        if(kind==='reset')useAuth.getState().clear();
        else if(useAuth.getState().user)await useAuth.getState().reload();
        setMessage(kind==='reset'?'Đã đổi mật khẩu. Vui lòng đăng nhập lại.':'Email đã được xác minh.');
      }
      setDone(true);
    } catch {setError(kind==='forgot'?'Chưa thể gửi email. Vui lòng thử lại sau.':'Liên kết không hợp lệ, đã dùng hoặc hết hạn. Vui lòng yêu cầu liên kết mới; kiểm tra mã hai bước nếu có.');}
    finally {setBusy(false);}
  }
  return <main className="sgx-auth-page"><div className="sgx-auth-panel">
    <Link to="/" className="sgx-auth-brand"><OrganizationLogo alt=""/><OrganizationName /></Link>
    <h1>{title}</h1>
    {!enabled?<p role="status">Chức năng gửi email chưa được bật. Vui lòng liên hệ ban điều phối.</p>:
      kind!=='forgot'&&!token?<p role="alert">Thiếu liên kết xác nhận. Hãy mở liên kết trong email.</p>:
      done?<p role="status">{message}</p>:<form onSubmit={submit}>
        <fieldset disabled={busy}>
          {kind==='forgot'&&<label>Email<input name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>}
          {kind==='reset'&&<>
            <label>Mật khẩu mới<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/></label>
            <small>Ít nhất 12 ký tự.</small>
            <label>Mã xác thực hai bước (nếu đã bật)<input name="totp" autoComplete="one-time-code" value={code} onChange={e=>setCode(e.target.value)}/></label>
          </>}
          {error&&<p role="alert" className="sgx-auth-error">{error}</p>}
          <button type="submit" className="sgx-auth-submit">{busy?'Đang xử lý…':kind==='forgot'?'Gửi liên kết':'Xác nhận'}</button>
        </fieldset>
      </form>}
    <Link to="/login">Quay lại đăng nhập</Link>
    {kind==='verify'&&done&&<p><Link to="/account">Về tài khoản</Link></p>}
  </div></main>;
}
