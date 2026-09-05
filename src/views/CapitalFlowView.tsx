import React, { useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  Calculator,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';
import { CapitalFlow, CashTransaction, PortfolioKPIs } from '../types';
import { formatPKR, formatPercent, formatDate } from '../utils/formatters';

interface CapitalFlowViewProps {
  capitalFlow: CapitalFlow;
  cashTransactions: CashTransaction[];
  kpis: PortfolioKPIs;
  darkMode: boolean;
  onOpenCashModal: (type: 'DEPOSIT' | 'WITHDRAWAL') => void;
}

export const CapitalFlowView: React.FC<CapitalFlowViewProps> = ({
  capitalFlow,
  cashTransactions,
  kpis,
  darkMode,
  onOpenCashModal,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAWAL'>('ALL');

  const filteredTxns = cashTransactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Strict Accounting Rule Verification Banner */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-3.5 bg-emerald-500 rounded-xs"></span>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
            Capital-Flow Accounting & Non-Conflation Engine
          </h3>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
          A fundamental requirement of institutional portfolio management is preventing external capital deposits or withdrawals from distorting genuine trading performance. Deposits increase liquidity but are strictly excluded from trading P&L.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Total Capital Injected</span>
            <span className="text-base font-bold text-emerald-400">
              {formatPKR(capitalFlow.totalDeposits)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cumulative deposits</span>
          </div>

          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Total Capital Withdrawn</span>
            <span className="text-base font-bold text-rose-400">
              {formatPKR(capitalFlow.totalWithdrawals)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cumulative distributions</span>
          </div>

          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Net Capital Base</span>
            <span className="text-base font-bold text-blue-400">
              {formatPKR(capitalFlow.netCapital)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Deposits − Withdrawals</span>
          </div>

          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/60">
            <span className="text-[10px] text-slate-400 uppercase block">Pure Trading Alpha P&L</span>
            <span
              className={`text-base font-bold ${
                capitalFlow.totalTradingPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatPKR(capitalFlow.totalTradingPnL, { showSign: true })}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Net Return: {formatPercent(kpis.returnPercent)}
            </span>
          </div>
        </div>
      </div>

      {/* Cash Ledger Table */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs"></span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Brokerage Cash Ledger ({filteredTxns.length} Entries)
              </h4>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Audit-compliant register of all cash movements into and out of CDC trading accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xs border border-slate-700 overflow-hidden text-[11px]">
              {(['ALL', 'DEPOSIT', 'WITHDRAWAL'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 font-semibold transition-colors ${
                    filterType === t ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenCashModal('DEPOSIT')}
              className="flex items-center gap-1 px-3 py-1 rounded-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record Cash Flow</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-inherit text-[10px] text-slate-400 uppercase bg-slate-900/40">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
                <th className="py-2.5 px-3">Account</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredTxns.map((txn) => {
                const isDeposit = txn.type === 'DEPOSIT';
                return (
                  <tr key={txn.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{txn.id}</td>
                    <td className="py-2.5 px-3 text-slate-300">{formatDate(txn.date)}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          isDeposit
                            ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                            : 'bg-rose-950/80 border border-rose-700 text-rose-300'
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold ${
                        isDeposit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isDeposit ? '+' : '−'}
                      {formatPKR(txn.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{txn.account}</td>
                    <td className="py-2.5 px-3 text-slate-300">{txn.method}</td>
                    <td className="py-2.5 px-3 text-slate-400">{txn.reference}</td>
                    <td className="py-2.5 px-3 text-slate-300">{txn.notes || '—'}</td>
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
