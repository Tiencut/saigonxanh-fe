import React, { useState, useEffect } from 'react';
import { authFetch, getErrMsg } from './adminRequest';
export function useAdminPrograms({ fetchData, notify, programs }: { fetchData: () => Promise<void>; notify: (message: string) => void; programs: any[] }) {
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [isSubmittingProgram, setIsSubmittingProgram] = useState(false);
  const [showAddInitiative, setShowAddInitiative] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<any | null>(null);
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [editingDonation, setEditingDonation] = useState<any | null>(null);
  const [programForm, setProgramForm] = useState({
    category: 'school_fundraising',
    title: '',
    subtitle: '',
    description: '',
    image: '/images/trangChu/sponsor-gay-quy.png',
    buttonText: 'Liên hệ',
    order: 1,
    active: true,
  });

  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      category: 'school_fundraising',
      title: '',
      subtitle: '',
      description: '',
      image: '/images/trangChu/sponsor-gay-quy.png',
      buttonText: 'Liên hệ',
      order: programs.length + 1,
      active: true,
    });
    setShowAddProgram(true);
  };

  const handleEditProgram = (prog: any) => {
    setEditingProgram(prog);
    setProgramForm({
      category: prog.category || 'school_fundraising',
      title: prog.title,
      subtitle: prog.subtitle || '',
      description: prog.description || '',
      image: prog.image,
      buttonText: prog.buttonText || 'Liên hệ',
      order: prog.order ?? 0,
      active: prog.active !== false,
    });
    setShowAddProgram(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProgram(true);
    try {
      const url = editingProgram
        ? `/api/public/saigonxanh/admin/programs/${editingProgram.id}`
        : '/api/public/saigonxanh/admin/programs';
      const method = editingProgram ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(programForm),
      });
      const result = await res.json();
      if (res.ok) {
        notify(result.data?.message || '✓ Đã lưu chương trình thành công');
        setShowAddProgram(false);
        setEditingProgram(null);
        fetchData();
      } else {
        alert(result.error || 'Thao tác thất bại');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingProgram(false);
    }
  };

  const handleDeleteProgram = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa chương trình "${title}" khỏi hệ thống?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/programs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('✓ Đã xóa chương trình');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleProgramStatus = async (prog: any) => {
    try {
      const newStatus = !(prog.active !== false);
      const res = await authFetch(`/api/public/saigonxanh/admin/programs/${prog.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: newStatus }),
      });
      if (res.ok) {
        notify(newStatus ? `✓ Đã bật hiển thị cho ${prog.title}` : `✓ Đã tạm ẩn ${prog.title}`);
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/program-submissions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(notes !== undefined ? { adminNotes: notes } : {}) }),
      });
      if (res.ok) {
        notify('✓ Đã cập nhật trạng thái đơn đăng ký');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSubmission = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đơn đăng ký từ "${name}"?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/program-submissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('✓ Đã xóa đơn đăng ký');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Initiatives CRUD Handlers
  const handleSaveInitiative = async (formData: any) => {
    const isEdit = Boolean(editingInitiative);
    const url = isEdit
      ? `/api/public/saigonxanh/admin/initiatives/${editingInitiative.id}`
      : '/api/public/saigonxanh/admin/initiatives';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    if (res.ok) {
      notify(isEdit ? '✓ Đã cập nhật dự án thành công' : '✓ Đã thêm dự án mới thành công');
      fetchData();
    } else {
      throw new Error(result.error || 'Lỗi lưu dự án');
    }
  };

  const handleDeleteInitiative = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa dự án "${title}"?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/initiatives/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('✓ Đã xóa dự án khỏi hệ thống');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleInitiativeStatus = async (item: any) => {
    try {
      const newStatus = !(item.active !== false);
      const res = await authFetch(`/api/public/saigonxanh/admin/initiatives/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: newStatus }),
      });
      if (res.ok) {
        notify(newStatus ? `✓ Đã bật hiển thị cho ${item.title}` : `✓ Đã tạm ẩn ${item.title}`);
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Activity Donations CRUD Handlers
  const handleSaveDonation = async (formData: any) => {
    const isEdit = Boolean(editingDonation);
    const url = isEdit
      ? `/api/public/saigonxanh/admin/activity-donations/${editingDonation.id}`
      : '/api/public/saigonxanh/admin/activity-donations';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    if (res.ok) {
      notify(isEdit ? '✓ Đã cập nhật đóng góp thành công' : '✓ Đã thêm đóng góp mới thành công');
      fetchData();
    } else {
      throw new Error(result.error || 'Lỗi lưu đóng góp');
    }
  };

  const handleDeleteDonation = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa lượt đóng góp của "${name}"?`)) return;
    try {
      const res = await authFetch(`/api/public/saigonxanh/admin/activity-donations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('✓ Đã xóa lượt đóng góp');
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };




  return { showAddProgram, setShowAddProgram, editingProgram, setEditingProgram, isSubmittingProgram, setIsSubmittingProgram, showAddInitiative, setShowAddInitiative, editingInitiative, setEditingInitiative, showAddDonation, setShowAddDonation, editingDonation, setEditingDonation, programForm, setProgramForm, handleOpenAddProgram, handleEditProgram, handleSaveProgram, handleDeleteProgram, handleToggleProgramStatus, handleUpdateSubmissionStatus, handleDeleteSubmission, handleSaveInitiative, handleDeleteInitiative, handleToggleInitiativeStatus, handleSaveDonation, handleDeleteDonation };
}
