import { useMemo, useRef, useState } from 'react';
import type { Plugin, ChartOptions, Chart as ChartInstance } from 'chart.js';
import type { PriceHistory, PricePoint } from '../types';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

const PERIODS = ['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'All'] as const;

const GREEN = '#00C853';
const RED = '#EF4444';

/**
 * Draws the Groww-style crosshair: a vertical line + a ring marker
 * at whichever point is currently hovered/active.
 */
const crosshairPlugin: Plugin<'line'> = {
  id: 'crosshair',
  afterDatasetsDraw(chart) {
    const active = chart.getActiveElements();
    if (!active || !active.length) return;

    const { ctx, chartArea } = chart;
    const point = active[0].element;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(point.x, chartArea.top);
    ctx.lineTo(point.x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = typeof chart.data.datasets[0].borderColor === 'string' ? chart.data.datasets[0].borderColor : GREEN;
    ctx.stroke();
    ctx.restore();
  },
};

/**
 * Reference dashed baseline at the first price of the visible range,
 * matching the faint horizontal guide line Groww shows.
 */
const baselinePlugin: Plugin<'line'> = {
  id: 'baseline',
  beforeDatasetsDraw(chart) {
    const data = chart.data.datasets[0]?.data;
    if (!data || !data.length) return;
    const firstPrice = Number(data[0]);
    if (!Number.isFinite(firstPrice)) return;
    const y = chart.scales.y.getPixelForValue(firstPrice);
    const { left, right } = chart.chartArea;

    const { ctx } = chart;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.restore();
  },
};

/**
 * StockChart
 *
 * history: {
 *   '1D': [{ date: '10:15 AM', price: 3040.1 }, ...],
 *   '1W': [...], '1M': [...], '3M': [...], '6M': [...],
 *   '1Y': [...], '3Y': [...], '5Y': [...], 'All': [...]
 * }
 * Each array should be pre-sorted oldest -> newest.
 */
interface StockChartProps {
  companyName: string;
  ticker: string;
  exchange?: string;
  history?: PriceHistory | null;
  loading?: boolean;
  currency?: string;
}

export default function StockChart({
  companyName,
  ticker,
  exchange = 'NSE',
  history,
  loading = false,
  currency,
}: StockChartProps) {
  const chartRef = useRef<ChartInstance<'line'> | null>(null);

  const isINR = currency === 'INR' || exchange === 'NSE' || exchange === 'BSE' || exchange === 'NSI' || ticker?.endsWith('.NS') || ticker?.endsWith('.BO');
  const currencySymbol = isINR ? '₹' : (currency === 'USD' ? '$' : currency || '$');

  const availablePeriods = PERIODS.filter((p) => history?.[p]?.length);
  const defaultPeriod =
    (availablePeriods.includes('3Y') && '3Y') || availablePeriods[0] || '1D';

  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(defaultPeriod);
  const [hover, setHover] = useState<PricePoint | null>(null);

  const data = history?.[period] || [];

  const latestPrice = data.length ? data[data.length - 1].price : null;
  const startPrice = data.length ? data[0].price : null;
  const change =
    latestPrice != null && startPrice != null ? latestPrice - startPrice : null;
  const changePercent = startPrice && change !== null ? (change / startPrice) * 100 : null;
  const isUp = (change ?? 0) >= 0;
  const lineColor = isUp ? GREEN : RED;

  const displayPrice = hover ? hover.price : latestPrice;
  const displayDate = hover ? hover.date : null;

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.date),
      datasets: [
        {
          data: data.map((d) => d.price),
          borderColor: lineColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.15,
          fill: false,
        },
      ],
    }),
    [data, lineColor]
  );

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false, axis: 'x' },
      animation: { duration: 300 },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: (context) => {
            const point = context.tooltip.dataPoints?.[0];
            if (!point) {
              setHover(null);
              return;
            }
            setHover({ price: Number(point.raw), date: String(point.label) });
          },
        },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      onHover: (_event, elements) => {
        if (!elements.length) setHover(null);
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-2xl border border-[#dce6e2] shadow-[0_8px_28px_rgba(16,43,53,0.05)] p-6">
      {/* Header */}
      <span className="inline-flex rounded-md bg-[#edf8f1] px-2 py-1 text-[10px] text-[#087a4f] font-extrabold tracking-wider">
        {ticker} · {exchange}
      </span>
      <h2 className="text-lg font-bold text-[#111827] mt-1 mb-2">{companyName}</h2>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-[#102b35] tracking-tight">
          {displayPrice != null
            ? `${currencySymbol}${displayPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
            : '--'}
        </span>
        {!hover && change != null && changePercent != null && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isUp ? 'bg-[#e5f7ee] text-[#087a4f] border border-[#c8e9d6]' : 'bg-[#fff0ed] text-[#bc4935] border border-[#f4d5cf]'
            }`}
          >
            {isUp ? '+' : ''}
            {change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </span>
        )}
        <span className="text-xs text-[#6B7280] font-medium">{hover ? displayDate : period}</span>
      </div>

      {/* Chart */}
      <div
        className="h-[260px] mt-5 relative"
        onMouseLeave={() => setHover(null)}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-300 text-sm">
            Loading chart...
          </div>
        ) : data.length ? (
          <Line
            ref={chartRef}
            data={chartData}
            options={options}
            plugins={[crosshairPlugin, baselinePlugin]}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-300 text-sm">
            No price history available
          </div>
        )}
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-[#e5eee9]">
        {PERIODS.map((p) => {
          const disabled = !history?.[p]?.length;
          const active = period === p;
          return (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => {
                setPeriod(p);
                setHover(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer
                ${
                  active
                    ? 'bg-[#087a4f] text-white border-[#087a4f] shadow-sm shadow-[#087a4f]/15'
                    : disabled
                    ? 'border-[#E5E7EB] text-[#E5E7EB] opacity-40 cursor-not-allowed'
                    : 'border-[#dce6e2] text-[#71847d] bg-white hover:bg-[#edf8f1] hover:text-[#087a4f]'
                }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
