import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TopNavigationBar } from './components/TopNavigationBar';
import { TopKPISection } from './components/TopKPISection';
import { OverviewDashboard } from './views/OverviewDashboard';
import { OpenPositionsView } from './views/OpenPositionsView';
import { TradeBookView } from './views/TradeBookView';
import { ClosedTradesView } from './views/ClosedTradesView';
import { PnLAnalyticsView } from './views/PnLAnalyticsView';
import { PerformanceView } from './views/PerformanceView';
import { RiskDashboardView } from './views/RiskDashboardView';
import { CapitalFlowView } from './views/CapitalFlowView';
import { TradeJournalView } from './views/TradeJournalView';
import { MarketDataView } from './views/MarketDataView';
import { ReportsView } from './views/ReportsView';
import { AuditLogView } from './views/AuditLogView';

import { NewTradeModal } from './components/NewTradeModal';
import { CashTransactionModal } from './components/CashTransactionModal';
import { PartialExitModal } from './components/PartialExitModal';

import {
  AUTHENTIC_PSX_SECURITIES,
  INITIAL_PSX_INDICES,
  getPSXMarketStatus,
} from './data/psxSecurities';
import {
  INITIAL_OPENING_CAPITAL,
  INITIAL_CASH_TRANSACTIONS,
  INITIAL_TRADES,
  INITIAL_TRADE_JOURNALS,
  INITIAL_AUDIT_LOG,
  INITIAL_EQUITY_CURVE,
  INITIAL_DAILY_PNL_CALENDAR,
} from './utils/sampleData';
import {
  calculatePortfolioKPIs,
  calculateCapitalFlow,
  calculateOpenPositions,
  calculateClosedTrades,
  calculateTimeBasedPerformance,
  calculateTradingStatistics,
  calculateRiskMetrics,
} from './utils/accountingEngine';
import {
  Trade,
  CashTransaction,
  TradeJournalEntry,
  AuditLogEntry,
  PSXQuote,
  PSXIndex,
  OpenPosition,
  DataBasisType,
  MarketStatusInfo,
} from './types';

