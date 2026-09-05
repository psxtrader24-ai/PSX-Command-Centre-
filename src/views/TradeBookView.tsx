import React, { useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Download,
  Trash2,
} from 'lucide-react';
import { Trade } from '../types';
import { formatPKR, formatPercent, formatDate } from '../utils/formatters';

interface TradeBookViewProps {
  trades: Trade[];
  darkMode: boolean;
  onOpenNewTrade: () => void;
  onDeleteTrade: (id: string) => void;
  onOpenJournal: (symbol: string) => void;
}

export const TradeBookView: React.FC<TradeBookViewProps> = ({
  trades,
  darkMode,
  onOpenNewTrade,
  onDeleteTrade,
  onOpenJournal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'PARTIAL' | 'CLOSED'>('ALL');
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);

  const filteredTrades = trades.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = [
      'Trade ID',
      'Symbol',
      'Company',
      'Sector',
      'Type',
      'Entry Date',
      'Entry Price',
      'Quantity',
      'Position Size',
      'Fees',
      'Taxes',
      'Exit Date',
      'Exit Price',
      'Status',
      'Strategy',
      'Stop Loss',
      'Net P&L',
      'P&L %',
      'Tags',
    ];

    const rows = filteredTrades.map((t) => [
      t.id,
      t.symbol,
      `"${t.companyName}"`,
      `"${t.sector}"`,
      t.type,
      t.entryDate,
      t.entryPrice,
      t.quantity,
      t.positionSize,
      t.fees,
      t.taxes,
      t.exitDate || '',
      t.exitPrice || '',
      t.status,
      `"${t.strategy}"`,
      t.stopLoss || '',
      t.netPnL || '',
      t.pnlPercent ? `${t.pnlPercent.toFixed(2)}%` : '',
      `"${t.tags.join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PSX_Trade_Book_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                PSX Institutional Trade Book ({filteredTrades.length} Records)
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Comprehensive transaction ledger with multi-fills, position scaling, risk metrics, and entry/exit thesis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="tradebook-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symbol, ID, strategy..."
                className="pl-8 pr-3 py-1 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 text-xs w-52"
              />
            </div>

            {/* Status Filter */}
            <div className="flex rounded-xs border border-slate-700 overflow-hidden text-[11px]">
              {(['ALL', 'OPEN', 'PARTIAL', 'CLOSED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 font-semibold transition-colors ${
                    statusFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>

            {/* New Trade */}
            <button
              onClick={onOpenNewTrade}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Trade</span>
            </button>
          </div>
        </div>

        {/* Trade Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-inherit text-[10px] text-slate-400 uppercase bg-slate-900/40">
                <th className="py-2.5 px-2 w-8"></th>
                <th className="py-2.5 px-3">Trade ID / Symbol</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Entry Date</th>
                <th className="py-2.5 px-3 text-right">Entry Price</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Position Size</th>
                <th className="py-2.5 px-3 text-right">Stop / Target</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Strategy</th>
                <th className="py-2.5 px-3 text-right">P&L / Net</th>
                <th className="py-2.5 px-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No trades match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((t) => {
                  const isExpanded = expandedTradeId === t.id;
                  const isNetProfit = t.netPnL && t.netPnL > 0;
                  const isNetLoss = t.netPnL && t.netPnL < 0;

                  return (
                    <React.Fragment key={t.id}>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-2">
                          <button
                            onClick={() => setExpandedTradeId(isExpanded ? null : t.id)}
                            className="p-1 text-slate-400 hover:text-slate-200"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-100 flex items-center gap-1">
                            <span>{t.symbol}</span>
                            <span className="text-[10px] font-normal text-slate-400">({t.id})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{t.companyName}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold ${
                              t.type === 'BUY'
                                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                                : 'bg-rose-950/80 border border-rose-700 text-rose-300'
                            }`}
                          >
                            {t.type}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-slate-300">
                          <div>{formatDate(t.entryDate)}</div>
                          <div className="text-[10px] text-slate-400">{t.entryTime} PKT</div>
                        </td>

                        <td className="py-2.5 px-3 text-right font-semibold text-slate-200">
                          {formatPKR(t.entryPrice)}
                        </td>

                        <td className="py-2.5 px-3 text-right text-slate-200">
                          {t.quantity.toLocaleString()}
                        </td>

                        <td className="py-2.5 px-3 text-right font-semibold text-slate-100">
                          {formatPKR(t.positionSize)}
                        </td>

                        <td className="py-2.5 px-3 text-right text-[11px]">
                          <div className="text-amber-400">SL: {t.stopLoss ? formatPKR(t.stopLoss) : 'None'}</div>
                          <div className="text-blue-400">TP: {t.targetPrice ? formatPKR(t.targetPrice) : 'None'}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                              t.status === 'OPEN'
                                ? 'bg-blue-950/80 border border-blue-600 text-blue-300'
                                : t.status === 'PARTIAL'
                                ? 'bg-amber-950/80 border border-amber-600 text-amber-300'
                                : 'bg-slate-800 border border-slate-700 text-slate-300'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-slate-300">
                          <div className="font-semibold text-slate-200 truncate max-w-[130px]">{t.strategy}</div>
                          <div className="text-[10px] text-slate-400">{t.sector}</div>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          {t.netPnL !== undefined ? (
                            <div>
                              <span
                                className={`font-bold ${
                                  isNetProfit ? 'text-emerald-400' : isNetLoss ? 'text-rose-400' : 'text-slate-300'
                                }`}
                              >
                                {formatPKR(t.netPnL, { showSign: true })}
                              </span>
                              {t.pnlPercent !== undefined && (
                                <div
                                  className={`text-[10px] ${
                                    isNetProfit ? 'text-emerald-500' : isNetLoss ? 'text-rose-500' : 'text-slate-400'
                                  }`}
                                >
                                  ({formatPercent(t.pnlPercent)})
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">Floating Float</span>
                          )}
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => onDeleteTrade(t.id)}
                            title="Delete Trade Record"
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-900/60 border-b border-inherit">
                          <td colSpan={12} className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-2.5 rounded-xs border border-slate-800 bg-slate-950/60">
                                <span className="text-[10px] text-slate-400 uppercase block font-bold mb-1">
                                  Entry Thesis & Rationale
                                </span>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  {t.entryReason || 'No explicit entry reason documented.'}
                                </p>
                              </div>

                              <div className="p-2.5 rounded-xs border border-slate-800 bg-slate-950/60">
                                <span className="text-[10px] text-slate-400 uppercase block font-bold mb-1">
                                  Brokerage Fees & Charges Breakdown
                                </span>
                                <div className="space-y-1 text-[11px] text-slate-300">
                                  <div className="flex justify-between">
                                    <span>Broker Commission:</span>
                                    <span>{formatPKR(t.fees)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>SECP / CDC / CVT Taxes:</span>
                                    <span>{formatPKR(t.taxes)}</span>
                                  </div>
                                  <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                                    <span>Total Transaction Costs:</span>
                                    <span>{formatPKR(t.fees + t.taxes)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-xs border border-slate-800 bg-slate-950/60">
                                <span className="text-[10px] text-slate-400 uppercase block font-bold mb-1">
                                  Risk / Reward Specification
                                </span>
                                <div className="space-y-1 text-[11px] text-slate-300">
                                  <div className="flex justify-between">
                                    <span>Initial Risk (R):</span>
                                    <span className="text-amber-400 font-semibold">
                                      {t.initialRisk ? formatPKR(t.initialRisk) : 'Undefined'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Risk/Reward Ratio:</span>
                                    <span className="text-blue-400 font-semibold">
                                      {t.riskRewardRatio ? `1 : ${t.riskRewardRatio.toFixed(2)}` : '—'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Trade Notes:</span>
                                    <span className="truncate max-w-[150px]">{t.tradeNotes || '—'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Partial Exits History if any */}
                            {t.partialExits && t.partialExits.length > 0 && (
                              <div className="mt-2 p-2.5 rounded-xs border border-amber-800/40 bg-amber-950/20">
                                <span className="text-[10px] text-amber-300 uppercase block font-bold mb-1">
                                  Scale Out / Partial Realizations ({t.partialExits.length})
                                </span>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-[11px]">
                                    <thead>
                                      <tr className="text-slate-400 border-b border-amber-800/30">
                                        <th className="py-1">Scale ID</th>
                                        <th className="py-1">Exit Date</th>
                                        <th className="py-1 text-right">Exit Qty</th>
                                        <th className="py-1 text-right">Exit Price</th>
                                        <th className="py-1 text-right">Exit Fees</th>
                                        <th className="py-1 text-right">Net Realized P&L</th>
                                        <th className="py-1">Reason</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-amber-800/20">
                                      {t.partialExits.map((pe) => (
                                        <tr key={pe.id}>
                                          <td className="py-1 text-slate-300">{pe.id}</td>
                                          <td className="py-1 text-slate-300">{formatDate(pe.date)}</td>
                                          <td className="py-1 text-right font-semibold text-slate-200">
                                            {pe.quantity.toLocaleString()}
                                          </td>
                                          <td className="py-1 text-right text-slate-200">
                                            {formatPKR(pe.price)}
                                          </td>
                                          <td className="py-1 text-right text-slate-400">
                                            {formatPKR(pe.fees)}
                                          </td>
                                          <td className="py-1 text-right font-bold text-emerald-400">
                                            {formatPKR(pe.netPnL, { showSign: true })}
                                          </td>
                                          <td className="py-1 text-slate-400">{pe.exitReason}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Tags and Journal link */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-400">Tags:</span>
                                {t.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-xs bg-slate-800 text-slate-300 border border-slate-700 text-[10px]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              <button
                                onClick={() => onOpenJournal(t.symbol)}
                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Open Trade Journal Reflection</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
