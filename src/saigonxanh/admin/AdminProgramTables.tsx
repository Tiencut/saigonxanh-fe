import React from 'react';
import { Eye, EyeOff, Edit, Trash2, Leaf, Users, HeartHandshake, Sparkles, PhoneCall, CheckCircle, Clock } from 'lucide-react';
import { AdminCrudRow } from './AdminCrud';
export function AdminInitiativesTable({ filteredInitiatives, onToggleInitiativeStatus, onEditInitiative, onDeleteInitiative }: any) {
  return (

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>ẢNH</th>
                <th style={{ padding: '12px 14px' }}>TIÊU ĐỀ & ĐỊA ĐIỂM</th>
                <th style={{ padding: '12px 14px' }}>DANH MỤC</th>
                <th style={{ padding: '12px 14px' }}>TIẾN ĐỘ / QUY MÔ</th>
                <th style={{ padding: '12px 14px' }}>THỨ TỰ</th>
                <th style={{ padding: '12px 14px' }}>TRẠNG THÁI</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredInitiatives.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/trangChu/logo.png';
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {item.locationOrOrg} {item.metaInfo ? `• ${item.metaInfo}` : ''}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background:
                          item.category === 'bom_noi'
                            ? '#dcfce7'
                            : item.category === 'school_community'
                            ? '#dbeafe'
                            : '#ffedd5',
                        color:
                          item.category === 'bom_noi'
                            ? '#15803d'
                            : item.category === 'school_community'
                            ? '#1d4ed8'
                            : '#c2410c',
                      }}
                    >
                      {item.category === 'bom_noi'
                        ? 'BOM NỔI'
                        : item.category === 'school_community'
                        ? 'TRƯỜNG HỌC'
                        : 'DỌN VỆ SINH'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {item.targetAmount && item.targetAmount > 0 ? (
                      <div>
                        <strong>{item.raisedAmount}</strong> / {item.targetAmount} triệu
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {Math.round(((item.raisedAmount || 0) / item.targetAmount) * 100)}%
                        </div>
                      </div>
                    ) : (
                      <span className="badge-status status-active">
                        {item.status === 'ongoing' ? 'Đang diễn ra' : item.status === 'upcoming' ? 'Sắp diễn ra' : item.status === 'completed' ? 'Đã hoàn tất' : (item.status || 'Đang triển khai')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span className="admin-rank-pill">#{item.order}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span className={`badge-status ${item.active !== false ? 'status-active' : 'status-inactive'}`}>
                      {item.active !== false ? 'Hiển thị' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => onToggleInitiativeStatus(item)}
                        title={item.active !== false ? 'Ẩn khỏi web' : 'Hiện lên web'}
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                      >
                        {item.active !== false ? <Eye size={14} color="#16a34a" /> : <EyeOff size={14} color="#94a3b8" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditInitiative(item)}
                        title="Chỉnh sửa"
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                      >
                        <Edit size={14} color="#0284c7" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteInitiative(item.id, item.title)}
                        title="Xóa"
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

  );
}

export function AdminDonationsTable({ filteredDonations, onEditDonation, onDeleteDonation }: any) {
  return (

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>NHÀ TÀI TRỢ</th>
                <th style={{ padding: '12px 14px' }}>VẬT TƯ / KINH PHÍ ĐÓNG GÓP</th>
                <th style={{ padding: '12px 14px' }}>SỐ TIỀN</th>
                <th style={{ padding: '12px 14px' }}>LỜI NHẮN</th>
                <th style={{ padding: '12px 14px' }}>THỜI GIAN</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((d: any) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: '#ea580c',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {d.donorName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.donorName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#ea580c' }}>
                    {d.itemSponsored || 'Ủng hộ kinh phí'}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                    {d.amount > 0 ? `${d.amount.toLocaleString('vi-VN')} đ` : '--'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569', fontStyle: 'italic', maxWidth: '280px' }}>
                    {d.message ? `"${d.message}"` : '--'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '11px' }}>
                    {d.timeAgo || 'Vừa xong'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => onEditDonation(d)}
                        title="Chỉnh sửa"
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                      >
                        <Edit size={14} color="#0284c7" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteDonation(d.id, d.donorName)}
                        title="Xóa"
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

  );
}

export function AdminSubmissionsTable({ filteredSubmissions, onUpdateSubmissionStatus, onDeleteSubmission }: any) {
  return (

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>TRƯỜNG HỌC / ĐƠN VỊ</th>
                <th style={{ padding: '12px 14px' }}>ĐẠI DIỆN & LIÊN HỆ</th>
                <th style={{ padding: '12px 14px' }}>QUY MÔ DỰ KIẾN</th>
                <th style={{ padding: '12px 14px' }}>LỜI NHẮN</th>
                <th style={{ padding: '12px 14px' }}>TRẠNG THÁI</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.organizationName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.programTitle}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600 }}>{s.representativeName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.phone} • {s.email}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{s.scaleOrAmount || '--'}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontStyle: 'italic', maxWidth: '240px' }}>
                    {s.message || '--'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <select
                      value={s.status}
                      onChange={(e) => onUpdateSubmissionStatus(s.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      <option value="PENDING">Chờ liên hệ</option>
                      <option value="CONTACTED">Đã liên hệ</option>
                      <option value="CONFIRMED">Đã duyệt</option>
                      <option value="REJECTED">Từ chối</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <AdminCrudRow resource="program-submissions" item={s} deletable={false} />
                    <button
                      type="button"
                      onClick={() => onDeleteSubmission(s.id, s.organizationName)}
                      title="Xóa đơn"
                      style={{ padding: '5px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} color="#dc2626" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

  );
}
