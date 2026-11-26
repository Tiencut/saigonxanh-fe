import { useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle, Clock, Eye, Filter,
  MapPin, RefreshCw, Search, Trash2, X, Check, Building2
} from 'lucide-react';
import { api } from '../api';

export type CleanupReportItem = {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  wasteType: string;
  severity: string;
  status: string;
  images: string;
  cleanedImages?: string;
  cleanedAt?: string | null;
  wasteWeightKg?: number | null;
  adminNotes?: string | null;
  organizationId: string;
  campaignId?: string | null;
  campaign?: { id: string; title: string; organizer: string } | null;
  reporter?: { id: string; name?: string; email: string } | null;
  reporterName?: string | null;
  reporterPhone?: string | null;
  createdAt: string;
};

export function PlatformReportsTab() {
  const [reports, setReports] = useState<CleanupReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState<CleanupReportItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [modalStatus, setModalStatus] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [modalOrg, setModalOrg] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api<CleanupReportItem[]>('/platform/admin/reports');
      setReports(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách báo cáo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReports();
  }, []);

  const openModal = (report: CleanupReportItem) => {
    setSelectedReport(report);
    setModalStatus(report.status);
    setModalNotes(report.adminNotes || '');
    setModalOrg(report.organizationId || 'sgx');
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  const handleUpdate = async () => {
    if (!selectedReport) return;
    setUpdating(true);
    try {
      await api(`/platform/admin/reports/${selectedReport.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: modalStatus,
          organizationId: modalOrg,
          adminNotes: modalNotes,
        }),
      });
      closeModal();
      await fetchReports();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi cập nhật báo cáo.');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.trackingCode.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      (r.reporterName || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSeverity = severityFilter === 'ALL' || r.severity === severityFilter;
    return matchSearch && matchStatus && matchSeverity;
  });

  const total = reports.length;
  const pending = reports.filter((r) => r.status === 'SUBMITTED' || r.status === 'VERIFIED').length;
  const inProgress = reports.filter((r) => r.status === 'IN_PROGRESS').length;
  const resolved = reports.filter((r) => r.status === 'RESOLVED').length;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="ctx-badge is-warning">Chờ tiếp nhận</span>;
      case 'VERIFIED':
        return <span className="ctx-badge is-neutral">Đã xác minh</span>;
      case 'IN_PROGRESS':
        return <span className="ctx-badge is-neutral" style={{ background: '#e0f2fe', color: '#0284c7' }}>Đang dọn dẹp</span>;
      case 'RESOLVED':
        return <span className="ctx-badge is-success">Đã làm sạch</span>;
      case 'REJECTED':
        return <span className="ctx-badge" style={{ background: '#fee2e2', color: '#dc2626' }}>Từ chối</span>;
      default:
        return <span className="ctx-badge">{status}</span>;
    }
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '11px' }}>● Cực kỳ nghiêm trọng</span>;
      case 'HIGH':
        return <span style={{ color: '#ea580c', fontWeight: 600, fontSize: '11px' }}>● Ô nhiễm nặng</span>;
      case 'MEDIUM':
        return <span style={{ color: '#ca8a04', fontWeight: 500, fontSize: '11px' }}>● Vừa phải</span>;
      default:
        return <span style={{ color: '#64748b', fontSize: '11px' }}>● Nhẹ</span>;
    }
  };

  return (
    <div className="ctx-list-view-container">
      {/* Header */}
      <div className="ctx-page-header">
        <div>
          <h1>Báo cáo điểm rác toàn sàn</h1>
          <p className="ctx-page-subtitle">
            Tiếp nhận, xác minh và điều phối các điểm nóng rác thải tự phát từ người dân gửi lên cho các đơn vị xử lý.
          </p>
        </div>
        <div className="ctx-page-actions">
          <button className="ctx-btn-secondary" onClick={fetchReports} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Làm mới
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <section className="ctx-stats-grid" aria-label="Tổng quan số liệu báo cáo">
        <article className="ctx-stat-box">
          <div className="ctx-stat-icon-wrapper is-neutral"><Trash2 size={20} /></div>
          <div>
            <span className="ctx-stat-label">Tổng điểm rác</span>
            <strong className="ctx-stat-val">{total}</strong>
            <small className="ctx-stat-sub">Toàn hệ thống</small>
          </div>
        </article>
        <article className="ctx-stat-box">
          <div className="ctx-stat-icon-wrapper is-amber"><Clock size={20} /></div>
          <div>
            <span className="ctx-stat-label">Chờ xử lý</span>
            <strong className="ctx-stat-val">{pending}</strong>
            <small className="ctx-stat-sub">Cần phân công</small>
          </div>
        </article>
        <article className="ctx-stat-box">
          <div className="ctx-stat-icon-wrapper is-neutral" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="ctx-stat-label">Đang triển khai</span>
            <strong className="ctx-stat-val">{inProgress}</strong>
            <small className="ctx-stat-sub">Đang gom dọn</small>
          </div>
        </article>
        <article className="ctx-stat-box">
          <div className="ctx-stat-icon-wrapper is-green"><CheckCircle size={20} /></div>
          <div>
            <span className="ctx-stat-label">Đã làm sạch</span>
            <strong className="ctx-stat-val">{resolved}</strong>
            <small className="ctx-stat-sub">Hoàn thành xử lý</small>
          </div>
        </article>
      </section>

      {/* Table Card */}
      <div className="ctx-table-card">
        {/* Toolbar */}
        <div className="ctx-table-toolbar">
          <div className="ctx-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm theo mã, tên điểm đen, địa chỉ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ctx-toolbar-filter"
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#fff',
                color: '#0f172a'
              }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="SUBMITTED">Chờ tiếp nhận</option>
              <option value="VERIFIED">Đã xác minh</option>
              <option value="IN_PROGRESS">Đang dọn dẹp</option>
              <option value="RESOLVED">Đã làm sạch</option>
              <option value="REJECTED">Từ chối</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="ctx-toolbar-filter"
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#fff',
                color: '#0f172a'
              }}
            >
              <option value="ALL">Mọi mức độ ô nhiễm</option>
              <option value="CRITICAL">Cực kỳ nghiêm trọng</option>
              <option value="HIGH">Ô nhiễm nặng</option>
              <option value="MEDIUM">Vừa phải</option>
              <option value="LOW">Nhẹ</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="ctx-admin-alert is-error" style={{ margin: '14px 18px 0' }}>
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="ctx-table-wrapper">
          <table className="ctx-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Mã & Ngày gửi</th>
                <th>Điểm rác / Vị trí</th>
                <th style={{ width: '150px' }}>Mức độ & Loại rác</th>
                <th style={{ width: '180px' }}>Người báo cáo</th>
                <th style={{ width: '160px' }}>Đơn vị xử lý</th>
                <th style={{ width: '130px' }}>Trạng thái</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.trackingCode}
                      </code>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                          {item.address}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>{renderSeverityBadge(item.severity)}</div>
                      <small style={{ color: '#64748b', display: 'block', marginTop: '2px' }}>{item.wasteType || 'Rác hỗn hợp'}</small>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.reporterName || item.reporter?.name || 'Ẩn danh'}</div>
                      <small style={{ color: '#94a3b8' }}>{item.reporterPhone || item.reporter?.email || '—'}</small>
                    </td>
                    <td>
                      <span className="ctx-badge" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155' }}>
                        <Building2 size={11} style={{ marginRight: '4px' }} />
                        {item.organizationId === 'sgx' || item.organizationId === 'saigonxanh'
                          ? 'Sài Gòn Xanh'
                          : item.organizationId || 'Chưa gán'}
                      </span>
                    </td>
                    <td>{renderStatusBadge(item.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="ctx-btn-table-action"
                        onClick={() => openModal(item)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} /> Điều phối
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="ctx-empty-row">
                    {reports.length
                      ? 'Không tìm thấy báo cáo nào khớp với bộ lọc.'
                      : 'Chưa có báo cáo điểm rác nào được gửi lên hệ thống.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Review / Dispatch Modal */}
      {selectedReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                  Điều phối điểm đen #{selectedReport.trackingCode}
                </h3>
                <small style={{ color: '#64748b' }}>{selectedReport.title}</small>
              </div>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Địa chỉ vị trí:</strong>
                <p style={{ margin: 0, fontSize: '13px', color: '#334155', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                  {selectedReport.address}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Đơn vị chịu trách nhiệm xử lý:
                </label>
                <select
                  value={modalOrg}
                  onChange={(e) => setModalOrg(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                  }}
                >
                  <option value="saigonxanh">Sài Gòn Xanh (TP. Hồ Chí Minh)</option>
                  <option value="hanoixanh">Hà Nội Xanh</option>
                  <option value="danangxanh">Đà Nẵng Xanh</option>
                  <option value="general">Ban điều hành Chung Tay Xanh</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Trạng thái xử lý:
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                  }}
                >
                  <option value="SUBMITTED">Chờ tiếp nhận (SUBMITTED)</option>
                  <option value="VERIFIED">Đã xác minh hiện trường (VERIFIED)</option>
                  <option value="IN_PROGRESS">Đang dọn dẹp (IN_PROGRESS)</option>
                  <option value="RESOLVED">Đã làm sạch hoàn tất (RESOLVED)</option>
                  <option value="REJECTED">Từ chối / Báo cáo không đúng (REJECTED)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Ghi chú điều phối (Admin notes):
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Ghi chú phân công, kế hoạch ra quân xử lý điểm đen..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button type="button" className="ctx-btn-secondary" onClick={closeModal} disabled={updating}>
                Hủy bỏ
              </button>
              <button
                type="button"
                className="ctx-btn-primary"
                onClick={handleUpdate}
                disabled={updating}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {updating ? 'Đang lưu...' : <><Check size={14} /> Lưu điều phối</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
