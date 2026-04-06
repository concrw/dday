import { Link } from 'react-router-dom';
import { TEXT } from '@/constants/text';

export function NavBar() {
  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-primary"
        >
          {TEXT.nav.brand}
        </Link>
        <Link
          to="/create"
          className="inline-flex items-center justify-center min-h-10 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 hover:opacity-90"
        >
          {TEXT.nav.createButton}
        </Link>
      </div>
    </nav>
  );
}
