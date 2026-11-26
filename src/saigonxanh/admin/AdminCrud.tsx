import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { request } from '../../api';
import { resources, type ResourceName } from './adminResourceFields';
import './adminCrud.css';

type Edit = { resource: ResourceName; item?: any; remove?: boolean };
const Context = createContext<(edit: Edit) => void>(() => {});
export function AdminCrudButton({ resource, item, remove = false }: Edit) {
  const open = useContext(Context);
  const label = remove ? 'Xóa' : item ? 'Sửa' : 'Thêm';
  return <button type="button" data-crud={remove ? 'delete' : item ? 'edit' : 'create'} data-resource={resource}
    title={`${label} ${resources[resource].label}`} className={item ? `btn-action-sm ${remove ? 'btn-reject' : ''}` : 'btn-primary-admin'}
    onClick={() => open({ resource, item, remove })}>
    {remove ? <Trash2 size={14} /> : item ? <Pencil size={14} /> : <Plus size={16} />}<span>{label}</span>
  </button>;
}
export function AdminCrudRow({ resource, item, deletable = true }: { resource: ResourceName; item: any; deletable?: boolean }) {
  return <span className="admin-crud-row"><AdminCrudButton resource={resource} item={item} />
    {deletable && <AdminCrudButton resource={resource} item={item} remove />}</span>;
}
function localDate(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function AdminCrudProvider({ children, onRefresh }: { children: React.ReactNode; onRefresh: (resource?: ResourceName) => Promise<void> }) {
  const [edit, setEdit] = useState<Edit | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = (next: Edit) => {
    if (busy) return;
    opener.current = document.activeElement as HTMLElement;
    const values = Object.fromEntries(resources[next.resource].fields.map((field) => {
      let value = next.item?.[field.key] ?? (field.key === 'email' ? next.item?.user?.email : undefined) ?? field.initial ?? '';
      if (field.type === 'datetime-local') value = localDate(value || new Date().toISOString());
      if (field.type === 'checkbox') value = Boolean(value);
      return [field.key, value];
    }));
    setForm(values); setError(''); setEdit(next);
  };
  useEffect(() => { if (edit) dialog.current?.showModal(); }, [edit]);
  const close = () => { if (!busy) { dialog.current?.close(); setEdit(null); opener.current?.focus(); } };
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!edit || busy) return;
    setBusy(true); setError('');
    try {
      const payload = { ...form };
      for (const field of resources[edit.resource].fields) {
        if (field.type === 'number') payload[field.key] = field.nullable && String(payload[field.key]).trim()==='' ? null : Number(payload[field.key]);
        if (field.type === 'datetime-local') payload[field.key] = new Date(payload[field.key]).toISOString();
      }
      if (!edit.remove && edit.resource === 'campaigns' && (payload.latitude === null) !== (payload.longitude === null))
        throw new Error('Vui lòng nhập cả vĩ độ và kinh độ, hoặc để trống cả hai.');
      await request(`/public/saigonxanh/admin/manage/${edit.resource}${edit.item ? `/${edit.item.id}` : ''}`, {
        method: edit.remove ? 'DELETE' : edit.item ? 'PUT' : 'POST',
        ...(!edit.remove && { body: JSON.stringify(payload) }),
      });
      dialog.current?.close(); setEdit(null);
      setMessage(edit.remove ? 'Đã xóa dữ liệu.' : 'Đã lưu dữ liệu.');
      opener.current?.focus();
      await onRefresh(edit.resource);
    } catch (err: any) {
      setError(typeof err.details === 'string' ? err.details : err.message || 'Không thể lưu dữ liệu. Vui lòng thử lại.');
    } finally { setBusy(false); }
  }
  return <Context.Provider value={open}>
    {message && <div className="admin-crud-notice" role="status">{message}<button type="button" onClick={() => setMessage('')} aria-label="Đóng thông báo"><X size={14} /></button></div>}
    {children}
    {edit && <dialog ref={dialog} className="admin-crud-dialog" onCancel={(e) => { e.preventDefault(); close(); }} aria-labelledby="crud-heading">
      <form onSubmit={submit}>
        <header><h2 id="crud-heading">{edit.remove ? 'Xóa' : edit.item ? 'Sửa' : 'Thêm'} {resources[edit.resource].label}</h2><button type="button" disabled={busy} onClick={close} aria-label="Đóng"><X size={20} /></button></header>
        {edit.remove ? (
          <div style={{ padding: '8px 0', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
            <p style={{ margin: 0 }}>
              Bạn có chắc chắn muốn xóa <strong>“{edit.item.title || edit.item.name || edit.item.user?.name || edit.item.description}”</strong>?
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#dc2626' }}>
              Thao tác này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác.{edit.resource === 'volunteers' && ' (Tài khoản đăng nhập vẫn được giữ lại)'}
            </p>
          </div>
        ) : <>
          {edit.resource === 'volunteers' && <p className="text-muted">Liên kết hồ sơ với tài khoản đã đăng ký. Điều chỉnh điểm bằng nút Cộng điểm trong danh sách.</p>}
          <div className="admin-crud-fields">{resources[edit.resource].fields.map((field) => {
            if (field.type === 'checkbox') {
              return (
                <label key={field.key} className="admin-crud-checkbox-row">
                  <input
                    name={field.key}
                    type="checkbox"
                    checked={Boolean(form[field.key])}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                  />
                  <span>{field.label}{field.required ? ' *' : ''}</span>
                </label>
              );
            }
            return (
              <label key={field.key} className={field.type === 'textarea' ? 'wide' : ''}>
                <span>{field.label}{field.required ? ' *' : ''}</span>
                {field.options ? (
                  <select name={field.key} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}>
                    {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea name={field.key} required={field.required} rows={4} value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                ) : (
                  <input
                    name={field.key}
                    type={field.type || 'text'}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    readOnly={edit.resource === 'volunteers' && !!edit.item && field.key === 'email'}
                    value={form[field.key] ?? ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                )}
              </label>
            );
          })}</div></>}
        {error && <p role="alert" className="admin-crud-error">{error}</p>}
        <footer><button type="button" className="btn-secondary-admin" disabled={busy} onClick={close}>Hủy</button><button type="submit" className={edit.remove ? 'btn-danger-admin' : 'btn-primary-admin'} disabled={busy}>{busy ? 'Đang xử lý...' : edit.remove ? 'Xác nhận xóa' : 'Lưu thay đổi'}</button></footer>
      </form>
    </dialog>}
  </Context.Provider>;
}
