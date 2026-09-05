import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DailyPnLRecord } from '../types';
import { formatPKR, formatPercent, formatDate } from '../utils/formatters';

interface PnLAnalyticsViewProps {
  dailyPnL: DailyPnLRecord[];
  darkMode: boolean;
}

export const PnLAnalyticsView: React.FC<PnLAnalyticsViewProps> = ({ dailyPnL, darkMode }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2025-02');
  const [selectedDay, setSelectedDay] = useState<DailyPnLRecord | null>(null);

  // Filter daily records for selected month
  const monthRecords = dailyPnL.filter((d) => d.date.startsWith(selectedMonth));

  // Compute month metrics
  const greenDays = monthRecords.filter((d) => d.pnl > 0);
  const redDays = monthRecords.filter((d) => d.pnl < 0);
  const totalMonthPnL = monthRecords.reduce((acc, d) => acc + d.pnl, 0);
  const winRateDays = monthRecords.length > 0 ? (greenDays.length / monthRecords.length) * 100 : 0;

  let largestUpDay: DailyPnLRecord | null = null;
  let largestDownDay: DailyPnLRecord | null = null;
  for (const d of monthRecords) {
    if (!largestUpDay || d.pnl > largestUpDay.pnl) largestUpDay = d;
    if (!largestDownDay || d.pnl < largestDownDay.pnl) largestDownDay = d;
  }


  // Build calendar matrix (Mon - Fri)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Month Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Monthly Net P&L</span>
          <span
            className={`text-sm sm:text-base font-bold ${
              totalMonthPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatPKR(totalMonthPnL, { showSign: true })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{selectedMonth} Trading</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Green / Red Days</span>
          <span className="text-sm sm:text-base font-bold text-slate-100">
            <span className="text-emerald-400">{greenDays.length}G</span> / <span className="text-rose-400">{redDays.length}R</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Day Win Rate: {winRateDays.toFixed(0)}%
          </span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Largest Up Day</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400">
            {largestUpDay ? formatPKR(largestUpDay.pnl, { showSign: true }) : '—'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {largestUpDay ? formatDate(largestUpDay.date) : '—'}
          </span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Largest Down Day</span>
          <span className="text-sm sm:text-base font-bold text-rose-400">
            {largestDownDay ? formatPKR(largestDownDay.pnl, { showSign: true }) : '—'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {largestDownDay ? formatDate(largestDownDay.date) : '—'}
          </span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Total Month Trades</span>
          <span className="text-sm sm:text-base font-bold text-blue-400">
            {monthRecords.reduce((acc, d) => acc + d.tradeCount, 0)} Executions
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Active market volume</span>
        </div>
      </div>

      {/* Main Heatmap Calendar */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-emerald-500 rounded-xs"></span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              PSX Trading Heatmap Calendar (Monday – Friday)
            </h3>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMonth('2025-01')}
              className={`px-2.5 py-1 rounded-xs border text-[11px] ${
                selectedMonth === '2025-01'
                  ? 'bg-blue-600 border-blue-500 text-white font-bold'
                  : 'border-slate-700 bg-slate-900 text-slate-400'
              }`}
            >
              Jan 2025
            </button>
            <button
              onClick={() => setSelectedMonth('2025-02')}
              className={`px-2.5 py-1 rounded-xs border text-[11px] ${
                selectedMonth === '2025-02'
                  ? 'bg-blue-600 border-blue-500 text-white font-bold'
                  : 'border-slate-700 bg-slate-900 text-slate-400'
              }`}
            >
              Feb 2025
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold text-slate-400 pb-2 border-b border-inherit">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {monthRecords.map((day) => {
            const isGreen = day.pnl > 0;
            const isRed = day.pnl < 0;
            const isSelected = selectedDay?.date === day.date;

            return (
              <div
                key={day.date}
                onClick={() => setSelectedDay(day)}
                className={`p-3 rounded-xs border cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-blue-400' : ''
                } ${
                  isGreen
                    ? 'bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-900/50'
                    : isRed
                    ? 'bg-rose-950/40 border-rose-800/60 hover:bg-rose-900/50'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold">{day.date.split('-')[2]}</span>
                  <span>{day.tradeCount > 0 ? `${day.tradeCount} trd` : 'flat'}</span>
                </div>

                <div
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isGreen ? 'text-emerald-400' : isRed ? 'text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {formatPKR(day.pnl, { showSign: true })}
                </div>

                <div
                  className={`text-[10px] font-semibold mt-0.5 ${
                    isGreen ? 'text-emerald-500' : isRed ? 'text-rose-500' : 'text-slate-400'
                  }`}
                >
                  {formatPercent(day.returnPercent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail Box */}
      {selectedDay && (
        <div className={`p-4 rounded-xs border ${darkMode ? 'bg-slate-900/80 border-blue-500/50' : 'bg-blue-50 border-blue-300'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-blue-400 font-bold block">
                Session Audit: {formatDate(selectedDay.date)} ({selectedDay.dayOfWeek})
              </span>
              <span className="text-slate-200 font-bold text-sm">
                Net Day P&L: {formatPKR(selectedDay.pnl, { showSign: true })} ({formatPercent(selectedDay.returnPercent)})
              </span>
            </div>
            <div className="text-right text-slate-400 text-[11px]">
              <div>Trades Executed: <strong className="text-slate-200">{selectedDay.tradeCount}</strong></div>
              <div>Status: <strong className={selectedDay.status === 'WIN' ? 'text-emerald-400' : 'text-rose-400'}>{selectedDay.status}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Daily P&L Bar Chart */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
            Daily P&L Distribution (PKR)
          </h4>
          <span className="text-[10px] text-slate-400">Green = Profit, Red = Loss</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyPnL} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={darkMode ? '#1E293B' : '#E2E8F0'} vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
              <YAxis stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatPKR(Number(val)), 'Net P&L']}
                labelFormatter={(l) => `Date: ${formatDate(String(l))}`}
                contentStyle={{
                  backgroundColor: darkMode ? '#0F172A' : '#FFFFFF',
                  borderColor: '#334155',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="pnl">
                {dailyPnL.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.pnl >= 0 ? '#10B981' : '#F43F5E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
