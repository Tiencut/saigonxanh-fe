import React from 'react';
import { AdminCrudButton, AdminCrudRow } from './AdminCrud';
const categories: Record<string, string> = { school_fundraising: 'Trường học / Cộng đồng', cleanup_sponsorship: 'Tài trợ dọn dẹp', bom_noi: 'Bom nổi' };
export function AdminCommunityPrograms({ programs }: { programs: any[] }) {
  return <section className="admin-panel"><div className="panel-header"><h2>Chương trình hợp tác</h2><AdminCrudButton resource="programs" /></div>
    {!programs.length ? <p style={{padding:24}}>Chưa có chương trình hợp tác.</p> : <div className="table-responsive"><table className="admin-table">
      <thead><tr><th>Tên chương trình</th><th>Loại</th><th>Thứ tự</th><th>Hiển thị</th><th>Thao tác</th></tr></thead>
      <tbody>{programs.map(item=><tr key={item.id}><td>{item.title}</td><td>{categories[item.category] || item.category}</td><td>{item.order}</td><td>{item.active ? 'Đang hiển thị' : 'Đã ẩn'}</td><td><AdminCrudRow resource="programs" item={item} /></td></tr>)}</tbody>
    </table></div>}
  </section>;
}
