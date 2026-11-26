import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, History, Recycle } from 'lucide-react';

export type AccountProfile = {
  id: string;
  phone: string;
  points: number;
  volunteerHours: number;
  completedCampaigns: number;
  wasteRecords: {
    id: string;
    wasteItemName: string;
    createdAt: string;
    pointsEarned: number;
    quantity: number;
    unit: string;
    status: string;
  }[];
  redemptions: {
    id: string;
    rewardName: string;
    redeemedAt: string;
    pointsSpent: number;
    status: string;
  }[];
  registrations: {
    id: string;
    status: string;
    createdAt: string;
    campaign: { title: string; startDate?: string };
  }[];
};

const statuses: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  SHIPPED: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export function AccountActivityHistory({ profile }: { profile: AccountProfile }) {
  const [filter, setFilter] = useState<'all' | 'waste' | 'gift' | 'campaign'>('all');
  const records = [
    ...profile.registrations.map((r) => ({
      id: `campaign-${r.id}`,
      kind: 'campaign',
      title: r.campaign.title,
      date: r.campaign.startDate || r.createdAt,
      points: 0,
      status: r.status,
      detail: 'Ho\u1ea1t \u0111\u1ed9ng t\u00ecnh nguy\u1ec7n',
    })),
    ...profile.wasteRecords.map((r) => ({
      id: `waste-${r.id}`,
      kind: 'waste',
      title: r.wasteItemName,
      date: r.createdAt,
      points: r.pointsEarned,
      status: r.status,
      detail: `${r.quantity.toLocaleString('vi-VN')} ${r.unit}`,
    })),
    ...profile.redemptions.map((r) => ({
      id: `gift-${r.id}`,
      kind: 'gift',
      title: r.rewardName,
      date: r.redeemedAt,
      points: -r.pointsSpent,
      status: r.status,
      detail: '\u0110\u1ed5i qu\u00e0',
    })),
  ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  const shown = records.filter((r) => filter === 'all' || r.kind === filter);
  return (
    <section
      className="account-section account-history"
      id="account-history"
      aria-labelledby="account-history-title"
    >
      <div className="account-section-heading">
        <div>
          <h2 id="account-history-title">Lịch sử đổi rác & quà tặng</h2>
          <p>Theo dõi các lượt thu gom và sử dụng điểm của bạn.</p>
        </div>
        <Link to="/mobile?tab=rewards">
          Xem quà tặng <ArrowRight size={16} />
        </Link>
      </div>
      <div className="account-filters" role="group" aria-label="Lọc lịch sử">
        {(
          [
            ['all', 'Tất cả'],
            ['waste', 'Thu gom rác'],
            ['campaign', 'Chi\u1ebfn d\u1ecbch'],
            ['gift', 'Đổi quà'],
          ] as const
        ).map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {!shown.length ? (
        <div className="account-history-empty">
          <span className="account-empty-icon">
            <History size={26} aria-hidden="true" />
          </span>
          <h3>
            {records.length ? 'Chưa có giao dịch trong mục này' : 'Chưa có lịch sử giao dịch'}
          </h3>
          <p>Các lượt thu gom rác và đổi quà sẽ được lưu tại đây.</p>
          <Link className="account-button account-button-primary" to="/mobile?tab=rewards">
            <Recycle size={17} /> Đổi rác & tích điểm <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="account-history-list mobile-history-list">
          {shown.map((record) => (
            <article key={record.id} className="account-history-row">
              <span className="account-transaction-icon">
                {record.kind === 'waste' ? <Recycle size={20} /> : record.kind === 'campaign' ? <History size={20} /> : <Gift size={20} />}
              </span>
              <div className="account-transaction-copy">
                <h3>{record.title}</h3>
                <p>
                  {record.detail} · {statuses[record.status] || record.status}
                </p>
                <time dateTime={record.date}>{new Date(record.date).toLocaleString('vi-VN')}</time>
              </div>
              {record.kind !== 'campaign' && <strong className={record.points > 0 ? 'account-points-earned' : ''}>
                {record.status === 'CANCELLED'
                  ? 'Đã hoàn điểm'
                  : `${record.points > 0 ? '+' : ''}${record.points.toLocaleString('vi-VN')} điểm`}
              </strong>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
