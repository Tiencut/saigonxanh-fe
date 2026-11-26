import React, { useState } from 'react';
import { sgxApi } from '../api';
import type { CleanupReport } from '../types';
import './reportTracking.css';

const STATUS_LABELS: Record<CleanupReport['status'], string> = {
  SUBMITTED: 'Đã tiếp nhận', VERIFIED: 'Đã xác minh', SCHEDULED: 'Đã lên lịch dọn',
  PROCESSING: 'Đang xử lý', COMPLETED: 'Đã hoàn thành', REJECTED: 'Không được duyệt',
};

export function ReportTrackingSection() {
  const [code, setCode] = useState('');
  const [report, setReport] = useState<CleanupReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const track = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim() || loading) return;
    setReport(null);
    setError('');
    setLoading(true);
    try {
      const result = await sgxApi.trackReport(code.trim());
      if (result) setReport(result);
      else setError('Không tìm thấy phản ánh. Vui lòng kiểm tra lại mã.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tra cứu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sgx-report-tracking" aria-labelledby="report-tracking-title">
      <div>
        <h2 id="report-tracking-title">Tra cứu tiến độ phản ánh</h2>
        <p>Dùng mã nhận được sau khi báo điểm rác trên bản đồ để theo dõi xử lý.</p>
      </div>
      <form onSubmit={track} aria-busy={loading}>
        <label htmlFor="report-tracking-code">Mã phản ánh</label>
        <div className="report-tracking-controls">
          <input id="report-tracking-code" value={code} onChange={e => setCode(e.target.value)}
            placeholder="Nhập mã phản ánh" required disabled={loading} />
          <button className="btn btn-primary" type="submit" disabled={loading || !code.trim()}>
            {loading ? 'Đang tra cứu…' : 'Tra cứu'}
          </button>
        </div>
        <div aria-live="polite">
          {error && <p className="report-tracking-error" role="alert">{error}</p>}
          {report && (
            <div className="report-tracking-result">
              <h3>{report.title}</h3>
              <p>{report.address}</p>
              <p><strong>Trạng thái:</strong> {STATUS_LABELS[report.status] || report.status}</p>
              {report.adminNotes && <p><strong>Ghi chú điều phối:</strong> {report.adminNotes}</p>}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
