import { ArrowRight, FileSearch, LineChart, Newspaper, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const steps = [
  { number: '01', icon: Search, title: 'Search a company', text: 'Enter a business name or ticker. Stockly resolves the symbol and checks whether market data is available.' },
  { number: '02', icon: LineChart, title: 'Build market context', text: 'The research desk gathers price snapshots and historical data, then shows a chart with the available time ranges.' },
  { number: '03', icon: Newspaper, title: 'Gather recent catalysts', text: 'Recent company and market coverage is collected to add timely context to the research.' },
  { number: '04', icon: FileSearch, title: 'Read the research memo', text: 'An AI workflow organizes the company context, risks, and catalysts. A separate price-momentum score applies a visible threshold to historical returns for its INVEST or PASS market signal.' },
];

export default function HowItWorks() {
  return <div className="min-h-screen bg-[#f3f7f5] font-sans text-[#102b35]"><SiteHeader/><main>
    <section className="relative overflow-hidden border-b border-[#dce7df] bg-[#edf4ef]"><div className="market-glow absolute inset-0 opacity-40"/><div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#087a4f]">How Stockly works</p><h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[#102b35] sm:text-5xl">From a company name to a research brief.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[#61756e]">A simple flow brings market information and current company context into a single report.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 md:py-20"><div className="space-y-4">{steps.map(({number,icon:Icon,title,text},index)=><article key={number} className="grid gap-5 rounded-2xl border border-[#dce6e2] bg-white p-6 shadow-sm shadow-[#102b35]/[.03] sm:grid-cols-[72px_1fr] sm:items-start sm:p-8"><div className="flex items-center gap-3 sm:block"><span className="text-xs font-extrabold tracking-widest text-[#879891]">{number}</span><span className={`rounded-xl p-3 sm:mt-4 sm:inline-flex ${['bg-[#e5f7ee] text-[#087a4f]','bg-[#fff0ce] text-[#ac7113]','bg-[#e7eefc] text-[#4268aa]','bg-[#f2e9fb] text-[#7950a1]'][index]}`}><Icon size={20}/></span></div><div><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7F78]">{text}</p></div></article>)}</div>
      <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#111827] p-7 text-white sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60"><Sparkles size={14}/> Ready to begin</div><h2 className="mt-2 text-xl font-bold">Run your first company analysis.</h2></div><Link to="/dashboard" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#111827] hover:bg-[#F3F4F6]">Open research desk <ArrowRight size={16}/></Link></div>
    </section>
  </main><SiteFooter/></div>;
}
