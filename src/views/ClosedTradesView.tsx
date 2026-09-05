import React, { useState } from 'react';
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
} from 'lucide-react';
import { ClosedTradeRecord, TradingStatistics } from '../types';
import { formatPKR, formatPercent, formatDate } from '../utils/formatters';

interface ClosedTradesViewProps {
  closedTrades: ClosedTradeRecord[];
  stats: TradingStatistics;
  darkMode: boolean;
}

export const ClosedTradesView: React.FC<ClosedTradesViewProps> = ({
  closedTrades,
  stats,
  darkMode,
}) => {
  const [filterResult, setFilterResult] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [strategyFilter, setStrategyFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract unique strategies
  const strategies = Array.from(new Set(closedTrades.map((t) => t.strategy))).filter(Boolean);

  const filtered = closedTrades.filter((t) => {
    const matchesResult =
      filterResult === 'ALL' ||
      (filterResult === 'WIN' && t.isWin) ||
      (filterResult === 'LOSS' && !t.isWin);
    const matchesStrategy = strategyFilter === 'ALL' || t.strategy === strategyFilter;
    const matchesSearch =
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tradeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesResult && matchesStrategy && matchesSearch;
  });

  const totalCommissions = closedTrades.reduce((acc, t) => acc + t.feesAndTaxes, 0);
  const totalNetRealized = closedTrades.reduce((acc, t) => acc + t.netPnL, 0);

  const handleExportCSV = () => {
    const headers = [
      'Trade ID',
      'Symbol',
      'Company',
      'Entry Date',
      'Exit Date',
      'Quantity',
      'Entry Price',
      'Exit Price',
      'Gross P&L',
      'Fees & Taxes',
      'Net P&L',
      'Return %',
      'Holding Days',
      'Result',
      'Strategy',
      'Exit Reason',
      'R-Multiple',
    ];

    const rows = filtered.map((t) => [
      t.tradeId,
      t.symbol,
      `"${t.companyName}"`,
      t.entryDate,
      t.exitDate,
      t.quantity,
      t.entryPrice,
      t.exitPrice,
      t.grossPnL,
      t.feesAndTaxes,
      t.netPnL,
      `${t.returnPercent.toFixed(2)}%`,
      t.holdingPeriodDays,
      t.isWin ? 'WIN' : 'LOSS',
      `"${t.strategy}"`,
      `"${t.exitReason}"`,
      t.rMultiple !== undefined ? t.rMultiple.toFixed(2) : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PSX_Closed_Trades_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Realized Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Total Realized P&L</span>
          <span
            className={`text-sm sm:text-base font-bold ${
              totalNetRealized >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatPKR(totalNetRealized, { showSign: true })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Net of all broker fees</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Win Rate</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400">
            {formatPercent(stats.winRate, { showSign: false })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {stats.winningTrades}W / {stats.losingTrades}L
          </span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Gross Profit</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400">
            {formatPKR(stats.grossProfit)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Wins pool</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Gross Loss</span>
          <span className="text-sm sm:text-base font-bold text-rose-400">
            {formatPKR(stats.grossLoss)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Losses pool</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Profit Factor</span>
          <span className="text-sm sm:text-base font-bold text-blue-400">
            {stats.profitFactor.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Payoff: {stats.payoffRatio.toFixed(2)}</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Avg Hold Period</span>
          <span className="text-sm sm:text-base font-bold text-slate-200">
            {stats.averageHoldingPeriodDays.toFixed(1)} Days
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Trade duration</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Total Fees Paid</span>
          <span className="text-sm sm:text-base font-bold text-slate-300">
            {formatPKR(totalCommissions)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">CDC / SECP / Broker</span>
        </div>
      </div>

      {/* Table & Controls */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-xs"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Closed Trades & Realized P&L Ledger ({filtered.length} Records)
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Trade-level accounting after actual execution, full broker commission deductions, and holding period metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symbol, ID..."
                className="pl-8 pr-3 py-1 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 text-xs w-44"
              />
            </div>

            {/* Win/Loss filter */}
            <div className="flex rounded-xs border border-slate-700 overflow-hidden text-[11px]">
              {(['ALL', 'WIN', 'LOSS'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterResult(r)}
                  className={`px-2.5 py-1 font-semibold transition-colors ${
                    filterResult === r ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Strategy Filter */}
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 text-[11px]"
            >
              <option value="ALL">All Strategies</option>
              {strategies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-inherit text-[10px] text-slate-400 uppercase bg-slate-900/40">
                <th className="py-2.5 px-3">Symbol / ID</th>
                <th className="py-2.5 px-3">Dates (In / Out)</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Entry Price</th>
                <th className="py-2.5 px-3 text-right">Exit Price</th>
                <th className="py-2.5 px-3 text-right">Gross P&L</th>
                <th className="py-2.5 px-3 text-right">Fees & Taxes</th>
                <th className="py-2.5 px-3 text-right">Net P&L</th>
                <th className="py-2.5 px-3 text-right">Return %</th>
                <th className="py-2.5 px-3 text-right">Hold Days</th>
                <th className="py-2.5 px-3 text-right">R-Mult</th>
                <th className="py-2.5 px-3">Strategy / Exit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No closed trades found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isProfit = t.netPnL >= 0;
                  return (
                    <tr key={`${t.tradeId}-${t.exitDate}`} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-100">{t.symbol}</div>
                        <div className="text-[10px] text-slate-400">{t.tradeId}</div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-300">
                        <div>{formatDate(t.entryDate)}</div>
                        <div className="text-[10px] text-slate-400">→ {formatDate(t.exitDate)}</div>
                      </td>

                      <td className="py-2.5 px-3 text-right text-slate-200 font-semibold">
                        {t.quantity.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {formatPKR(t.entryPrice)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-semibold text-slate-100">
                        {formatPKR(t.exitPrice)}
                      </td>

                      <td
                        className={`py-2.5 px-3 text-right font-semibold ${
                          t.grossPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatPKR(t.grossPnL, { showSign: true })}
                      </td>

                      <td className="py-2.5 px-3 text-right text-slate-400">
                        {formatPKR(t.feesAndTaxes)}
                      </td>

                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          isProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatPKR(t.netPnL, { showSign: true })}
                      </td>

                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          isProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {formatPercent(t.returnPercent)}
                      </td>

                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {t.holdingPeriodDays}d
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        {t.rMultiple !== undefined ? (
                          <span
                            className={`font-semibold ${
                              t.rMultiple >= 1
                                ? 'text-emerald-400'
                                : t.rMultiple > 0
                                ? 'text-blue-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {t.rMultiple >= 0 ? `+${t.rMultiple.toFixed(2)}R` : `${t.rMultiple.toFixed(2)}R`}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-200">{t.strategy}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {t.exitReason}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
