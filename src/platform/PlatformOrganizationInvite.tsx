import {Link} from 'react-router-dom';
import {ArrowUpRight,Building2,CalendarDays,Users} from 'lucide-react';

export function PlatformOrganizationInvite() {
 return <section className="ctx-organization-invite" aria-labelledby="ctx-invite-title">
  <div className="ctx-invite-heading"><div><h2 id="ctx-invite-title">Dành cho tổ chức xanh</h2><p>Tham gia Chung Tay Xanh để kết nối cộng đồng, tổ chức hoạt động và lan tỏa những việc làm có ích cho môi trường.</p><Link className="ctx-primary" to="/join">Đăng ký tổ chức <ArrowUpRight size={17}/></Link></div><div className="ctx-org-capabilities"><div><Building2 size={21}/><span><strong>Hồ sơ tổ chức</strong><small>Giới thiệu cộng đồng và nhận diện riêng.</small></span></div><div><CalendarDays size={21}/><span><strong>Hoạt động và đăng ký</strong><small>Đăng lịch và tiếp nhận người tham gia.</small></span></div><div><Users size={21}/><span><strong>Quản lý tình nguyện</strong><small>Theo dõi hoạt động trong tổ chức.</small></span></div></div></div>
  <ol className="ctx-join-steps">
   <li><span>1</span><div><h3>Gửi thông tin tổ chức</h3><p>Giới thiệu cộng đồng và người phụ trách để chúng tôi liên hệ.</p></div></li>
   <li><span>2</span><div><h3>Xác minh và tạo không gian</h3><p>Quản trị nền tảng xem xét hồ sơ, tạo tổ chức và cấp quyền quản lý.</p></div></li>
   <li><span>3</span><div><h3>Hoàn thiện và công khai</h3><p>Cập nhật hồ sơ, chuẩn bị hoạt động và xác nhận trước khi xuất hiện trên nền tảng.</p></div></li>
  </ol>
 </section>;
}
