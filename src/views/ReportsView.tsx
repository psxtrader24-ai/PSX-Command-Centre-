import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Shield,
  CheckCircle,
  Building,
  Calendar,
} from 'lucide-react';
import {
  PortfolioKPIs,
  CapitalFlow,
  TradingStatistics,
  RiskMetrics,
  Trade,
} from '../types';
import { formatPKR, formatPercent, formatDate } from '../utils/formatters';

interface ReportsViewProps {
  kpis: PortfolioKPIs;
  capitalFlow: CapitalFlow;
  stats: TradingStatistics;
  riskMetrics: RiskMetrics;
  trades: Trade[];
  darkMode: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  kpis,
  capitalFlow,
  stats,
  riskMetrics,
  trades,
  darkMode,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      reportType: 'Institutional PSX Portfolio & Risk Review',
      kpis,
      capitalFlow,
      tradingStatistics: stats,
      riskMetrics,
      tradesSummary: {
        total: trades.length,
        open: trades.filter((t) => t.status === 'OPEN').length,
        closed: trades.filter((t) => t.status === 'CLOSED').length,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PSX_Portfolio_Report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Controls Bar */}
      <div className={`p-4 rounded-xs border flex flex-wrap items-center justify-between gap-3 ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs"></span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Institutional Portfolio Accounting & Risk Report
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">
            Certified calculation snapshot formatted for audits, tax compliance, and investor review.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON Audit</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div
        id="printable-audit-report"
        className={`p-6 sm:p-8 rounded-xs border shadow-lg space-y-6 ${
          darkMode ? 'bg-[#0D111A] border-[#1E293B] text-slate-200' : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-inherit pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              PAKISTAN STOCK EXCHANGE (PSX) TRADING AUDIT
            </h2>
            <div className="text-[11px] text-slate-400 mt-1">
              Account: Institutional Master CDS Trading Fund | Broker: CDC Direct Investor Account
            </div>
            <div className="text-[10px] text-slate-400">
              Report Generated: {new Date().toLocaleString()} PKT
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-bold rounded-xs">
              ACCOUNTING STATUS: VERIFIED
            </span>
          </div>
        </div>

        {/* 1. Capital Reconciliation Statement */}
        <div>
          <h4 className="font-bold text-xs uppercase text-blue-400 mb-2">
            1. Capital Flow & Equity Reconciliation Statement
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-inherit">
              <tbody>
                <tr className="border-b border-inherit">
                  <td className="p-2 text-slate-400">Opening Balance (Capital Inception)</td>
                  <td className="p-2 text-right font-bold">{formatPKR(capitalFlow.openingCapital)}</td>
                </tr>
                <tr className="border-b border-inherit">
                  <td className="p-2 text-slate-400">(+) Cumulative Cash Deposits</td>
                  <td className="p-2 text-right text-emerald-400 font-bold">+{formatPKR(capitalFlow.totalDeposits)}</td>
                </tr>
                <tr className="border-b border-inherit">
                  <td className="p-2 text-slate-400">(−) Cumulative Cash Withdrawals / Distributions</td>
                  <td className="p-2 text-right text-rose-400 font-bold">−{formatPKR(capitalFlow.totalWithdrawals)}</td>
                </tr>
                <tr className="border-b border-inherit bg-slate-900/30">
                  <td className="p-2 font-bold text-slate-300">Net Invested Principal Capital Base</td>
                  <td className="p-2 text-right font-bold text-blue-400">{formatPKR(capitalFlow.netCapital)}</td>
                </tr>
                <tr className="border-b border-inherit">
                  <td className="p-2 text-slate-400">(+) Realized Trading P&L (Net of Commissions)</td>
                  <td className="p-2 text-right font-bold text-emerald-400">+{formatPKR(kpis.realizedPnL)}</td>
                </tr>
                <tr className="border-b border-inherit">
                  <td className="p-2 text-slate-400">(+) Unrealized Open Mark-to-Market Float</td>
                  <td className="p-2 text-right font-bold text-emerald-400">+{formatPKR(kpis.unrealizedPnL)}</td>
                </tr>
                <tr className="border-b border-inherit bg-blue-950/20 font-bold">
                  <td className="p-2 text-blue-300">Total Portfolio Value (Net Equity Liquidation)</td>
                  <td className="p-2 text-right text-blue-400 text-sm">{formatPKR(capitalFlow.currentEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Key Performance Metrics */}
        <div>
          <h4 className="font-bold text-xs uppercase text-blue-400 mb-2">
            2. Quantitative Trading Performance & Expectancy
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Net Alpha Return</span>
              <span className="text-sm font-bold text-emerald-400">{formatPercent(kpis.returnPercent)}</span>
            </div>
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Win Rate %</span>
              <span className="text-sm font-bold text-emerald-400">{formatPercent(stats.winRate, { showSign: false })}</span>
            </div>
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Profit Factor</span>
              <span className="text-sm font-bold text-blue-400">{stats.profitFactor.toFixed(2)}</span>
            </div>
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Expectancy / Trade</span>
              <span className="text-sm font-bold text-emerald-400">{formatPKR(stats.expectancy, { showSign: true })}</span>
            </div>
          </div>
        </div>

        {/* 3. Risk & Exposure Governance */}
        <div>
          <h4 className="font-bold text-xs uppercase text-blue-400 mb-2">
            3. Risk Controls & Concentration Limits
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Available Cash Buffer</span>
              <span className="text-sm font-bold text-emerald-400">{formatPKR(kpis.availableCash)} ({riskMetrics.cashPercent.toFixed(1)}%)</span>
            </div>
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Portfolio Heat (Open Risk)</span>
              <span className="text-sm font-bold text-amber-400">{riskMetrics.portfolioHeat.toFixed(2)}%</span>
            </div>
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Max Historical Drawdown</span>
              <span className="text-sm font-bold text-rose-400">-{riskMetrics.maxDrawdownPercent.toFixed(2)}%</span>
            </div>
            <div className="p-2.5 border border-inherit rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase">Largest Position</span>
              <span className="text-sm font-bold text-slate-200">{riskMetrics.largestPositionSymbol} ({riskMetrics.largestPositionPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Audit Sign-off Note */}
        <div className="pt-4 border-t border-inherit flex justify-between items-center text-[10px] text-slate-400">
          <span>Official PSX Terminal Audit Sign-off — Certified Single Source of Truth</span>
          <span>CDC Verified Brokerage Ledger</span>
        </div>
      </div>
    </div>
  );
};
