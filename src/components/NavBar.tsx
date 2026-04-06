import { Link, useLocation } from 'react-router-dom';
import { TEXT } from '@/constants/text';

export function NavBar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:block border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-white tracking-tight">
            {TEXT.nav.brand}
          </Link>
          <Link
            to="/create"
            className="px-5 py-1.5 rounded-full text-xs font-semibold text-black bg-white hover:bg-white/90 transition-all duration-200"
          >
            {TEXT.nav.createButton}
          </Link>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="md:hidden border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <div className="px-4 h-11 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{TEXT.nav.brand}</span>
          <Link
            to="/create"
            className="px-4 py-1 rounded-full text-xs font-semibold text-black bg-white hover:bg-white/90 transition-all duration-200"
          >
            + New
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-bg/90 backdrop-blur-md">
        <div className="flex">
          <Link
            to="/"
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-150 ${
              pathname === '/' ? 'text-white' : 'text-text-muted'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
            <span className="text-[9px] font-medium tracking-wide">HOME</span>
          </Link>
          <Link
            to="/create"
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-150 ${
              pathname === '/create' ? 'text-white' : 'text-text-muted'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span className="text-[9px] font-medium tracking-wide">NEW</span>
          </Link>
        </div>
      </div>

      <div className="md:hidden h-14" aria-hidden="true" />
    </>
  );
}
