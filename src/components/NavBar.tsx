import { Link, useLocation } from 'react-router-dom';
import { TEXT } from '@/constants/text';

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--color-primary)' : 'none'}
      stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="1.8">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function AddIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export function NavBar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:block bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            {TEXT.nav.brand}
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center justify-center min-h-10 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 hover:opacity-90 active:scale-[0.97]"
          >
            {TEXT.nav.createButton}
          </Link>
        </div>
      </nav>

      {/* Mobile top bar (brand only) */}
      <nav className="md:hidden bg-surface border-b border-border sticky top-0 z-10">
        <div className="px-4 h-12 flex items-center">
          <span className="text-lg font-bold text-primary">{TEXT.nav.brand}</span>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface border-t border-border safe-area-bottom">
        <div className="flex">
          <Link
            to="/"
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-150 active:scale-[0.93] ${pathname === '/' ? 'text-primary' : 'text-text-muted'}`}
          >
            <HomeIcon active={pathname === '/'} />
            <span className="text-[10px] font-medium">홈</span>
          </Link>
          <Link
            to="/create"
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-150 active:scale-[0.93] ${pathname === '/create' ? 'text-primary' : 'text-text-muted'}`}
          >
            <AddIcon active={pathname === '/create'} />
            <span className="text-[10px] font-medium">추가</span>
          </Link>
        </div>
      </div>

      {/* Bottom spacer for mobile (prevents content hiding behind bottom nav) */}
      <div className="md:hidden h-16" aria-hidden="true" />
    </>
  );
}
