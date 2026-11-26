import React, { useState, useEffect } from 'react';
import { authFetch, getErrMsg } from './adminRequest';
export function useAdminOperations({ fetchData, notify }: { fetchData: () => Promise<void>; notify: (message: string) => void }) {
  const [showAwardPoints, setShowAwardPoints] = useState<any | null>(null);
  const [pointsDelta, setPointsDelta] = useState(5000);

  const handleUpdateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        notify('✓ Đã cập nhật trạng thái điểm rác thành công');
        fetchData();
      } else {
        alert(result.error || 'Cập nhật thất bại');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCampaign = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa chiến dịch "${title}" khỏi hệ thống?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/campaigns/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok) {
        notify('✓ Đã xóa chiến dịch thành công');
        fetchData();
      } else {
        alert(getErrMsg(result, 'Không thể xóa chiến dịch'));
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối máy chủ');
    }
  };

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAwardPoints) return;
    try {
      const res = await authFetch('/api/public/saigonxanh/admin/volunteers/award-points', {
        method: 'POST',
        body: JSON.stringify({
          volunteerId: showAwardPoints.id,
          pointsDelta: Number(pointsDelta),
          reason: 'Cống hiến chiến dịch đặc biệt',
        }),
      });
      const result = await res.json();
      if (res.ok) {
        notify(result.data?.message || '✓ Đã cập nhật điểm thành công');
        setShowAwardPoints(null);
        fetchData();
      } else {
        alert(result.error || 'Không thể cộng điểm');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateRedemption = async (id: string, status: string) => {
    if (status === 'CANCELLED' && !confirm('Từ chối yêu cầu đổi quà? Điểm và tồn kho sẽ được hoàn lại.')) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/redemptions/${id}`, {
        method: 'PATCH', body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(getErrMsg(result, 'Không thể cập nhật yêu cầu đổi quà'));
      notify('Đã cập nhật yêu cầu đổi quà');
      await fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('✓ Đã xóa bài viết');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };


  return { showAwardPoints, setShowAwardPoints, pointsDelta, setPointsDelta, handleUpdateReportStatus, handleDeleteCampaign, handleAwardPoints, handleUpdateRedemption, handleDeleteNews };
}
