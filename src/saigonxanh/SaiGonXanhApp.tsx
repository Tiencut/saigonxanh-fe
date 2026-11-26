import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Monitor, ShieldCheck } from 'lucide-react';
import { SaiGonXanhWeb } from './SaiGonXanhWeb';
import { SaiGonXanhMobile } from './SaiGonXanhMobile';
import { SaiGonXanhAdmin } from './SaiGonXanhAdmin';
import './saigonxanh.css';
import './mobile/mobileShell.css';

export function SaiGonXanhApp({ baseRoute = '' }: { baseRoute?: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const subpath = baseRoute && location.pathname.startsWith(baseRoute)
    ? location.pathname.slice(baseRoute.length) || '/'
    : location.pathname;

  const isAdmin = subpath.startsWith('/admin');
  const isPublicWebPage = ['/map', '/trophy', '/about', '/cooperate', '/finances'].includes(subpath);

  // Web & Mobile share the single URL '/' with auto-detect viewport (<768px = Mobile, >=768px = Web)
  const [deviceMode, setDeviceMode] = useState<'auto' | 'web' | 'mobile'>('auto');
  const [isMobileScreen, setIsMobileScreen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsMobileScreen(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const activeMode: 'web' | 'mobile' | 'admin' = isAdmin
    ? 'admin'
    : isPublicWebPage
    ? 'web'
    : deviceMode === 'mobile' || subpath === '/mobile' || subpath === '/m' || (deviceMode === 'auto' && isMobileScreen)
    ? 'mobile'
    : 'web';

  const handleSwitch = (mode: 'web' | 'mobile' | 'admin') => {
    const rootPath = baseRoute || '/';
    if (mode === 'admin') {
      navigate(baseRoute ? `${baseRoute}/admin` : '/admin');
    } else {
      if (isAdmin || subpath === '/mobile' || subpath === '/m' || (mode === 'mobile' && isPublicWebPage)) {
        navigate(rootPath);
      }
      setDeviceMode(mode);
    }
  };

  return (
    <div className="sgx-app-container">
      {/* View Switcher Floating Pill (only shown on public web / mobile demo, hidden in admin) */}
      {activeMode !== 'admin' && (
        <div className={`sgx-mode-switcher-float mode-${activeMode}`}>
          <button
            type="button"
            className={`mode-btn ${activeMode === 'web' ? 'active' : ''}`}
            onClick={() => handleSwitch('web')}
            title="Xem giao diện Web Desktop"
          >
            <Monitor size={16} />
            <span>Bản Web</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${activeMode === 'mobile' ? 'active' : ''}`}
            onClick={() => handleSwitch('mobile')}
            title="Xem bản Mobile App (Tự động kích hoạt khi mở bằng điện thoại)"
          >
            <Smartphone size={16} />
            <span>App Mobile</span>
          </button>
          <button
            type="button"
            className="mode-btn"
            onClick={() => handleSwitch('admin')}
            title="Vào Trang Quản Trị Hệ Thống (/admin)"
          >
            <ShieldCheck size={16} />
            <span>Quản Trị Admin</span>
          </button>
        </div>
      )}

      {activeMode === 'web' ? (
        <SaiGonXanhWeb
          baseRoute={baseRoute}
          onSwitchToMobile={() => handleSwitch('mobile')}
          onSwitchToAdmin={() => handleSwitch('admin')}
        />
      ) : activeMode === 'mobile' ? (
        <div className="sgx-mobile-simulator-stage">
          <div className="phone-device-frame">
            <SaiGonXanhMobile
              onSwitchToWeb={() => handleSwitch('web')}
              onSwitchToAdmin={() => handleSwitch('admin')}
            />
          </div>
        </div>
      ) : (
        <SaiGonXanhAdmin baseRoute={baseRoute} />
      )}
    </div>
  );
}
