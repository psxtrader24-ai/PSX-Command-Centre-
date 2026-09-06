import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  PortfolioKPIs,
  CapitalFlow,
  OpenPosition,
  EquityCurvePoint,
  RiskMetrics,
} from '../types';
import { formatPKR, formatPercent, formatDate } from '../utils/formatters';

interface OverviewDashboardProps {
  kpis: PortfolioKPIs;
  capitalFlow: CapitalFlow;
  openPositions: OpenPosition[];
  equityCurve: EquityCurvePoint[];
  riskMetrics: RiskMetrics;
  darkMode: boolean;
  onNavigate: (view: string) => void;
  onOpenTradeModal: () => void;
  onOpenCashModal: (type: 'DEPOSIT' | 'WITHDRAWAL') => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  kpis,
  capitalFlow,
  openPositions,
  equityCurve,
  riskMetrics,
  darkMode,
  onNavigate,
  onOpenTradeModal,
  onOpenCashModal,
}) => {
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL'>('ALL');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);

  // Filter equity points based on time range
  const filteredEquity = React.useMemo(() => {
    if (timeRange === 'ALL' || equityCurve.length <= 4) return equityCurve;
    if (timeRange === '1W') return equityCurve.slice(-4);
    if (timeRange === '1M') return equityCurve.slice(-6);
    if (timeRange === '3M') return equityCurve.slice(-8);
    return equityCurve;
  }, [timeRange, equityCurve]);

  // Allocation Donut data
  const allocationData = [
    { name: 'Invested Securities', value: capitalFlow.currentMarketValue, color: '#3B82F6' },
    { name: 'Available Cash', value: Math.max(0, capitalFlow.currentCash), color: '#10B981' },
  ];

  // Sector concentration data for bar chart
  const sectorData = riskMetrics.sectorConcentration.slice(0, 6);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 1. CAPITAL FLOW FORMULA BANNER (Core Architectural Requirement: Section 18) */}
      <div
        id="capital-flow-formula-banner"
        className="bg-[#161B22] border border-[#1E2229] p-3 rounded"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-blue-500 rounded-xs"></div>
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-gray-300">
              Capital Accounting Flow Identity <span className="text-blue-500 font-light italic text-[10px]">(Strict Non-Conflation Model)</span>
            </h4>
          </div>
          <span className="text-[10px] text-gray-500">
            Deposits are never trading profits; withdrawals are never trading losses.
          </span>
        </div>

        {/* Mathematical Equation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center items-center">
          <div className="p-2.5 rounded bg-[#0E1116] border border-[#1E2229]">
            <span className="text-[10px] text-gray-500 block uppercase mb-0.5">Opening Capital</span>
            <span className="font-bold text-white text-sm">{formatPKR(capitalFlow.openingCapital, { compact: true })}</span>
          </div>

          <div className="p-2.5 rounded bg-[#0E1116] border border-[#1E2229]">
            <span className="text-[10px] text-emerald-500 block uppercase mb-0.5">+ Deposits</span>
            <span className="font-bold text-emerald-500 text-sm">{formatPKR(capitalFlow.totalDeposits, { compact: true })}</span>
          </div>

          <div className="p-2.5 rounded bg-[#0E1116] border border-[#1E2229]">
            <span className="text-[10px] text-rose-500 block uppercase mb-0.5">− Withdrawals</span>
            <span className="font-bold text-rose-500 text-sm">{formatPKR(capitalFlow.totalWithdrawals, { compact: true })}</span>
          </div>

          <div className="p-2.5 rounded bg-[#0E1116] border border-[#1E2229]">
            <span className="text-[10px] text-blue-400 block uppercase mb-0.5">+ Trading P&L</span>
            <span className={`font-bold text-sm ${capitalFlow.totalTradingPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatPKR(capitalFlow.totalTradingPnL, { compact: true, showSign: true })}
            </span>
          </div>

          <div className="p-2.5 rounded bg-blue-600/10 border border-blue-500/40">
            <span className="text-[10px] text-blue-400 block uppercase font-bold mb-0.5">= Current Equity</span>
            <span className="font-bold text-white text-sm">{formatPKR(capitalFlow.currentEquity, { compact: true })}</span>
          </div>
        </div>
      </div>

      {/* 2. EQUITY CURVE & PERFORMANCE CHART (Section 10) */}
      <div className="bg-[#161B22] border border-[#1E2229] rounded overflow-hidden">
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[#1E2229] gap-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-emerald-500 rounded-xs"></div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Equity Curve <span className="text-blue-500 font-light italic">- ALL TIME</span> vs KSE-100 Benchmark
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Time-weighted equity trajectory in PKR vs Pakistan Stock Exchange benchmark index return.
              </p>
            </div>
          </div>

          {/* Controls: Time Period & Benchmark Overlay */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors border ${
                showBenchmark
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-semibold'
                  : 'border-[#1E2229] bg-[#0E1116] text-gray-400 hover:text-gray-200'
              }`}
            >
              Benchmark (KSE-100)
            </button>

            <div className="flex rounded border border-[#1E2229] overflow-hidden text-[10px]">
              {(['1W', '1M', '3M', '6M', 'YTD', 'ALL'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 font-semibold transition-colors ${
                    timeRange === r ? 'bg-blue-600 text-white' : 'bg-[#0E1116] text-gray-400 hover:text-gray-200 hover:bg-[#1E2229]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recharts Equity Curve */}
        <div className="h-64 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredEquity} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1E2229" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={10}
                tickFormatter={(val) => formatDate(val)}
              />
              <YAxis
                yAxisId="left"
                stroke="#6B7280"
                fontSize={10}
                tickFormatter={(v) => `${(v / 1000000).toFixed(2)}M`}
                domain={['auto', 'auto']}
              />
              {showBenchmark && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#F59E0B"
                  fontSize={10}
                  tickFormatter={(v) => `${v}%`}
                  domain={['auto', 'auto']}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#11141A',
                  borderColor: '#1E2229',
                  color: '#D1D5DB',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
                formatter={(val: any, name: any) => {
                  if (name === 'Portfolio Equity') return [formatPKR(Number(val)), name];
                  if (name === 'Net Deposits') return [formatPKR(Number(val)), name];
                  if (name === 'KSE-100 Benchmark %' || name === 'KSE-100 Return %') return [formatPercent(Number(val)), name];
                  return [val, name];
                }}
                labelFormatter={(label) => `Date: ${formatDate(String(label))}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="portfolioEquity"
                name="Portfolio Equity"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#3B82F6' }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="left"
                type="stepAfter"
                dataKey="netDeposits"
                name="Net Deposits"
                stroke="#6B7280"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              {showBenchmark && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="benchmarkReturnPercent"
                  name="KSE-100 Return %"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#F59E0B' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. MIDDLE DUAL SECTION: ALLOCATION & SECTOR CONCENTRATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Allocation: Cash vs Invested */}
        <div className="bg-[#161B22] border border-[#1E2229] rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
              Capital Allocation <span className="text-gray-600 font-normal italic">(Cash vs Invested)</span>
            </h4>
            <span className="text-[10px] text-gray-500 font-mono">Deployable Ratio</span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => formatPKR(Number(val))}
                  contentStyle={{
                    backgroundColor: '#11141A',
                    borderColor: '#1E2229',
                    color: '#D1D5DB',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-[11px] pt-3 border-t border-[#1E2229]">
            <div>
              <span className="text-blue-400 block font-semibold">Invested: {formatPercent(riskMetrics.investedPercent, { showSign: false })}</span>
              <span className="text-gray-500 text-[10px]">{formatPKR(capitalFlow.currentMarketValue, { compact: true })}</span>
            </div>
            <div>
              <span className="text-emerald-500 block font-semibold">Cash: {formatPercent(riskMetrics.cashPercent, { showSign: false })}</span>
              <span className="text-gray-500 text-[10px]">{formatPKR(capitalFlow.currentCash, { compact: true })}</span>
            </div>
          </div>
        </div>

        {/* Sector Exposure Breakdown */}
        <div className="bg-[#161B22] border border-[#1E2229] rounded p-4 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
              Sector Exposure & Risk Concentration
            </h4>
            <span className="text-[10px] text-gray-500 font-mono">Max Sector: {sectorData[0]?.percentage.toFixed(1)}%</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1E2229" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={10} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="sector" type="category" stroke="#9CA3AF" fontSize={10} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toFixed(2)}% of Portfolio`, 'Weight']}
                  contentStyle={{
                    backgroundColor: '#11141A',
                    borderColor: '#1E2229',
                    color: '#D1D5DB',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="percentage" fill="#3B82F6" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-3 border-t border-[#1E2229]">
            <span>Portfolio Heat: <strong className="text-emerald-500">{riskMetrics.portfolioHeat.toFixed(2)}%</strong></span>
            <span>Largest Position: <strong className="text-blue-400">{riskMetrics.largestPositionSymbol} ({riskMetrics.largestPositionPercent.toFixed(1)}%)</strong></span>
            <span>Max Drawdown: <strong className="text-rose-500">-{riskMetrics.maxDrawdownPercent.toFixed(2)}%</strong></span>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE OPEN POSITIONS SUMMARY WIDGET */}
      <div className="bg-[#161B22] border border-[#1E2229] rounded flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2229]">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-blue-500 rounded-xs"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Current Open Positions <span className="text-gray-600 font-normal italic ml-2">Active Market Exposure</span>
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] bg-[#1E2229] text-gray-400 px-2.5 py-0.5 rounded uppercase font-mono">
              {openPositions.length} Total Positions
            </span>
            <button
              onClick={() => onNavigate('positions')}
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-mono text-[11px] transition-colors"
            >
              <span>View Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0E1116] text-gray-500 uppercase text-[10px] tracking-widest border-b border-[#1E2229]">
                <th className="py-2.5 px-4">Symbol</th>
                <th className="py-2.5 px-4">Qty</th>
                <th className="py-2.5 px-4">Avg Entry</th>
                <th className="py-2.5 px-4">Current Price</th>
                <th className="py-2.5 px-4">Market Value</th>
                <th className="py-2.5 px-4">Unrealized P&L</th>
                <th className="py-2.5 px-4">Weight %</th>
                <th className="py-2.5 px-4">Stop Loss</th>
                <th className="py-2.5 px-4">Dist. to Stop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2229]">
              {openPositions.map((pos) => {
                const isProfit = pos.unrealizedPnL >= 0;
                return (
                  <tr key={pos.symbol} className="hover:bg-blue-500/5 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-white">{pos.symbol}</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{pos.companyName}</div>
                    </td>
                    <td className="py-2.5 px-4 text-gray-300">{pos.quantity.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-gray-300">{formatPKR(pos.avgEntryPrice)}</td>
                    <td className="py-2.5 px-4 font-semibold text-white">{formatPKR(pos.currentPrice)}</td>
                    <td className="py-2.5 px-4 font-bold text-gray-200">{formatPKR(pos.marketValue)}</td>
                    <td className="py-2.5 px-4">
                      <span className={`font-bold ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatPKR(pos.unrealizedPnL, { showSign: true })}
                      </span>
                      <span className={`text-[10px] ml-1.5 ${isProfit ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>
                        ({formatPercent(pos.unrealizedPnLPercent)})
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-gray-400">
                      {capitalFlow.currentEquity > 0
                        ? `${((pos.marketValue / capitalFlow.currentEquity) * 100).toFixed(1)}%`
                        : '0.0%'}
                    </td>
                    <td className="py-2.5 px-4 text-gray-400">
                      {pos.stopLoss ? formatPKR(pos.stopLoss) : '—'}
                    </td>
                    <td className="py-2.5 px-4">
                      {pos.distanceToStopPercent !== undefined ? (
                        <span className="text-amber-400 font-semibold">
                          -{pos.distanceToStopPercent.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