export default function App() {
  // Theme state: dark terminal mode by default
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Active view navigation
  const [activeView, setActiveView] = useState<string>('overview');

  // Single Source of Truth Portfolio State
  const [openingCapital, setOpeningCapital] = useState<number>(INITIAL_OPENING_CAPITAL);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(INITIAL_CASH_TRANSACTIONS);
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES);
  const [journals, setJournals] = useState<TradeJournalEntry[]>(INITIAL_TRADE_JOURNALS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);
  const [quotes, setQuotes] = useState<PSXQuote[]>(AUTHENTIC_PSX_SECURITIES);
  const [indices, setIndices] = useState<PSXIndex[]>(INITIAL_PSX_INDICES);
  const [equityCurve, setEquityCurve] = useState(INITIAL_EQUITY_CURVE);
  const [dailyPnL, setDailyPnL] = useState(INITIAL_DAILY_PNL_CALENDAR);

  // PSX Market Feed metadata
  const [marketStatus, setMarketStatus] = useState<MarketStatusInfo>(getPSXMarketStatus());
  const [dataBasis, setDataBasis] = useState<DataBasisType>('LATEST_CLOSE');
  const [lastSync, setLastSync] = useState<string>(new Date().toISOString());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modal dialog states
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState<boolean>(false);
  const [cashModalConfig, setCashModalConfig] = useState<{
    isOpen: boolean;
    type: 'DEPOSIT' | 'WITHDRAWAL';
  }>({ isOpen: false, type: 'DEPOSIT' });
  const [partialExitPosition, setPartialExitPosition] = useState<OpenPosition | null>(null);

  // Real-time market status timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMarketStatus(getPSXMarketStatus());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial state from server backend
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          if (data.trades) setTrades(data.trades);
          if (data.cashTransactions) setCashTransactions(data.cashTransactions);
          if (data.openingCapital) setOpeningCapital(data.openingCapital);
          if (data.journals) setJournals(data.journals);
          if (data.auditLogs) setAuditLogs(data.auditLogs);
          if (data.quotes) setQuotes(data.quotes);
          if (data.indices) setIndices(data.indices);
          if (data.lastDataSync) setLastSync(data.lastDataSync);
          if (data.dataBasis) setDataBasis(data.dataBasis);
        }
      } catch (err) {
        // Fallback to local state if server is still starting
      }
    }
    loadPortfolio();
  }, []);

  // Recalculate derived institutional accounting state (Single Source of Truth)
  const openPositions = useMemo(
    () => calculateOpenPositions(trades, quotes),
    [trades, quotes]
  );

  const closedTrades = useMemo(
    () => calculateClosedTrades(trades),
    [trades]
  );

  const capitalFlow = useMemo(
    () => calculateCapitalFlow(openingCapital, cashTransactions, openPositions, closedTrades),
    [openingCapital, cashTransactions, openPositions, closedTrades]
  );

  const kpis = useMemo(
    () => calculatePortfolioKPIs(openingCapital, cashTransactions, openPositions, closedTrades, dailyPnL),
    [openingCapital, cashTransactions, openPositions, closedTrades, dailyPnL]
  );

  const stats = useMemo(
    () => calculateTradingStatistics(closedTrades),
    [closedTrades]
  );

  const riskMetrics = useMemo(
    () => calculateRiskMetrics(openPositions, capitalFlow.currentEquity, equityCurve),
    [openPositions, capitalFlow.currentEquity, equityCurve]
  );

  const timePerformance = useMemo(
    () => calculateTimeBasedPerformance(trades, cashTransactions, openingCapital, equityCurve),
    [trades, cashTransactions, openingCapital, equityCurve]
  );

  // Sync market data with PSX server feed
  const handleSyncPSX = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/psx/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLastSync(data.lastSync);
        setDataBasis(data.dataBasis);

        // Fetch refreshed quotes
        const qRes = await fetch('/api/psx/quotes');
        if (qRes.ok) {
          const qData = await qRes.json();
          setQuotes(qData.quotes);
          setIndices(qData.indices);
        }
      }
    } catch (err) {
      console.error('PSX sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Handle New Trade
  const handleCreateTrade = async (tradeData: any) => {
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData),
      });

      if (res.ok) {
        const created = await res.json();
        setTrades((prev) => [created, ...prev]);

        // Add to audit log
        const auditEntry: AuditLogEntry = {
          id: `AUD-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          user: 'psxtrader24@gmail.com',
          action: 'CREATE',
          entity: 'TRADE',
          entityId: created.id,
          summary: `${created.type} ${created.quantity} ${created.symbol} @ Rs ${created.entryPrice}`,
          newValue: created,
        };
        setAuditLogs((prev) => [auditEntry, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create trade:', err);
    }
  };

  // Handle Partial Exit
  const handleExecutePartialExit = async (data: {
    quantity: number;
    exitPrice: number;
    exitDate: string;
    exitReason: string;
    fees: number;
  }) => {
    if (!partialExitPosition) return;
    const targetTrade = trades.find(
      (t) => t.symbol === partialExitPosition.symbol && (t.status === 'OPEN' || t.status === 'PARTIAL')
    );
    if (!targetTrade) return;

    try {
      const res = await fetch(`/api/trades/${targetTrade.id}/partial-exit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

        const auditEntry: AuditLogEntry = {
          id: `AUD-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          user: 'psxtrader24@gmail.com',
          action: 'EXECUTE_PARTIAL_EXIT',
          entity: 'POSITION',
          entityId: targetTrade.id,
          summary: `Partial exit of ${data.quantity} ${targetTrade.symbol} @ Rs ${data.exitPrice}`,
          newValue: updated,
        };
        setAuditLogs((prev) => [auditEntry, ...prev]);
      }
    } catch (err) {
      console.error('Failed to execute partial exit:', err);
    }
  };

  // Handle Stop Loss edit
  const handleEditStopLoss = async (pos: OpenPosition, newStop: number) => {
    const trade = trades.find(
      (t) => t.symbol === pos.symbol && (t.status === 'OPEN' || t.status === 'PARTIAL')
    );
    if (!trade) return;

    try {
      const res = await fetch(`/api/trades/${trade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stopLoss: newStop }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

        const auditEntry: AuditLogEntry = {
          id: `AUD-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          user: 'psxtrader24@gmail.com',
          action: 'UPDATE',
          entity: 'TRADE',
          entityId: trade.id,
          summary: `Updated stop loss for ${trade.symbol} to Rs ${newStop}`,
          previousValue: { stopLoss: trade.stopLoss },
          newValue: { stopLoss: newStop },
        };
        setAuditLogs((prev) => [auditEntry, ...prev]);
      }
    } catch (err) {
      console.error('Failed to update stop loss:', err);
    }
  };

  // Handle Delete Trade
  const handleDeleteTrade = async (id: string) => {
    try {
      const res = await fetch(`/api/trades/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTrades((prev) => prev.filter((t) => t.id !== id));
        const auditEntry: AuditLogEntry = {
          id: `AUD-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          user: 'psxtrader24@gmail.com',
          action: 'DELETE',
          entity: 'TRADE',
          entityId: id,
          summary: `Deleted trade ${id}`,
        };
        setAuditLogs((prev) => [auditEntry, ...prev]);
      }
    } catch (err) {
      console.error('Failed to delete trade:', err);
    }
  };

  // Handle Cash Transaction (Deposit / Withdrawal)
  const handleCreateCashTransaction = async (cashData: any) => {
    try {
      const res = await fetch('/api/cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cashData),
      });

      if (res.ok) {
        const created = await res.json();
        setCashTransactions((prev) => [created, ...prev]);

        const auditEntry: AuditLogEntry = {
          id: `AUD-${Date.now().toString(36).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          user: 'psxtrader24@gmail.com',
          action: created.type,
          entity: 'CASH',
          entityId: created.id,
          summary: `${created.type} of Rs ${created.amount.toLocaleString()} via ${created.method}`,
          newValue: created,
        };
        setAuditLogs((prev) => [auditEntry, ...prev]);
      }
    } catch (err) {
      console.error('Failed to record cash transaction:', err);
    }
  };

  // Handle Save Journal
  const handleSaveJournal = async (journalData: any) => {
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journalData),
      });

      if (res.ok) {
        const saved = await res.json();
        setJournals((prev) => {
          const idx = prev.findIndex((j) => j.id === saved.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return [saved, ...prev];
        });
      }
    } catch (err) {
      console.error('Failed to save journal:', err);
    }
  };

  // Reset demo or clean slate
  const handleResetPortfolio = async (mode: 'DEMO' | 'CLEAN') => {
    try {
      const res = await fetch('/api/portfolio/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });

      if (res.ok) {
        if (mode === 'CLEAN') {
          setOpeningCapital(1000000);
          setCashTransactions([]);
          setTrades([]);
          setJournals([]);
          setAuditLogs([]);
        } else {
          setOpeningCapital(INITIAL_OPENING_CAPITAL);
          setCashTransactions([...INITIAL_CASH_TRANSACTIONS]);
          setTrades([...INITIAL_TRADES]);
          setJournals([...INITIAL_TRADE_JOURNALS]);
          setAuditLogs([...INITIAL_AUDIT_LOG]);
        }
      }
    } catch (err) {
      console.error('Failed to reset portfolio:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-gray-300 font-mono flex flex-col selection:bg-blue-500/30">
      {/* Top Navigation & Status Bar */}
      <TopNavigationBar
        kpis={kpis}
        marketStatus={marketStatus}
        dataBasis={dataBasis}
        lastSync={lastSync}
        isSyncing={isSyncing}
        onSync={handleSyncPSX}
        onOpenNewTrade={() => setIsNewTradeModalOpen(true)}
        onOpenCashModal={(type) => setCashModalConfig({ isOpen: true, type })}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        activeView={activeView}
        onSelectView={setActiveView}
        onResetDemo={handleResetPortfolio}
      />

      {/* Top 16 KPI Metric Cards Bar */}
      <TopKPISection kpis={kpis} darkMode={darkMode} />

      {/* Main View Display Container */}
      <main className="flex-1 p-4 max-w-[1700px] w-full mx-auto pb-10">
        {activeView === 'overview' && (
          <OverviewDashboard
            kpis={kpis}
            capitalFlow={capitalFlow}
            openPositions={openPositions}
            equityCurve={equityCurve}
            riskMetrics={riskMetrics}
            darkMode={darkMode}
            onNavigate={setActiveView}
            onOpenTradeModal={() => setIsNewTradeModalOpen(true)}
            onOpenCashModal={(type) => setCashModalConfig({ isOpen: true, type })}
          />
        )}

        {activeView === 'positions' && (
          <OpenPositionsView
            openPositions={openPositions}
            portfolioValue={capitalFlow.currentEquity}
            darkMode={darkMode}
            onPartialExit={(pos) => setPartialExitPosition(pos)}
            onEditStopLoss={handleEditStopLoss}
            onOpenTradeJournal={(symbol) => {
              setActiveView('journal');
            }}
          />
        )}

        {activeView === 'tradebook' && (
          <TradeBookView
            trades={trades}
            darkMode={darkMode}
            onOpenNewTrade={() => setIsNewTradeModalOpen(true)}
            onDeleteTrade={handleDeleteTrade}
            onOpenJournal={(symbol) => {
              setActiveView('journal');
            }}
          />
        )}

        {activeView === 'closed' && (
          <ClosedTradesView
            closedTrades={closedTrades}
            stats={stats}
            darkMode={darkMode}
          />
        )}

        {activeView === 'pnl' && (
          <PnLAnalyticsView dailyPnL={dailyPnL} darkMode={darkMode} />
        )}

        {activeView === 'performance' && (
          <PerformanceView
            timePerformance={timePerformance}
            stats={stats}
            riskMetrics={riskMetrics}
            darkMode={darkMode}
          />
        )}

        {activeView === 'risk' && (
          <RiskDashboardView
            riskMetrics={riskMetrics}
            kpis={kpis}
            darkMode={darkMode}
          />
        )}

        {activeView === 'capital' && (
          <CapitalFlowView
            capitalFlow={capitalFlow}
            cashTransactions={cashTransactions}
            kpis={kpis}
            darkMode={darkMode}
            onOpenCashModal={(type) => setCashModalConfig({ isOpen: true, type })}
          />
        )}

        {activeView === 'journal' && (
          <TradeJournalView
            journals={journals}
            trades={trades}
            darkMode={darkMode}
            onSaveJournal={handleSaveJournal}
          />
        )}

        {activeView === 'market' && (
          <MarketDataView
            quotes={quotes}
            indices={indices}
            marketStatus={marketStatus}
            dataBasis={dataBasis}
            lastSync={lastSync}
            isSyncing={isSyncing}
            onSync={handleSyncPSX}
            darkMode={darkMode}
          />
        )}

        {activeView === 'reports' && (
          <ReportsView
            kpis={kpis}
            capitalFlow={capitalFlow}
            stats={stats}
            riskMetrics={riskMetrics}
            trades={trades}
            darkMode={darkMode}
          />
        )}

        {activeView === 'audit' && (
          <AuditLogView auditLogs={auditLogs} darkMode={darkMode} />
        )}
      </main>

      {/* Terminal Status Footer from Professional Polish Design */}
      <footer className="h-6 bg-[#0E1116] border-t border-[#1E2229] flex items-center justify-between px-4 text-[10px] text-gray-500 font-medium font-mono shrink-0 select-none">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="uppercase tracking-tight text-gray-400">Market Feed: Latency 14ms</span>
          </div>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="uppercase tracking-tight text-gray-500 hidden sm:inline">Engine: Unified Accounting Model</span>
        </div>
        <div className="flex items-center space-x-4 uppercase tracking-tight text-gray-500">
          <span className="hidden md:inline">Broker: AKD Securities Ltd.</span>
          <span className="text-gray-700 hidden md:inline">|</span>
          <span className="text-gray-400">User: HK-50912-ADM</span>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <NewTradeModal
        isOpen={isNewTradeModalOpen}
        onClose={() => setIsNewTradeModalOpen(false)}
        onSubmit={handleCreateTrade}
        darkMode={darkMode}
      />

      <CashTransactionModal
        isOpen={cashModalConfig.isOpen}
        type={cashModalConfig.type}
        onClose={() => setCashModalConfig({ isOpen: false, type: 'DEPOSIT' })}
        onSubmit={handleCreateCashTransaction}
        darkMode={darkMode}
      />

      <PartialExitModal
        isOpen={!!partialExitPosition}
        position={partialExitPosition}
        onClose={() => setPartialExitPosition(null)}
        onSubmit={handleExecutePartialExit}
        darkMode={darkMode}
      />
    </div>
  );
}
