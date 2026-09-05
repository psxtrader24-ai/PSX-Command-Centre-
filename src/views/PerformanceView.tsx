import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
  Target,
  Clock,
  Shield,
  Percent,
  Calendar,
} from 'lucide-react';
import { TimeBasedPerformance, TradingStatistics, RiskMetrics } from '../types';
import { formatPKR, formatPercent } from '../utils/formatters';

interface PerformanceViewProps {
  timePerformance: TimeBasedPerformance[];
  stats: TradingStatistics;
  riskMetrics: RiskMetrics;
  darkMode: boolean;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  timePerformance,
  stats,
  riskMetrics,
  darkMode,
}) => {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 1. Time-Based Performance Accounting Table (Section 9) */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs"></span>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Time-Based Performance Breakdown (Accounting Rigor)
            </h3>
            <p className="text-[10px] text-slate-400">
              Every period isolates external cash flows from genuine trading alpha to prevent return distortion.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-inherit text-[10px] text-slate-400 uppercase bg-slate-900/40">
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3 text-right">Start Equity</th>
                <th className="py-2.5 px-3 text-right">End Equity</th>
                <th className="py-2.5 px-3 text-right">Net Flow</th>
                <th className="py-2.5 px-3 text-right">Gross P&L</th>
                <th className="py-2.5 px-3 text-right">Fees & Taxes</th>
                <th className="py-2.5 px-3 text-right">Net P&L</th>
                <th className="py-2.5 px-3 text-right">Return %</th>
                <th className="py-2.5 px-3 text-right">Win Rate</th>
                <th className="py-2.5 px-3 text-right">Trades</th>
                <th className="py-2.5 px-3 text-right">Profit Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {timePerformance.map((p) => {
                const isProfit = p.netTradingPnL >= 0;
                return (
                  <tr key={p.period} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-100">{p.period}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{formatPKR(p.startingEquity)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-200 font-semibold">{formatPKR(p.endingEquity)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{formatPKR(p.netFlows, { showSign: true })}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{formatPKR(p.grossTradingPnL, { showSign: true })}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{formatPKR(p.feesAndTaxes)}</td>
                    <td className={`py-2.5 px-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPKR(p.netTradingPnL, { showSign: true })}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(p.returnPercent)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-semibold">
                      {formatPercent(p.winRate, { showSign: false })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200">{p.tradesCount}</td>
                    <td className="py-2.5 px-3 text-right text-blue-400 font-semibold">
                      {p.profitFactor >= 99 ? '99+' : p.profitFactor.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Key Trading Statistics Cards (Sections 12, 13, 14, 15) */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-3.5 bg-emerald-500 rounded-xs"></span>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
            Quantitative Trading Statistics & Expectancy Engine
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Win Rate */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Win Rate</span>
            <span className="text-base font-bold text-emerald-400">{formatPercent(stats.winRate, { showSign: false })}</span>
            <div className="text-[10px] text-slate-400 mt-1">
              Wins: <strong className="text-slate-200">{stats.winningTrades}</strong> | Losses:{' '}
              <strong className="text-slate-200">{stats.losingTrades}</strong> | Total:{' '}
              <strong className="text-slate-200">{stats.totalClosedTrades}</strong>
            </div>
          </div>

          {/* Profit Factor */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Profit Factor</span>
            <span className="text-base font-bold text-blue-400">{stats.profitFactor.toFixed(2)}</span>
            <div className="text-[10px] text-slate-400 mt-1">
              Gross Profit / Gross Loss ({formatPKR(stats.grossProfit, { compact: true })} / {formatPKR(stats.grossLoss, { compact: true })})
            </div>
          </div>

          {/* Payoff Ratio */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Payoff Ratio</span>
            <span className="text-base font-bold text-slate-100">{stats.payoffRatio.toFixed(2)} : 1</span>
            <div className="text-[10px] text-slate-400 mt-1">
              Avg Win {formatPKR(stats.averageWin, { compact: true })} vs Avg Loss {formatPKR(stats.averageLoss, { compact: true })}
            </div>
          </div>

          {/* Expectancy */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Expectancy per Trade</span>
            <span className="text-base font-bold text-emerald-400">{formatPKR(stats.expectancy, { showSign: true })}</span>
            <div className="text-[10px] text-slate-400 mt-1">
              Average edge earned on each closed trade setup
            </div>
          </div>

          {/* Average R-Multiple */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Average R-Multiple</span>
            <span className="text-base font-bold text-blue-400">+{stats.averageR.toFixed(2)}R</span>
            <div className="text-[10px] text-slate-400 mt-1">
              Return in units of initial risked capital
            </div>
          </div>

          {/* Largest Winner */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Largest Winner</span>
            <span className="text-base font-bold text-emerald-400">
              {stats.largestWinner ? formatPKR(stats.largestWinner.amount, { showSign: true }) : '—'}
            </span>
            <div className="text-[10px] text-slate-400 mt-1">
              {stats.largestWinner ? `${stats.largestWinner.symbol} (${stats.largestWinner.date})` : '—'}
            </div>
          </div>

          {/* Largest Loser */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Largest Loser</span>
            <span className="text-base font-bold text-rose-400">
              {stats.largestLoser ? formatPKR(stats.largestLoser.amount, { showSign: true }) : '—'}
            </span>
            <div className="text-[10px] text-slate-400 mt-1">
              {stats.largestLoser ? `${stats.largestLoser.symbol} (${stats.largestLoser.date})` : '—'}
            </div>
          </div>

          {/* Streaks & Hold Time */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Streaks & Duration</span>
            <span className="text-base font-bold text-slate-100">
              {stats.maxConsecutiveWins}W / {stats.maxConsecutiveLosses}L
            </span>
            <div className="text-[10px] text-slate-400 mt-1">
              Avg Hold: <strong className="text-slate-200">{stats.averageHoldingPeriodDays.toFixed(1)} Days</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
