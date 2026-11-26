import { useState } from 'react';
import { Gift } from 'lucide-react';
import { AccountLoadState, useAccountResource } from './useAccountResource';
import { accountPath, orderStatuses, type AccountProfile } from './accountTypes';

export function AccountOrdersScreen({ gifts = false }: { gifts?: boolean }) {
  const resource = useAccountResource<AccountProfile>(accountPath + '/me');
  const [filter, setFilter] = useState('ALL');
  const rows = (resource.data?.redemptions || []).filter(
    (row) => (!gifts || row.status !== 'CANCELLED') && (filter === 'ALL' || row.status === filter),
  );
  return (
    <>
      <p className="account-center-intro">
        {gifts
          ? 'Các quà bạn đã đổi bằng điểm tích lũy.'
          : 'Theo dõi trạng thái và thông tin nhận quà của từng yêu cầu.'}
      </p>
      <AccountLoadState {...resource} />
      {resource.data && (
        <>
          <label className="account-center-filter">
            Trạng thái
            <select
              aria-label="Lọc trạng thái đơn"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">Tất cả</option>
              {Object.entries(orderStatuses)
                .filter(([key]) => !gifts || key !== 'CANCELLED')
                .map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
            </select>
          </label>
          {!rows.length && (
            <div className="account-center-empty">
              <Gift size={28} />
              <h2>Chưa có {gifts ? 'quà tặng' : 'đơn đổi quà'} trong mục này</h2>
              <p>Quà đã đổi sẽ xuất hiện tại đây.</p>
            </div>
          )}
          <div className="account-center-orders">
            {rows.map((row) => (
              <article key={row.id} className="account-center-order">
                <div className="account-center-order-heading">
                  <Gift size={20} />
                  <h2>{row.rewardName}</h2>
                </div>
                <p className="account-center-status">{orderStatuses[row.status] || row.status}</p>
                <p>
                  {row.pointsSpent.toLocaleString('vi-VN')} điểm
                  {row.status === 'CANCELLED' ? ' · Đã hoàn lại' : ''}
                </p>
                <time dateTime={row.redeemedAt}>
                  {new Date(row.redeemedAt).toLocaleString('vi-VN')}
                </time>
                <details>
                  <summary>Chi tiết nhận quà</summary>
                  <dl>
                    <dt>Mã yêu cầu</dt>
                    <dd>{row.id}</dd>
                    <dt>Người nhận</dt>
                    <dd>{row.recipientName}</dd>
                    <dt>Số điện thoại</dt>
                    <dd>{row.recipientPhone}</dd>
                    <dt>Địa chỉ</dt>
                    <dd>{row.recipientAddress}</dd>
                  </dl>
                </details>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
