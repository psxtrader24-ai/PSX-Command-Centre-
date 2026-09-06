import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PlusCircle,
  ArrowDownCircle,
  Sun,
  Moon,
  Clock,
  Database,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { formatPKR, formatPercent, formatNumber } from '../utils/formatters';
import { PortfolioKPIs, DataBasisType, PSXIndex } from '../types';

interface TopNavigationBarProps {
  kpis: PortfolioKPIs;
  benchmarkIndex?: PSXIndex;
  marketStatus: {
    isOpen: boolean;
    status: 'OPEN' | 'CLOSED';
    sessionName: string;
    nextEvent: string;
    serverTimePKT: string;
  };
  dataBasis: DataBasisType;
  lastSync: string;
  isSyncing: boolean;
  onSync: () => void;
  onOpenNewTrade: () => void;
  onOpenCashModal: (type: 'DEPOSIT' | 'WITHDRAWAL') => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  activeView: string;
  onSelectView: (view: string) => void;
  onResetDemo: (mode: 'DEMO' | 'CLEAN') => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  kpis,
  benchmarkIndex,
  marketStatus,
  dataBasis,
  lastSync,
  isSyncing,
  onSync,
  onOpenNewTrade,
  onOpenCashModal,
  darkMode,
  onToggleTheme,
  activeView,
  onSelectView,
  onResetDemo,
}) => {
  const isPositiveDay = kpis.todayPnL >= 0;
  const isPositiveTotal = kpis.totalPnL >= 0;

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'positions', label: `Open Positions (${kpis.openPositionsCount})` },
    { id: 'tradebook', label: 'Trade Book' },
    { id: 'closed', label: `Closed (${kpis.closedTradesCount})` },
    { id: 'pnl', label: 'P&L Analytics' },
    { id: 'performance', label: 'Performance' },
    { id: 'risk', label: 'Risk' },
    { id: 'capital', label: 'Capital Flow' },
    { id: 'journal', label: 'Trade Journal' },
    { id: 'market', label: 'PSX Market Data' },
    { id: 'reports', label: 'Reports' },
    { id: 'audit', label: 'Audit Trail' },
  ];

  return (
    <header className="flex flex-col border-b border-[#1E2229] bg-[#11141A] text-gray-300 select-none">
      {/* Upper Terminal Bar */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-[#1E2229] gap-4">
        {/* Left: Terminal Identity & PSX Market Status */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-sm">
              <span className="font-mono">M</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm sm:text-base font-black tracking-wider text-white uppercase font-mono">
                  METRICLY
                </span>
                <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest font-mono hidden xs:inline-block">
                  PRO
                </span>
              </div>
              <span className="text-[9px] text-gray-400 font-mono tracking-tight hidden sm:block whitespace-nowrap">
                Simplify Math. Multiply Gains.
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-[#2D333D]"></div>

          {/* Market Status Pill & Ticker Info */}
          <div className="flex items-center space-x-3 text-[10px] font-medium uppercase tracking-wider font-mono">
            <span
              id="psx-market-status-badge"
              title={`PSX Session: ${marketStatus.sessionName} | ${marketStatus.nextEvent}`}
              className={`flex items-center space-x-1.5 px-2 py-0.5 rounded border ${
                marketStatus.isOpen
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${marketStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>KSE-100 {marketStatus.status}</span>
            </span>

            <span className="text-gray-300 hidden sm:inline font-mono">
              {benchmarkIndex ? formatNumber(benchmarkIndex.value, 2) : '81,452.80'}{' '}
              <span className={`font-semibold ${(benchmarkIndex?.change ?? 412.35) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {(benchmarkIndex?.change ?? 412.35) >= 0 ? '+' : ''}
                {(benchmarkIndex?.changePercent ?? 0.51).toFixed(2)}%
              </span>
            </span>

            <span className="text-gray-600 hidden md:inline">|</span>

            <span
              id="psx-data-freshness-badge"
              title={`Data Basis: ${dataBasis} (Last sync: ${new Date(lastSync).toLocaleTimeString()})`}
              className="text-gray-400 uppercase hidden md:inline font-mono text-[9px]"
            >
              <span className="text-gray-500">Basis:</span>{' '}
              <span className={`font-semibold ${dataBasis === 'LATEST_CLOSE' ? 'text-blue-400' : 'text-emerald-400'}`}>
                {dataBasis === 'LATEST_CLOSE' ? 'Official Close' : dataBasis}
              </span>
            </span>
          </div>
        </div>

        {/* Right: Portfolio Metrics & Quick Action Triggers */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden lg:flex items-center space-x-5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-gray-500 font-mono">Portfolio Equity</span>
              <span className="text-sm font-mono font-bold text-white uppercase tracking-tight">
                {formatPKR(kpis.portfolioValue)}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-gray-500 font-mono">Day P&L</span>
              <span
                className={`text-sm font-mono font-bold tracking-tight ${
                  isPositiveDay ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {formatPKR(kpis.todayPnL, { showSign: true })}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-gray-500 font-mono">Deployable Cash</span>
              <span className="text-sm font-mono font-bold text-blue-400 tracking-tight">
                {formatPKR(kpis.availableCash, { compact: true })}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sync Button */}
            <button
              id="sync-psx-market-data-btn"
              onClick={onSync}
              disabled={isSyncing}
              title="Sync latest prices from official PSX feed"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-mono rounded bg-[#1E2229] border border-[#2D333D] hover:border-blue-500/40 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* New Trade Button */}
            <button
              id="open-new-trade-modal-btn"
              onClick={onOpenNewTrade}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Trade</span>
            </button>

            {/* Cash Ledger Quick Action */}
            <button
              id="quick-deposit-btn"
              onClick={() => onOpenCashModal('DEPOSIT')}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-mono rounded bg-[#161B22] border border-[#2D333D] hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Add Cash Deposit or Withdrawal"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cash</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label="Toggle dark/light theme"
              className="p-1.5 rounded bg-[#1E2229] border border-[#2D333D] hover:border-slate-500 text-gray-300 transition-colors"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Demo Reset Options */}
            <div className="relative group">
              <button
                id="terminal-options-btn"
                title="Terminal settings & reset"
                className="p-1.5 text-xs font-mono rounded bg-[#1E2229] border border-[#2D333D] hover:border-slate-500 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-52 py-1 rounded bg-[#161B22] border border-[#1E2229] shadow-2xl z-50 text-xs">
                <div className="px-3 py-1 text-[10px] uppercase font-mono text-gray-500 border-b border-[#1E2229]">
                  Data Environment
                </div>
                <button
                  onClick={() => onResetDemo('DEMO')}
                  className="w-full text-left px-3 py-2 hover:bg-[#1E2229] text-gray-300 hover:text-white"
                >
                  Reload PSX Institutional Demo
                </button>
                <button
                  onClick={() => onResetDemo('CLEAN')}
                  className="w-full text-left px-3 py-2 hover:bg-[#1E2229] text-rose-400 hover:text-rose-300"
                >
                  Reset to Clean Slate (0 Trades)
                </button>
              </div>
            </div>

            {/* User Badge from design */}
            <div className="h-8 px-2.5 rounded bg-[#1E2229] border border-blue-500/30 hidden sm:flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">HK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="flex items-center space-x-1 border-b border-[#1E2229] bg-[#0E1116] px-4 py-1.5 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 whitespace-nowrap rounded font-mono text-xs transition-colors ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2229] border border-transparent'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
