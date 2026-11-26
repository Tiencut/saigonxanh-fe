import React, { useState, useEffect } from 'react';
import { authFetch, getErrMsg } from './adminRequest';
export function useAdminPartners({ fetchData, notify, kols }: { fetchData: () => Promise<void>; notify: (message: string) => void; kols: any[] }) {
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [showAddKol, setShowAddKol] = useState(false);
  const [editingKol, setEditingKol] = useState<any | null>(null);
  const [isSubmittingKol, setIsSubmittingKol] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    verificationStatus: 'PENDING',
    verificationSource: '',
    type: 'generic',
    group: 'org' as 'org' | 'sponsor' | 'individual',
    active: true,
    purpose: '',
    date: new Date().toLocaleDateString('vi-VN'),
    amount: '',
    amountNum: 0,
    order: 0,
  });

  const [kolForm, setKolForm] = useState({
    name: '',
    role: '',
    badge: 'Nghệ sĩ đồng hành',
    image: '/images/cooperate/thuyTien.jpg',
    desc: '',
    order: 1,
    active: true,
  });

  const handleOpenAddPartner = () => {
    setEditingPartner(null);
    setPartnerForm({
      name: '',
      verificationStatus: 'PENDING',
      verificationSource: '',
      type: 'generic',
      group: 'org',
      active: true,
      purpose: '',
      date: new Date().toLocaleDateString('vi-VN'),
      amount: '',
      amountNum: 0,
      order: 0,
    });
    setShowAddPartner(true);
  };

  const handleEditPartner = (p: any) => {
    setEditingPartner(p);
    setPartnerForm({
      name: p.name,
      verificationStatus: p.verificationStatus || 'PENDING',
      verificationSource: p.verificationSource || '',
      type: p.type || 'generic',
      group: p.group || 'org',
      active: p.active !== false,
      purpose: p.purpose || '',
      date: p.date || '',
      amount: p.amount || '',
      amountNum: p.amountNum || 0,
      order: p.order || 0,
    });
    setShowAddPartner(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPartner
        ? `/api/public/saigonxanh/admin/partners/${editingPartner.id}`
        : '/api/public/saigonxanh/admin/partners';
      const method = editingPartner ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(partnerForm),
      });
      const result = await res.json();
      if (res.ok) {
        notify(result.data?.message || '✓ Đã lưu thông tin nhà đồng hành');
        setShowAddPartner(false);
        setEditingPartner(null);
        fetchData();
      } else {
        alert(getErrMsg(result, 'Thao tác thất bại'));
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi thao tác');
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đối tác "${name}" khỏi cơ sở dữ liệu?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('✓ Đã xóa đối tác thành công');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTogglePartnerStatus = async (partner: any) => {
    try {
      const newStatus = !(partner.active !== false);
      const res = await authFetch(`/api/public/saigonxanh/admin/partners/${partner.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: newStatus }),
      });
      if (res.ok) {
        notify(newStatus ? `✓ Đã bật hiển thị cho ${partner.name}` : `✓ Đã tạm ẩn ${partner.name}`);
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenAddKol = () => {
    setEditingKol(null);
    setKolForm({
      name: '',
      role: '',
      badge: 'Nghệ sĩ đồng hành',
      image: '/images/cooperate/thuyTien.jpg',
      desc: '',
      order: kols.length + 1,
      active: true,
    });
    setShowAddKol(true);
  };

  const handleEditKol = (k: any) => {
    setEditingKol(k);
    setKolForm({
      name: k.name,
      role: k.role || '',
      badge: k.badge || 'Nghệ sĩ đồng hành',
      image: k.image || '',
      desc: k.desc || '',
      order: k.order ?? 0,
      active: k.active !== false,
    });
    setShowAddKol(true);
  };

  const handleSaveKol = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingKol(true);
    try {
      const url = editingKol
        ? `/api/public/saigonxanh/admin/kols/${editingKol.id}`
        : '/api/public/saigonxanh/admin/kols';
      const method = editingKol ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(kolForm),
      });
      const result = await res.json();
      if (res.ok) {
        notify(result.data?.message || '✓ Đã lưu thông tin gương mặt đồng hành');
        setShowAddKol(false);
        setEditingKol(null);
        fetchData();
      } else {
        alert(result.error || 'Thao tác thất bại');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingKol(false);
    }
  };

  const handleDeleteKol = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa gương mặt KOL "${name}" khỏi hệ thống?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/kols/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('✓ Đã xóa gương mặt đồng hành');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleKolStatus = async (kol: any) => {
    try {
      const newStatus = !(kol.active !== false);
      const res = await authFetch(`/api/public/saigonxanh/admin/kols/${kol.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: newStatus }),
      });
      if (res.ok) {
        notify(newStatus ? `✓ Đã bật hiển thị cho ${kol.name}` : `✓ Đã tạm ẩn ${kol.name}`);
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Program Handlers

  return { showAddPartner, setShowAddPartner, editingPartner, setEditingPartner, showAddKol, setShowAddKol, editingKol, setEditingKol, isSubmittingKol, setIsSubmittingKol, partnerForm, setPartnerForm, kolForm, setKolForm, handleOpenAddPartner, handleEditPartner, handleSavePartner, handleDeletePartner, handleTogglePartnerStatus, handleOpenAddKol, handleEditKol, handleSaveKol, handleDeleteKol, handleToggleKolStatus };
}
