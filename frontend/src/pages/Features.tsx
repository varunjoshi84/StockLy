import { ArrowRight, BarChart3, BriefcaseBusiness, FileText, Globe2, LineChart, Newspaper, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const features = [
  { icon: Globe2, title: 'Ticker resolution', text: 'Search by company name or ticker. Stockly resolves common names to exchange symbols and calls out unlisted businesses clearly.' },
  { icon: BarChart3, title: 'Market snapshot', text: 'See price, previous close, 52-week range, volume, and returns with currency appropriate to the market.' },
  { icon: LineChart, title: 'Interactive price history', text: 'Explore historical performance across intraday, monthly, yearly, and longer-term periods.' },
  { icon: Newspaper, title: 'News and catalysts', text: 'Review recent coverage and market catalysts alongside the company’s financial context.' },
  { icon: FileText, title: 'AI research memo', text: 'Get a structured overview of the company, its strengths, risks, and catalysts, alongside a separate historical price-momentum signal.' },
  { icon: BriefcaseBusiness, title: 'Saved research logs', text: 'Sign in to keep your analysis history, reopen past reports, and remove reports you no longer need.' },
];

export default function Features() {
  return <div className="min-h-screen bg-[#f3f7f5] font-sans text-[#102b35]"><SiteHeader/><main>
    <section className="relative overflow-hidden border-b border-[#dce7df] bg-[#edf4ef]"><div className="market-glow absolute inset-0 opacity-40"/><div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#087a4f]">Stockly features</p><h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[#102b35] sm:text-5xl">The pieces of company research, in one place.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[#61756e]">Go from a company or ticker search to market context, current catalysts, and an organized AI research memo.</p><Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#087a4f] px-5 py-3 text-sm font-bold text-white hover:bg-[#066640]">Explore the research desk <ArrowRight size={16}/></Link></div></section>
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20"><div className="mb-8 flex items-end justify-between"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#00a96b]">BUILT FOR COMPANY RESEARCH</p><h2 className="mt-2 text-2xl font-bold">Everything you need to get oriented</h2></div><span className="hidden rounded-full border border-[#dce6e2] bg-white px-3 py-1.5 text-xs font-bold text-[#587168] sm:inline-flex">6 CORE TOOLS</span></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map(({icon:Icon,title,text},index)=><article key={title} className={`group rounded-2xl border p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${['border-[#cce9d9] bg-[#eef8f2]','border-[#f1dfb8] bg-[#fff9ec]','border-[#d5e1f6] bg-[#f1f5fc]'][index%3]}`}><div className="flex items-center justify-between"><span className={`rounded-xl p-3 ${['bg-[#d8f1e2] text-[#087a4f]','bg-[#ffefca] text-[#a86e0c]','bg-[#dfe9fb] text-[#4268aa]'][index%3]}`}><Icon size={20}/></span><span className="text-xs font-bold tracking-widest text-[#82958e]">0{index+1}</span></div><h2 className="mt-5 text-base font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#62776f]">{text}</p></article>)}</div>
      <div className="mt-12 rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5] p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><span className="w-fit rounded-xl bg-white p-3 text-[#00A844]"><ShieldCheck size={22}/></span><div className="flex-1"><h2 className="font-bold">A market signal, with room for your judgment.</h2><p className="mt-1 text-sm leading-6 text-[#4B5563]">INVEST or PASS is based on a published price-momentum score and threshold. It does not evaluate valuation or company fundamentals; review the underlying data and memo as part of your own research.</p></div><Sparkles className="hidden text-[#00A844] sm:block" size={24}/></div></div>
    </section>
  </main><SiteFooter/></div>;
}
