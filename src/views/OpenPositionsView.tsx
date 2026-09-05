import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Percent,
  Sliders,
  ExternalLink,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { OpenPosition, PortfolioKPIs } from '../types';
import { formatPKR, formatPercent } from '../utils/formatters';

interface OpenPositionsViewProps {
  openPositions: OpenPosition[];
  portfolioValue: number;
  darkMode: boolean;
  onPartialExit: (position: OpenPosition) => void;
  onEditStopLoss: (position: OpenPosition, newStop: number) => void;
  onOpenTradeJournal: (symbol: string) => void;
}

export const OpenPositionsView: React.FC<OpenPositionsViewProps> = ({
  openPositions,
  portfolioValue,
  darkMode,
  onPartialExit,
  onEditStopLoss,
  onOpenTradeJournal,
}) => {
  const [editingStopSymbol, setEditingStopSymbol] = useState<string | null>(null);
  const [newStopValue, setNewStopValue] = useState<string>('');

  const handleStartEditStop = (pos: OpenPosition) => {
    setEditingStopSymbol(pos.symbol);
    setNewStopValue(pos.stopLoss ? pos.stopLoss.toString() : '');
  };

  const handleSaveStop = (pos: OpenPosition) => {
    const val = parseFloat(newStopValue);
    if (!isNaN(val) && val >= 0) {
      onEditStopLoss(pos, val);
    }
    setEditingStopSymbol(null);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="bg-[#161B22] border border-[#1E2229] rounded overflow-hidden">
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[#1E2229] gap-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-emerald-500 rounded-xs"></div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Open Positions Accounting & Risk Monitor
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Live mark-to-market valuations from PSX official feed with real-time risk exposure and distance-to-stop.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-gray-500">
              Active Positions: <strong className="text-white font-mono">{openPositions.length}</strong>
            </span>
            <span className="text-gray-500">
              Total Exposure:{' '}
              <strong className="text-blue-400 font-mono">
                {formatPKR(openPositions.reduce((acc, p) => acc + p.marketValue, 0))}
              </strong>
            </span>
          </div>
        </div>

        {/* Full Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0E1116] text-gray-500 uppercase text-[10px] tracking-widest border-b border-[#1E2229]">
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Avg Entry</th>
                <th className="py-2.5 px-3 text-right">Current Price</th>
                <th className="py-2.5 px-3 text-right">Market Value</th>
                <th className="py-2.5 px-3 text-right">Cost Basis</th>
                <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                <th className="py-2.5 px-3 text-right">P&L %</th>
                <th className="py-2.5 px-3 text-right">Weight</th>
                <th className="py-2.5 px-3 text-right">Stop Loss</th>
                <th className="py-2.5 px-3 text-right">Open Risk</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2229]">
              {openPositions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-gray-500">
                    No active open positions in portfolio. Deploy cash via "New Trade".
                  </td>
                </tr>
              ) : (
                openPositions.map((pos) => {
                  const isProfit = pos.unrealizedPnL > 1;
                  const isLoss = pos.unrealizedPnL < -1;
                  const posWeight = portfolioValue > 0 ? (pos.marketValue / portfolioValue) * 100 : 0;

                  return (
                    <tr
                      key={pos.symbol}
                      className="hover:bg-blue-500/5 transition-colors group"
                    >
                      {/* Symbol & Company */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{pos.symbol}</span>
                          <button
                            onClick={() => onOpenTradeJournal(pos.symbol)}
                            title="View / Edit Trade Journal Thesis"
                            className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[130px]">
                          {pos.companyName}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1E2229] text-gray-400 border border-[#2D333D]">
                          {pos.sector}
                        </span>
                      </td>

                      {/* Qty */}
                      <td className="py-2.5 px-3 text-right text-gray-200 font-semibold">
                        {pos.quantity.toLocaleString()}
                      </td>

                      {/* Avg Entry */}
                      <td className="py-2.5 px-3 text-right text-gray-300">
                        {formatPKR(pos.avgEntryPrice)}
                      </td>

                      {/* Current Price */}
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        <div>{formatPKR(pos.currentPrice)}</div>
                        {pos.distanceFromEntryPercent !== undefined && (
                          <div
                            className={`text-[9px] ${
                              pos.distanceFromEntryPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            {formatPercent(pos.distanceFromEntryPercent)}
                          </div>
                        )}
                      </td>

                      {/* Market Value */}
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-200">
                        {formatPKR(pos.marketValue)}
                      </td>

                      {/* Cost Basis */}
                      <td className="py-2.5 px-3 text-right text-gray-400">
                        {formatPKR(pos.costBasis)}
                      </td>

                      {/* Unrealized P&L */}
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          isProfit ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-gray-400'
                        }`}
                      >
                        {formatPKR(pos.unrealizedPnL, { showSign: true })}
                      </td>

                      {/* P&L % */}
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          isProfit ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-gray-400'
                        }`}
                      >
                        {formatPercent(pos.unrealizedPnLPercent)}
                      </td>

                      {/* Weight */}
                      <td className="py-2.5 px-3 text-right font-semibold text-blue-400">
                        {posWeight.toFixed(1)}%
                      </td>

                      {/* Stop Loss with in-line edit */}
                      <td className="py-2.5 px-3 text-right">
                        {editingStopSymbol === pos.symbol ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="0.05"
                              value={newStopValue}
                              onChange={(e) => setNewStopValue(e.target.value)}
                              className="w-20 px-1 py-0.5 rounded border border-blue-500 bg-[#0E1116] text-white text-[11px]"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStop(pos)}
                              className="p-1 text-emerald-400 hover:text-emerald-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-gray-300">
                              {pos.stopLoss ? formatPKR(pos.stopLoss) : '—'}
                            </span>
                            <button
                              onClick={() => handleStartEditStop(pos)}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200"
                              title="Edit Stop Loss"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {pos.distanceToStopPercent !== undefined && (
                          <div className="text-[9px] text-amber-400">
                            -{pos.distanceToStopPercent.toFixed(1)}% to stop
                          </div>
                        )}
                      </td>

                      {/* Open Risk Exposure */}
                      <td className="py-2.5 px-3 text-right">
                        {pos.currentRisk ? (
                          <span className="text-amber-400 font-semibold">
                            {formatPKR(pos.currentRisk)}
                          </span>
                        ) : (
                          <span className="text-gray-500">Undefined</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onPartialExit(pos)}
                          className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                        >
                          Scale / Exit
                        </button>
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
