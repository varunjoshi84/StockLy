export interface PricePoint {
  date: string;
  price: number;
  timestamp?: number;
}

export type PriceHistory = Partial<Record<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'All', PricePoint[]>>;

export interface FinancialSnapshot {
  exchange?: string;
  currency?: string;
  currentPrice?: number | string;
  previousClose?: number | string;
  oneMonthReturn?: number | string;
  fiftyTwoWeekLow?: number | string;
  fiftyTwoWeekHigh?: number | string;
  volume?: number;
  error?: string;
}

export interface ResearchReport {
  _id?: string;
  companyName: string;
  ticker: string;
  listingStatus?: 'LISTED' | 'UNLISTED' | 'UNKNOWN';
  decision: string;
  confidenceScore: number;
  marketSignal?: {
    score: number | null;
    decision: string;
    confidenceScore: number;
    insufficientData: boolean;
    periodsUsed: Array<{ period: string; returnPct: number; signalScore: number }>;
    method: string;
    reasoning: string;
  };
  createdAt: string;
  analysis?: string;
  reasoning?: string;
  exchange?: string;
  priceHistory?: PriceHistory;
  financials?: FinancialSnapshot;
  news?: Array<{ title: string; link?: string; sentiment?: string; source?: string; publishedAt?: string; pubDate?: string }>;
}
