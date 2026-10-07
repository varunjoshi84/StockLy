import { ArrowRight, BarChart3, Check, Globe2, Newspaper, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const pillars = [
  { icon: BarChart3, kicker: '01 / MARKET DATA', title: 'Know the numbers', text: 'Price, performance, ranges, and volume with the context investors need.' },
  { icon: Newspaper, kicker: '02 / LIVE CONTEXT', title: 'Follow the catalysts', text: 'Recent headlines and company developments alongside the market view.' },
  { icon: ShieldCheck, kicker: '03 / RESEARCH MEMO', title: 'Make sense of it', text: 'A structured AI memo that brings the facts, risks, and thesis together.' },
];

export default function Landing() {
  return <div className="min-h-screen bg-[#f3f7f5] font-sans text-[#102b35]"><SiteHeader />
    <main>
      <section className="relative overflow-hidden border-b border-[#dce7df] bg-[#edf4ef] text-[#102b35]">
        <div className="market-glow absolute inset-0 opacity-50" />
        <div className="absolute -right-32 -top-48 h-[34rem] w-[34rem] rounded-full border border-[#087a4f]/10" />
        <div className="absolute -right-12 -top-28 h-[26rem] w-[26rem] rounded-full border border-[#087a4f]/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[.96fr_1.04fr] md:py-24">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b8ddc8] bg-white/70 px-3.5 py-2 text-xs font-semibold text-[#087a4f]"><Sparkles size={14} /> RESEARCH WITH A CLEARER VIEW</div>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.07] tracking-tight sm:text-5xl lg:text-[3.65rem]">See the full picture behind every <span className="text-[#087a4f]">ticker.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#61756e] sm:text-lg">Market data, company news, and structured AI analysis brought together in one focused research desk.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087a4f] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#087a4f]/15 transition hover:bg-[#066640]">Open research desk <ArrowRight size={17} /></Link><Link to="/how-it-works" className="inline-flex items-center justify-center rounded-xl border border-[#cbdad1] bg-white/75 px-6 py-3.5 text-sm font-semibold text-[#24463b] transition hover:bg-white">How it works</Link></div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#61756e]">{['Listed & private companies', 'Interactive price history', 'Saved research logs'].map(item => <span key={item} className="inline-flex items-center gap-2"><Check size={14} className="text-[#087a4f]" />{item}</span>)}</div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#00c982]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#f8fbfa] text-[#102b35] shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-[#dce6e2] px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102b35] text-[#c5f36a]"><TrendingUp size={20}/></span><div><p className="text-[10px] font-bold tracking-[.15em] text-[#698078]">COMPANY BRIEF</p><p className="mt-0.5 text-sm font-bold">Tata Consultancy Services</p></div></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f7ee] px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-[#087a4f]"><span className="h-1.5 w-1.5 rounded-full bg-[#00a96b]"/>INVEST</span></div>
              <div className="grid grid-cols-[1fr_auto] items-end px-5 pt-5 sm:px-6"><div><p className="text-xs font-medium text-[#698078]">TCS · NSE · INR</p><p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">₹3,842.50</p></div><div className="mb-1 rounded-lg bg-[#e5f7ee] px-2.5 py-1.5 text-xs font-bold text-[#087a4f]">↗ +1.84%</div></div>
              <div className="px-4 pt-4 sm:px-6"><div className="relative h-36 overflow-hidden rounded-xl bg-[#eaf4ef] p-2"><div className="absolute inset-0 opacity-60" style={{backgroundImage:'linear-gradient(rgba(16,43,53,.07) 1px, transparent 1px),linear-gradient(90deg,rgba(16,43,53,.07) 1px,transparent 1px)',backgroundSize:'34px 34px'}}/><svg viewBox="0 0 480 110" className="relative h-full w-full" role="img" aria-label="Illustrative stock price trend"><defs><linearGradient id="homeChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00a96b" stopOpacity=".25"/><stop offset="100%" stopColor="#00a96b" stopOpacity="0"/></linearGradient></defs><path d="M0 83 C34 78 48 61 78 69 S126 70 154 49 S198 64 229 41 S272 45 302 32 S342 45 370 22 S422 30 480 8 V110 H0Z" fill="url(#homeChartFill)"/><path d="M0 83 C34 78 48 61 78 69 S126 70 154 49 S198 64 229 41 S272 45 302 32 S342 45 370 22 S422 30 480 8" fill="none" stroke="#00a96b" strokeWidth="3" strokeLinecap="round"/><circle cx="480" cy="8" r="5" fill="#fff" stroke="#00a96b" strokeWidth="3"/></svg><span className="absolute bottom-2 left-3 text-[9px] font-semibold tracking-wider text-[#698078]">PRICE HISTORY · 1Y</span></div></div>
              <div className="grid grid-cols-3 gap-px border-y border-[#dce6e2] bg-[#dce6e2] mt-4">{[['52W LOW','₹3,156'],['52W HIGH','₹4,592'],['VOLUME','2.4M']].map(([label,value])=><div key={label} className="bg-white px-4 py-3"><p className="text-[9px] font-bold tracking-widest text-[#698078]">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}</div>
              <div className="flex items-center gap-3 px-5 py-4 sm:px-6"><span className="rounded-lg bg-[#fff3d8] p-2 text-[#b77912]"><Newspaper size={16}/></span><div className="min-w-0 flex-1"><p className="text-[9px] font-bold tracking-widest text-[#8a7650]">LATEST CATALYST</p><p className="truncate text-xs font-semibold">Company context, market moves, and recent news in one view</p></div><ArrowRight size={15} className="text-[#698078]"/></div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-xl border border-[#dce6e2] bg-white px-4 py-3 shadow-xl sm:flex"><span className="rounded-lg bg-[#e5f7ee] p-2 text-[#087a4f]"><Globe2 size={16}/></span><span className="text-xs font-bold">NSE · BSE · US MARKETS</span></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold tracking-[.2em] text-[#00a96b]">A BETTER RESEARCH WORKFLOW</p><h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Go from market noise to useful context.</h2></div><Link to="/features" className="inline-flex items-center gap-2 text-sm font-bold text-[#087a4f] hover:text-[#102b35]">Explore Stockly <ArrowRight size={16}/></Link></div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">{pillars.map(({icon:Icon,kicker,title,text},index)=><article key={title} className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${index===1?'border-[#f1d9a4] bg-[#fffaf0]':'border-[#dce6e2] bg-white'}`}><span className={`inline-flex rounded-xl p-3 ${index===0?'bg-[#e5f7ee] text-[#087a4f]':index===1?'bg-[#fff0ce] text-[#ac7113]':'bg-[#e7eefc] text-[#4268aa]'}`}><Icon size={20}/></span><p className="mt-5 text-[10px] font-extrabold tracking-[.14em] text-[#788c85]">{kicker}</p><h3 className="mt-2 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#667b73]">{text}</p></article>)}</div>
      </section>
      <section className="mx-5 mb-14 overflow-hidden rounded-2xl bg-[#dff3e9] sm:mx-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-9 sm:flex-row sm:items-center sm:px-10"><div><p className="text-xs font-extrabold tracking-[.18em] text-[#087a4f]">YOUR NEXT IDEA STARTS HERE</p><h2 className="mt-2 text-2xl font-bold">Start with a name. Leave with a clearer view.</h2></div><Link to="/dashboard" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#102b35] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#174653]">Start researching <ArrowRight size={16}/></Link></div></section>
    </main><SiteFooter />
  </div>;
}
