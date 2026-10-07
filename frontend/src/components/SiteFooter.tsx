import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#dce6e2] bg-[#102b35]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-[#b9cbc4] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-white"><TrendingUp size={16} className="text-[#c5f36a]" /> Stockly</Link>
        <p>Research tools for clearer investment decisions.</p>
        <div className="flex gap-5"><Link to="/features" className="hover:text-white">Features</Link><Link to="/how-it-works" className="hover:text-white">How it works</Link><Link to="/dashboard" className="hover:text-white">Research desk</Link></div>
      </div>
    </footer>
  );
}
