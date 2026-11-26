export type ResourceName = 'team-members' | 'programs' | 'program-submissions' | 'reports' | 'campaigns' | 'volunteers' | 'finances' | 'news' | 'rewards' | 'waste-items';
export type Field = { key: string; label: string; type?: 'text' | 'textarea' | 'number' | 'datetime-local' | 'checkbox' | 'email'; required?: boolean; nullable?: boolean; min?: number; max?: number; step?: string; options?: [string, string][]; initial?: string | number | boolean };
const f = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, ...extra });
const required = { required: true };
const status = (options: [string, string][], initial: string) => f('status', 'Trạng thái', { options, initial });
const category = f('category', 'Loại chương trình', { options: [['school_fundraising', 'Trường học / Cộng đồng'], ['cleanup_sponsorship', 'Tài trợ dọn dẹp'], ['bom_noi', 'Bom nổi']], initial: 'school_fundraising' });
export const resources: Record<ResourceName, { label: string; fields: Field[] }> = {
  'team-members': { label: 'thành viên', fields: [
    f('name', 'Họ và tên', required),
    f('department', 'Ban trực thuộc', { options: [['dieuhanh', 'Ban điều hành'], ['truyenthong', 'Ban truyền thông'], ['haucan', 'Ban hậu cần'], ['codong', 'Ban cơ động']], initial: 'dieuhanh' }),
    f('role', 'Chức vụ (nếu có)'), f('image', 'Đường dẫn ảnh'),
    f('order', 'Thứ tự trong ban', { type: 'number', min: 0, initial: 0, ...required }),
    f('active', 'Hiển thị trên trang Giới thiệu', { type: 'checkbox', initial: true }),
  ] },
  programs: { label: 'chương trình hợp tác', fields: [category,
    f('title', 'Tên chương trình', required), f('subtitle', 'Phụ đề'), f('description', 'Mô tả', { type: 'textarea' }),
    f('image', 'Đường dẫn ảnh'), f('buttonText', 'Nhãn nút', { initial: 'Liên hệ', ...required }),
    f('order', 'Thứ tự', { type: 'number', min: 0, initial: 0, ...required }), f('active', 'Hiển thị', { type: 'checkbox', initial: true }),
  ] },
  'program-submissions': { label: 'đơn đăng ký hợp tác', fields: [category,
    f('programTitle', 'Tên chương trình', required), f('organizationName', 'Trường học / Đơn vị', required),
    f('representativeName', 'Người đại diện', required), f('phone', 'Số điện thoại', required), f('email', 'Email', { type: 'email', ...required }),
    f('scaleOrAmount', 'Quy mô / Số tiền dự kiến'), f('message', 'Lời nhắn', { type: 'textarea' }), f('adminNotes', 'Ghi chú điều phối', { type: 'textarea' }),
    status([['PENDING', 'Chờ liên hệ'], ['CONTACTED', 'Đã liên hệ'], ['CONFIRMED', 'Đã duyệt'], ['REJECTED', 'Từ chối']], 'PENDING'),
  ] },
  reports: { label: 'điểm rác', fields: [
    f('title', 'Tiêu đề', required), f('address', 'Địa chỉ', required), f('description', 'Mô tả', { type: 'textarea', ...required }),
    f('wasteType', 'Loại rác', required), f('severity', 'Mức độ', { options: [['LOW', 'Thấp'], ['MEDIUM', 'Trung bình'], ['HIGH', 'Cao'], ['CRITICAL', 'Nghiêm trọng']], initial: 'MEDIUM' }),
    status([['SUBMITTED', 'Chờ xác minh'], ['VERIFIED', 'Đã xác minh'], ['IN_PROGRESS', 'Đang xử lý'], ['RESOLVED', 'Đã dọn sạch'], ['REJECTED', 'Từ chối']], 'SUBMITTED'),
    f('reporterName', 'Người báo cáo'), f('reporterPhone', 'Số điện thoại'), f('adminNotes', 'Ghi chú điều phối', { type: 'textarea' }),
  ] },
  campaigns: { label: 'chiến dịch', fields: [
    f('publicOnPlatform', 'Công khai lên Chung Tay Xanh (đã xác minh thông tin)', { type: 'checkbox', initial: false }),
    f('title', 'Tên chiến dịch', required), f('location', 'Địa điểm', required), f('description', 'Mô tả', { type: 'textarea', ...required }),
    f('latitude', 'Vĩ độ (để hiển thị hoạt động gần bạn)', {type:'number',step:'any',min:-90,max:90,nullable:true}),
    f('longitude', 'Kinh độ (nhập cùng vĩ độ)', {type:'number',step:'any',min:-180,max:180,nullable:true}),
    f('startDate', 'Bắt đầu', { type: 'datetime-local', ...required }), f('endDate', 'Kết thúc', { type: 'datetime-local', ...required }),
    f('targetVolunteers', 'Số TNV mục tiêu', { type: 'number', min: 0, initial: 50, ...required }),
    f('wasteCollectedKg', 'Rác đã thu gom (kg)', { type: 'number', step: 'any', min: 0, initial: 0, ...required }),
    f('bannerImage', 'Đường dẫn ảnh bìa'), status([['UPCOMING', 'Sắp diễn ra'], ['ONGOING', 'Đang diễn ra'], ['COMPLETED', 'Hoàn thành'], ['CANCELLED', 'Đã hủy']], 'UPCOMING'),
  ] },
  volunteers: { label: 'hồ sơ tình nguyện viên', fields: [
    f('email', 'Email tài khoản đã đăng ký', { type: 'email', ...required }), f('phone', 'Số điện thoại'), f('address', 'Địa chỉ'),
    f('volunteerHours', 'Giờ cống hiến', { type: 'number', step: 'any', min: 0, initial: 0, ...required }),
    f('completedCampaigns', 'Chiến dịch hoàn thành', { type: 'number', min: 0, initial: 0, ...required }),
  ] },
  finances: { label: 'giao dịch thu chi', fields: [
    f('type', 'Loại giao dịch', { options: [['INCOME', 'Thu'], ['EXPENSE', 'Chi']], initial: 'INCOME' }), f('category', 'Hạng mục', required),
    f('amount', 'Số tiền (VND)', { type: 'number', min: 1, ...required }), f('description', 'Diễn giải', { type: 'textarea', ...required }),
    f('donorName', 'Người đóng góp / Đơn vị'), f('transactionDate', 'Ngày giao dịch', { type: 'datetime-local', ...required }),
    f('receiptProofUrl', 'Đường dẫn chứng từ'), f('isVerified', 'Đã đối soát', { type: 'checkbox', initial: true }),
  ] },
  news: { label: 'bài viết', fields: [
    f('title', 'Tiêu đề', required), f('excerpt', 'Tóm tắt', { type: 'textarea', ...required }), f('content', 'Nội dung', { type: 'textarea' }),
    f('category', 'Chuyên mục', { initial: 'Hoạt động cộng đồng', ...required }), f('coverImage', 'Đường dẫn ảnh bìa'), f('source', 'Nguồn tin'), f('url', 'Liên kết nguồn (https://...)'),
  ] },
  rewards: { label: 'quà tặng', fields: [
    f('name', 'Tên quà tặng', required), f('description', 'Mô tả', { type: 'textarea', ...required }),
    f('pointsRequired', 'Điểm quy đổi', { type: 'number', min: 1, ...required }), f('stockQuantity', 'Tồn kho', { type: 'number', min: 0, initial: 0, ...required }),
    f('image', 'Đường dẫn ảnh'), f('category', 'Danh mục', { initial: 'GENERAL', ...required }), f('active', 'Hiển thị', { type: 'checkbox', initial: true }),
  ] },
  'waste-items': { label: 'loại rác quy đổi', fields: [
    f('name', 'Tên loại rác', required), f('category', 'Nhóm rác', required), f('unit', 'Đơn vị', { initial: 'kg', ...required }),
    f('pointsPerUnit', 'Điểm trên mỗi đơn vị', { type: 'number', min: 1, ...required }), f('requirement', 'Yêu cầu tiếp nhận'), f('icon', 'Mã biểu tượng'), f('active', 'Hiển thị', { type: 'checkbox', initial: true }),
  ] },
};
