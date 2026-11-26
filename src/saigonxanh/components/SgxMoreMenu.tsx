import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronRight,
  Home,
  Map,
  Trophy,
  Handshake,
  Info,
  Wallet,
  Sprout,
  RefreshCw,
} from 'lucide-react';
import './moreMenu.css';

const destinations = [
  { to: '/mobile', label: 'Trang chủ', icon: Home },
  { to: '/map', label: 'Bản đồ & Báo điểm rác', icon: Map },
  { to: '/mobile?tab=activities', label: 'Hoạt động tình nguyện', icon: Sprout },
  { to: '/mobile?tab=rewards', label: 'Đổi rác & Quà tặng', icon: RefreshCw },
  { to: '/trophy', label: 'Chiến tích', icon: Trophy },
  { to: '/cooperate', label: 'Hợp tác với KOL', icon: Handshake },
  { to: '/about', label: 'Giới thiệu', icon: Info },
  { to: '/finances', label: 'Minh bạch tài chính', icon: Wallet },
];

export function SgxMoreMenu({ compact = false }: { compact?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const close = () => dialog.current?.close();
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`sgx-more-trigger ${compact ? 'is-compact' : ''}`}
        aria-label="Mở menu Sài Gòn Xanh"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={21} />
        <span>Menu</span>
      </button>
      <dialog
        ref={dialog}
        className="sgx-more-dialog"
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="sgx-more-content">
          <header>
            <div>
              <h2 id={titleId}>Sài Gòn Xanh</h2>
              <p>Khám phá và chung tay hành động</p>
            </div>
            <button type="button" aria-label="Đóng menu" onClick={close}>
              <X size={22} />
            </button>
          </header>
          <nav aria-label="Tất cả chuyên mục">
            {destinations.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                aria-current={`${location.pathname}${location.search}` === to ? 'page' : undefined}
              >
                <Icon size={20} />
                <span>{label}</span>
                <ChevronRight size={17} />
              </Link>
            ))}
          </nav>
          <Link className="sgx-more-donate" to="/finances" onClick={close}>
            Quyên góp cho Sài Gòn Xanh <ChevronRight size={18} />
          </Link>
        </div>
      </dialog>
    </>
  );
}
