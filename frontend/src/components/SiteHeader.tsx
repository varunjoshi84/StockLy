import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, TrendingUp, X } from 'lucide-react';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition-colors ${isActive ? 'text-[#087a4f]' : 'text-[#61756e] hover:text-[#102b35]'}`;

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#dce6e2] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Stockly home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102b35] text-[#c5f36a]"><TrendingUp size={19} strokeWidth={2.5} /></span>
          <span className="text-lg font-bold tracking-tight text-[#102b35]">Stockly<span className="text-[#00a96b]">.</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <NavLink to="/features" className={navClass}>Features</NavLink>
          <NavLink to="/how-it-works" className={navClass}>How it works</NavLink>
          <Link to="/dashboard" className="text-sm font-semibold text-[#61756e] transition-colors hover:text-[#102b35]">Research desk</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/login" className="hidden px-2 py-2 text-sm font-semibold text-[#4b635a] hover:text-[#102b35] md:inline-flex">Sign in</Link>
          <Link to="/register" className="hidden rounded-lg bg-[#102b35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#174653] md:inline-flex">Get started</Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce6e2] text-[#102b35] transition hover:bg-[#f3f7f5] md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="border-t border-[#e5eee9] bg-white px-5 py-3 shadow-lg shadow-[#102b35]/[.06] md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col">
            <NavLink to="/features" onClick={closeMenu} className={({ isActive }) => `rounded-lg px-3 py-3 text-sm font-semibold ${isActive ? 'bg-[#edf8f1] text-[#087a4f]' : 'text-[#526a60] hover:bg-[#f5f9f6]'}`}>Features</NavLink>
            <NavLink to="/how-it-works" onClick={closeMenu} className={({ isActive }) => `rounded-lg px-3 py-3 text-sm font-semibold ${isActive ? 'bg-[#edf8f1] text-[#087a4f]' : 'text-[#526a60] hover:bg-[#f5f9f6]'}`}>How it works</NavLink>
            <Link to="/dashboard" onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#526a60] hover:bg-[#f5f9f6]">Research desk</Link>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#e5eee9] pt-3">
              <Link to="/login" onClick={closeMenu} className="flex min-h-11 items-center justify-center rounded-lg border border-[#dce6e2] px-4 text-sm font-semibold text-[#24463b]">Sign in</Link>
              <Link to="/register" onClick={closeMenu} className="flex min-h-11 items-center justify-center rounded-lg bg-[#087a4f] px-4 text-sm font-bold text-white">Get started</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
