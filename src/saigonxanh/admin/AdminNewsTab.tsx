import { AdminCrudButton, AdminCrudRow } from './AdminCrud';
import React from 'react';
import { Plus, Trash2, RefreshCw, Calendar, ExternalLink, Newspaper } from 'lucide-react';

interface AdminNewsTabProps {
  newsList: any[];
  onOpenAddModal?: () => void;
  onDeleteNews: (id: string, title: string) => void;
  onRefresh: () => void;
}

export const AdminNewsTab: React.FC<AdminNewsTabProps> = ({
  newsList,
  onOpenAddModal,
  onDeleteNews,
  onRefresh,
}) => {
  return (
    <div className="tab-pane-fade">
      <div className="admin-actions-bar">
        <div className="actions-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
            {newsList.length} bài viết
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn-secondary-admin" onClick={onRefresh} title="Tải lại">
            <RefreshCw size={15} />
          </button>
          <AdminCrudButton resource="news" />
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Danh sách Tin tức & Bài viết truyền thông</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Bài viết báo chí, tin tức chiến dịch và cập nhật hoạt động cộng đồng.
            </p>
          </div>
        </div>
        {newsList.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon"><Newspaper size={22} /></div>
            <h3 className="empty-title">Chưa có bài viết tin tức nào</h3>
            <p className="empty-desc">
              Bấm "+ Thêm" ở góc trên để soạn và xuất bản bài viết đầu tiên.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tiêu đề bài viết</th>
                  <th>Chuyên mục</th>
                  <th>Ngày xuất bản</th>
                  <th>Nguồn tin</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {newsList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.coverImage || '/images/trangChu/1.png'}
                        alt={item.title}
                        style={{ width: '64px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td className="font-bold">{item.title}</td>
                    <td>
                      <span className="badge badge-success">{item.category}</span>
                    </td>
                    <td>{new Date(item.publishedAt).toLocaleDateString('vi-VN')}</td>
                    <td>{item.source || 'Sài Gòn Xanh Media'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <AdminCrudRow resource="news" item={item} deletable={false} />
                      {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-action-sm"
                            title="Xem nguồn"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          className="btn-action-sm btn-reject"
                          onClick={() => onDeleteNews(item.id, item.title)}
                          title="Xóa bài viết"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
