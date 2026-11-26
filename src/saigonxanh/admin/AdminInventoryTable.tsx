import React from 'react';
import { AdminCrudButton, AdminCrudRow } from './AdminCrud';
import type { ResourceName } from './adminResourceFields';
export function AdminInventoryTable({ resource, rows }: { resource: Extract<ResourceName, 'rewards' | 'waste-items'>; rows: any[] }) {
  const reward = resource === 'rewards';
  return <section className="admin-panel">
    <div className="panel-header"><h2>{reward ? 'Danh mục quà tặng' : 'Danh mục rác quy đổi'}</h2><AdminCrudButton resource={resource} /></div>
    {!rows.length ? <p style={{ padding: 24 }} className="text-muted">Chưa có dữ liệu. Bấm Thêm để tạo danh mục.</p> : <div className="table-responsive"><table className="admin-table">
      <thead><tr><th>Tên</th><th>Danh mục</th><th>{reward ? 'Điểm quy đổi' : 'Điểm / đơn vị'}</th><th>{reward ? 'Tồn kho' : 'Đơn vị'}</th><th>Hiển thị</th><th>Thao tác</th></tr></thead>
      <tbody>{rows.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.category}</td><td>{reward ? item.pointsRequired : item.pointsPerUnit}</td><td>{reward ? item.stockQuantity : item.unit}</td><td>{item.active ? 'Đang hiển thị' : 'Đã ẩn'}</td><td><AdminCrudRow resource={resource} item={item} /></td></tr>)}</tbody>
    </table></div>}
  </section>;
}
