import { OrganizationLogo, OrganizationName } from '../../organizations/OrganizationBrand';
import React from 'react';
import { RefreshCw, AlertTriangle, Mail, Lock } from 'lucide-react';
export function AdminLogin({ authLoading, user, loginError, loginEmail, setLoginEmail, loginPassword, setLoginPassword, isSubmitting, handleAdminLogin }: any) {
  // AUTHENTICATION GUARD CHECK
  if (authLoading) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card" style={{ textAlign: 'center' }}>
          <RefreshCw size={28} className="spin" style={{ color: '#15803d', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>Đang kiểm tra quyền truy cập hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.roles?.includes('ADMIN')) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <OrganizationLogo className="login-logo" />
            <h2>CỔNG QUẢN TRỊ HỆ THỐNG</h2>
            <p className="login-subtitle">Dành cho quản trị viên <OrganizationName /></p>
          </div>

          {loginError && (
            <div className="admin-login-alert">
              <AlertTriangle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="form-group">
              <label>Email quản trị viên:</label>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@saigonxanh.vn"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu:</label>
              <div className="input-with-icon">
                <Lock size={16} />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn-admin-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Đăng Nhập Quản Trị</span>
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <a href="/" className="link-back-home">
              ← Quay lại Website Sài Gòn Xanh
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
