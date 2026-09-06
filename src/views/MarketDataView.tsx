import React, { useState } from 'react';
import {
  RefreshCw,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PSXQuote, PSXIndex, MarketStatusInfo, DataBasisType } from '../types';
import { formatPKR, formatPercent, formatNumber } from '../utils/formatters';

interface MarketDataViewProps {
  quotes: PSXQuote[];
  indices: PSXIndex[];
  marketStatus: MarketStatusInfo;
  dataBasis: DataBasisType;
  lastSync: string;
  isSyncing: boolean;
  onSync: () => void;
  darkMode: boolean;
}

export const MarketDataView: React.FC<MarketDataViewProps> = ({
  quotes,
  indices,
  marketStatus,
  dataBasis,
  lastSync,
  isSyncing,
  onSync,
  darkMode,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const sectors = Array.from(new Set(quotes.map((q) => q.sector))).filter(Boolean);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSector = selectedSector === 'ALL' || q.sector === selectedSector;
    const matchesSearch =
      q.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* PSX Market Status & Architecture Banner */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs"></span>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Pakistan Stock Exchange (PSX) Market Data Feed
              </h3>
              <p className="text-[10px] text-slate-400">
                Official market timing: Mon–Thu 09:15–15:30 PKT | Friday Session 1: 09:15–12:00, Session 2: 14:30–16:30 PKT.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-xs bg-slate-900 border border-slate-700 text-[11px] text-slate-300">
              Basis: <strong className="text-blue-400 uppercase">{dataBasis}</strong> (Synced {new Date(lastSync).toLocaleTimeString()})
            </div>
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xs font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync PSX Quotes</span>
            </button>
          </div>
        </div>

        {/* Indices Ticker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {indices.map((idx) => {
            const isUp = idx.change >= 0;
            return (
              <div
                key={idx.symbol}
                className="p-3 rounded-xs border border-slate-800 bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-slate-200">{idx.name}</span>
                  <span className={`text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? '+' : ''}
                    {formatPercent(idx.changePercent)}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-100">
                  {formatNumber(idx.currentValue ?? idx.value, 2)}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Net: {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)} pts</span>
                  <span>Vol: {(idx.volume / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Securities Quote Board */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-xs"></span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Tracked PSX Securities ({filteredQuotes.length})
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search PSX stock..."
                className="pl-8 pr-3 py-1 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 text-xs w-44"
              />
            </div>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-2.5 py-1 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 text-[11px]"
            >
              <option value="ALL">All Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-inherit text-[10px] text-slate-400 uppercase bg-slate-900/40">
                <th className="py-2 px-3">Symbol</th>
                <th className="py-2 px-3">Company</th>
                <th className="py-2 px-3">Sector</th>
                <th className="py-2 px-3 text-right">Last Price</th>
                <th className="py-2 px-3 text-right">Change</th>
                <th className="py-2 px-3 text-right">% Change</th>
                <th className="py-2 px-3 text-right">Day Range (L - H)</th>
                <th className="py-2 px-3 text-right">Prev Close</th>
                <th className="py-2 px-3 text-right">Volume</th>
                <th className="py-2 px-3 text-right">PE Ratio</th>
                <th className="py-2 px-3 text-right">Div Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredQuotes.map((q) => {
                const isPositive = q.change >= 0;
                return (
                  <tr key={q.symbol} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-100">{q.symbol}</td>
                    <td className="py-2 px-3 text-slate-300 truncate max-w-[140px]">{q.name}</td>
                    <td className="py-2 px-3 text-slate-400 text-[10px]">{q.sector}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-100">
                      {formatPKR(q.currentPrice)}
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-semibold ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {q.change.toFixed(2)}
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatPercent(q.changePercent)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-300 text-[11px]">
                      {q.low.toFixed(2)} — {q.high.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">{formatPKR(q.previousClose)}</td>
                    <td className="py-2 px-3 text-right text-slate-300">
                      {q.volume.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {q.pe ? q.pe.toFixed(1) : '—'}
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-400">
                      {q.dividendYield ? `${q.dividendYield.toFixed(1)}%` : '—'}
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
