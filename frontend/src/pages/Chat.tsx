import { useState, useEffect } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import StockChart from './StockChart';
import { API_BASE_URL } from '../config';
import type { ResearchReport } from '../types';
import { 
  Search, 
  Loader2, 
  TrendingUp, 
  Newspaper, 
  FileText, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

interface ChatProps {
  activeReport: ResearchReport | null;
  onSearchInitiated?: () => void;
  onNewResearchCompleted?: () => void;
}

export default function Chat({ activeReport, onSearchInitiated, onNewResearchCompleted }: ChatProps) {
  const [companyInput, setCompanyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localReport, setLocalReport] = useState<ResearchReport | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const formatPrice = (val?: number | string | null) => {
    if (val === undefined || val === null || val === '') return '';
    const num = parseFloat(String(val));
    return isNaN(num) ? val : num.toFixed(2);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadingMessages = [
    "Resolving company ticker registry symbol...",
    "Extracting real-time market snapshots and charts...",
    "Sourcing recent global market news and catalysts...",
    "Running LLM analysis to compile recommendations..."
  ];

  // If activeReport is passed from parent (history), display it!
  const report = activeReport || localReport;

  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = uuid();
    localStorage.setItem("guestId", guestId);
  }

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyInput.trim()) return;

    setLoading(true);
    setError('');
    setLocalReport(null);
    if (onSearchInitiated) {
      onSearchInitiated();
    }

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat`,
        {
          message: companyInput,
          guestId,
        },
        { headers }
      );

      setLocalReport(response.data.data as ResearchReport);
      setCompanyInput('');
      if (onNewResearchCompleted) {
        onNewResearchCompleted();
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("Search limit reached. Please sign in to run more research reports.");
      } else {
        setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to generate research. Please verify backend environment settings." : "Failed to generate research. Please verify backend environment settings.");
      }
    } finally {
      setLoading(false);
    }
  };

  const parseInlineMarkdown = (text: string): ReactNode => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="rounded bg-[#eef3f0] px-1.5 py-0.5 font-mono text-[0.9em] text-[#31564a]">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={idx} className="font-bold text-[#111827]">{boldText}</strong>;
      }
      const subParts = part.split(/(\*.*?\*)/g);
      return subParts.map((subPart, subIdx) => {
        if (subPart.startsWith('*') && subPart.endsWith('*')) {
          return <em key={subIdx} className="italic text-[#6B7280]">{subPart.slice(1, -1)}</em>;
        }
        return subPart;
      });
    });
  };

  const formatAnalysis = (text?: string): ReactNode => {
    if (!text) return null;
    const cleanLine = (line: string) => line
      .replace(/\\\\?rightarrow\s*/g, ' → ')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\(?:text|mathrm)\s*\{([^}]*)\}/g, '$1')
      .replace(/\\(?:,|;|quad|qquad)/g, ' ')
      .replace(/\\\\/g, ' ')
      .replace(/\$+/g, '')
      .replace(/[{}]/g, '')
      .replace(/\s+([,.;:])/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const lines = text
      .replace(/\r/g, '')
      .split('\n')
      .filter((line) => !/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line))
      .map(cleanLine);
    const nodes: ReactNode[] = [];
    let index = 0;

    while (index < lines.length) {
      const trimmed = lines[index].trim();
      if (!trimmed) {
        index += 1;
        continue;
      }

      if (/^#{1,3}\s+/.test(trimmed)) {
        const title = trimmed.replace(/^#+\s*/, '');
        const isReportTitle = /^(investment research report|in-depth investment memo)/i.test(title);
        nodes.push(isReportTitle
          ? <h3 key={`heading-${index}`} className="mb-4 rounded-xl border border-[#dceee2] bg-[#f3faf6] px-4 py-3 text-sm font-extrabold leading-6 tracking-[.08em] text-[#087a4f]">{parseInlineMarkdown(title)}</h3>
          : <h4 key={`heading-${index}`} className="mt-7 border-l-[3px] border-[#00a96b] bg-[#f7faf8] py-2 pl-3 text-xs font-extrabold uppercase tracking-[.12em] text-[#087a4f] first:mt-0">{parseInlineMarkdown(title)}</h4>);
        index += 1;
        continue;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        const items: ReactNode[] = [];
        while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
          const content = lines[index].trim().replace(/^[-*]\s+/, '');
          items.push(<li key={`item-${index}`} className="pl-1 text-sm leading-6 text-[#526a60] marker:text-[#00a96b]">{parseInlineMarkdown(content)}</li>);
          index += 1;
        }
        nodes.push(<ul key={`list-${index}`} className="my-3 ml-5 list-disc space-y-1.5">{items}</ul>);
        continue;
      }

      const paragraph: string[] = [];
      while (index < lines.length && lines[index].trim() && !/^#{1,3}\s+/.test(lines[index].trim()) && !/^[-*]\s+/.test(lines[index].trim())) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      const paragraphText = paragraph.join(' ');
      const hasReportMetadata = /\*\*(?:Date|Ticker|Exchange|Current Price|Recommendation):\*\*/i.test(paragraphText);
      if (hasReportMetadata) {
        const fields = paragraphText.split(/(?=\*\*(?:Date|Ticker|Exchange|Current Price|Recommendation):\*\*)/i).filter(Boolean);
        nodes.push(<div key={`metadata-${index}`} className="my-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">{fields.map((field, fieldIndex) => <div key={fieldIndex} className="rounded-lg border border-[#e5eee9] bg-[#fbfdfc] px-3 py-2 text-xs leading-5 text-[#526a60]">{parseInlineMarkdown(field.trim())}</div>)}</div>);
      } else {
        nodes.push(<p key={`paragraph-${index}`} className="my-3 max-w-[78ch] text-sm leading-7 text-[#526a60]">{parseInlineMarkdown(paragraphText)}</p>);
      }
    }

    return nodes;
  };

  const priceHistory = report?.priceHistory || null;
  const listingVerified = report?.listingStatus === 'LISTED' || (!report?.listingStatus && report?.ticker !== 'UNKNOWN');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Search Input Container */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-[#dce6e2] p-6 shadow-[0_12px_36px_rgba(16,43,53,0.07)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#00a96b]" />
        <div className="mb-1 flex items-center gap-2"><span className="rounded-lg bg-[#e5f7ee] p-2 text-[#087a4f]"><Search className="h-4 w-4" /></span><div><p className="text-[9px] font-extrabold tracking-[.16em] text-[#00a96b]">STOCKLY RESEARCH ENGINE</p><h2 className="text-lg font-bold text-[#102b35]">Investment Research Center</h2></div></div>
        <p className="text-xs text-[#6B7F78] mb-5 font-medium">
          Enter any company name or ticker (e.g. Reliance, Apple, Tata) to conduct financial snapshot lookups, parse media sentiment, and synthesize institutional recommendations.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-[#087a4f]" />
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="Search company or ticker..."
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#dce6e2] text-sm text-[#102b35] placeholder-[#879891] bg-[#fbfdfc] outline-none focus:border-[#00a96b] transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#102b35] hover:bg-[#174653] text-white text-sm font-bold rounded-xl transition duration-150 disabled:opacity-60 flex items-center justify-center min-w-[120px] cursor-pointer shadow-md shadow-[#102b35]/10"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4.5 w-4.5 text-white" />
                <span>Analyzing...</span>
              </span>
            ) : "Analyze"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton States */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center gap-3 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
            <Loader2 className="w-4 h-4 text-[#6B7280] animate-spin" />
            <span className="text-xs font-semibold text-[#111827]">{loadingMessages[loadingStep]}</span>
          </div>

          {/* Skeleton Chart */}
          <div className="bg-white border border-[#dce6e2] rounded-2xl p-6 h-[340px] flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="h-3 bg-[#F3F4F6] rounded w-24"></div>
              <div className="h-5 bg-[#F3F4F6] rounded w-48"></div>
            </div>
            <div className="h-[200px] bg-[#F9FAFB] rounded-xl w-full border border-[#E5E7EB]"></div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:col-span-2 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="h-4 bg-[#F3F4F6] rounded w-36"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-[#F3F4F6] rounded-xl"></div>
                <div className="h-16 bg-[#F3F4F6] rounded-xl"></div>
                <div className="h-16 bg-[#F3F4F6] rounded-xl"></div>
              </div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="h-4 bg-[#F3F4F6] rounded w-28"></div>
              <div className="space-y-2">
                <div className="h-8 bg-[#F3F4F6] rounded-lg"></div>
                <div className="h-8 bg-[#F3F4F6] rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Dashboard */}
      {report && !loading ? (
        <div className="space-y-6">
          {/* Main Decision Banner (No Gradients) */}
          <div className="relative overflow-hidden bg-white border border-[#dce6e2] border-l-4 border-l-[#00a96b] rounded-2xl p-6 shadow-[0_10px_35px_rgba(16,43,53,0.06)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#087a4f]">AI Research Brief</span>
                <h1 className="text-xl font-bold tracking-tight text-[#102b35] mt-1">
                  {report.companyName} ({report.ticker})
                </h1>
                <p className="text-xs text-[#71847d] mt-1">
                  Report generated on {new Date(report.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-wider ${listingVerified ? 'bg-[#e5f7ee] text-[#087a4f]' : 'bg-[#f1f3f2] text-[#66776f]'}`}>
                  {report.listingStatus === 'UNLISTED' ? 'UNLISTED' : listingVerified ? `LISTED · ${report.ticker}` : 'LISTING UNVERIFIED'}
                </span>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div className="text-right">
                    <span className="block text-[9px] uppercase tracking-wider text-[#71847d] font-extrabold">Market signal</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 ${report.decision === 'INVEST' ? 'bg-[#e5f7ee] text-[#087a4f] border border-[#c8e9d6]' : 'bg-[#fff0ed] text-[#bc4935] border border-[#f4d5cf]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${report.decision === 'INVEST' ? 'bg-[#00a96b]' : 'bg-[#d45b45]'}`}></span>
                    {report.decision}
                  </span>
                </div>
                <div className="w-px h-8 bg-[#E5E7EB]"></div>
                <div className="text-right">
                    <span className="block text-[9px] uppercase tracking-wider text-[#71847d] font-extrabold">Signal confidence</span>
                  <span className="text-xs font-bold text-[#087a4f] block mt-1 bg-[#e5f7ee] px-2.5 py-1 rounded-full border border-[#c8e9d6]">
                    {report.confidenceScore}/10
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-[#71847d] font-extrabold">Trend score</span>
                  <span className="text-xs font-bold text-[#4268aa] block mt-1 bg-[#f1f5fc] px-2.5 py-1 rounded-full border border-[#dce5f6]">
                    {report.marketSignal?.score == null ? 'N/A' : `${report.marketSignal.score}/100`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#dceee2] bg-[#f4faf6] p-4">
              <h3 className="font-extrabold text-[10px] text-[#087a4f] uppercase tracking-[.14em] mb-2">Key Recommendation Rationale</h3>
              <p className="text-[#526a60] text-sm leading-relaxed">{report.reasoning}</p>
            </div>
          </div>

          {/* Price Chart */}
          {priceHistory && (
            <StockChart
              companyName={report.companyName}
              ticker={report.ticker}
              exchange={report.financials?.exchange || report.exchange || 'NSE'}
              currency={report.financials?.currency}
              history={priceHistory}
            />
          )}

          {/* Financials & Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Financial Metrics Card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_28px_rgba(16,43,53,0.05)] border border-[#dce6e2] p-6 md:col-span-2">
              <h2 className="text-sm font-extrabold text-[#102b35] mb-4 flex items-center gap-2 border-b border-[#e5eee9] pb-3 uppercase tracking-wider">
                <TrendingUp className="h-4 w-4 text-[#087a4f]" />
                Market Financial Snapshot
              </h2>
              {report.financials && !report.financials.error ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-[#edf8f1] border border-[#d5eddf] rounded-xl">
                    <span className="text-[10px] text-[#58816c] font-extrabold uppercase block">Current Price</span>
                    <span className="text-lg font-bold text-[#087a4f] mt-0.5 block">
                      {report.financials.currentPrice ? `${formatPrice(report.financials.currentPrice)} ${report.financials.currency || 'USD'}` : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f8faf9] border border-[#e3ebe6] rounded-xl">
                    <span className="text-[10px] text-[#71847d] font-extrabold uppercase block">Previous Close</span>
                    <span className="text-lg font-bold text-[#102b35] mt-0.5 block">
                      {report.financials.previousClose ? `${formatPrice(report.financials.previousClose)} ${report.financials.currency || 'USD'}` : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f4f7fd] border border-[#dce5f6] rounded-xl">
                    <span className="text-[10px] text-[#657da9] font-extrabold uppercase block">1-Month Return</span>
                    <span className={`text-lg font-bold block mt-0.5 ${
                      parseFloat(String(report.financials.oneMonthReturn)) >= 0 ? 'text-[#16A34A]' : 'text-[#EF4444]'
                    }`}>
                      {report.financials.oneMonthReturn ? `${formatPrice(report.financials.oneMonthReturn)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#fff9ed] border border-[#f1e4c7] rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#9b7936] font-extrabold uppercase block">52-Week Range</span>
                    <span className="text-xs font-bold text-[#111827] block mt-1">
                      {report.financials.fiftyTwoWeekLow ? formatPrice(report.financials.fiftyTwoWeekLow) : 'N/A'} - {report.financials.fiftyTwoWeekHigh ? formatPrice(report.financials.fiftyTwoWeekHigh) : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#f8faf9] border border-[#e3ebe6] rounded-xl col-span-2">
                    <span className="text-[10px] text-[#71847d] font-extrabold uppercase block">Trading Volume</span>
                    <span className="text-sm font-bold text-[#111827] block mt-0.5">
                      {report.financials.volume ? report.financials.volume.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[#6B7280] text-xs font-medium">No real-time market data available (or company is private/unlisted).</p>
              )}
            </div>

            {/* Top Catalyst/News Card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_28px_rgba(16,43,53,0.05)] border border-[#e9dfc9] p-6 flex flex-col">
              <h2 className="text-sm font-extrabold text-[#102b35] mb-4 flex items-center gap-2 border-b border-[#f0e8d9] pb-3 uppercase tracking-wider">
                <Newspaper className="h-4 w-4 text-[#b27b1d]" />
                Market News Sources
              </h2>
              <div className="space-y-3 overflow-y-auto max-h-[160px] flex-1 pr-1">
                {report.news && report.news.length > 0 ? (
                  report.news.map((item, index) => (
                    <div key={index} className="text-xs border-b border-[#E5E7EB] pb-2.5 last:border-0 last:pb-0">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#29453b] hover:text-[#087a4f] font-semibold line-clamp-2 flex items-center gap-1 transition-all"
                      >
                        <span>{item.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                      </a>
                      <span className="text-[#6B7280] text-[10px] mt-1.5 block font-medium">
                        {item.source} • {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[#6B7280] text-xs font-medium">No recent news publications extracted.</p>
                )}
              </div>
            </div>
          </div>

          {/* Full Investment Analysis Memo */}
          <div className="bg-white rounded-2xl shadow-[0_8px_28px_rgba(16,43,53,0.05)] border border-[#dce6e2] p-6">
            <h2 className="text-sm font-extrabold text-[#102b35] mb-4 flex items-center gap-2 border-b border-[#e5eee9] pb-3 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-[#5575b5]" />
              In-Depth Investment Memo
            </h2>
            <div className="prose max-w-none">
              {formatAnalysis(report.analysis)}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        !loading && (
          <div className="bg-white rounded-2xl border border-dashed border-[#cbdad1] p-12 text-center shadow-sm">
            <Search className="h-10 w-10 text-[#00a96b]/60 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#102b35]">No Research Report Loaded</h3>
            <p className="text-[#71847d] text-xs max-w-xs mx-auto mt-1 font-medium">
              Enter a company name or ticker above to run a deep analysis, or select a log from history.
            </p>
          </div>
        )
      )}
    </div>
  );
}
