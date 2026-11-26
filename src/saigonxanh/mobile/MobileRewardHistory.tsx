import React from 'react';
import { History } from 'lucide-react';
export function MobileRewardHistory({ user, profile, loading }: { user: unknown; profile: any; loading: boolean }) {
  if (!user || loading || !profile) return <div className="history-empty"><History size={32} /><h4>Lịch sử tích điểm & đổi quà</h4><p>{!user ? 'Vui lòng đăng nhập để xem lịch sử.' : loading ? 'Đang tải lịch sử...' : 'Chưa tải được lịch sử. Vui lòng thử lại.'}</p></div>;
  const records = [
    ...(profile.wasteRecords || []).map((r: any) => ({ id:r.id, title:r.wasteItemName, date:r.createdAt, points:r.pointsEarned, status:r.status, detail:`${r.quantity} ${r.unit}` })),
    ...(profile.redemptions || []).map((r: any) => ({ id:r.id, title:r.rewardName, date:r.redeemedAt, points:-r.pointsSpent, status:r.status, detail:r.status === 'CANCELLED' ? 'Đã hoàn lại điểm' : 'Đổi quà' })),
  ].sort((a,b) => Date.parse(b.date)-Date.parse(a.date));
  const statuses: Record<string,string> = { PENDING:'Chờ xử lý', SHIPPED:'Đang giao', COMPLETED:'Hoàn thành', CANCELLED:'Đã hủy' };
  if (!records.length) return <div className="history-empty"><History size={32}/><h4>Chưa có lịch sử giao dịch</h4><p>Các lượt thu gom và đổi quà sẽ xuất hiện tại đây.</p></div>;
  return <div className="mobile-history-list">{records.map(record=><article key={record.id} className="mobile-history-item"><div><strong>{record.title}</strong><p>{record.detail} · {statuses[record.status] || record.status}</p><time dateTime={record.date}>{new Date(record.date).toLocaleString('vi-VN')}</time></div><strong>{record.points>0?'+':''}{record.points.toLocaleString('vi-VN')} điểm</strong></article>)}</div>;
}
