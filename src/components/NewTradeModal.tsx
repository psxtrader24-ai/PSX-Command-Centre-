import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, AlertCircle } from 'lucide-react';
import { AUTHENTIC_PSX_SECURITIES, PSX_SECTORS } from '../data/psxSecurities';
import { formatPKR, formatPercent } from '../utils/formatters';

interface NewTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tradeData: any) => void;
  darkMode: boolean;
}

export const NewTradeModal: React.FC<NewTradeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  darkMode,
}) => {
  const [symbol, setSymbol] = useState('ENGRO');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(1000);
  const [entryPrice, setEntryPrice] = useState<number>(348.5);
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState<string>('10:00');
  const [stopLoss, setStopLoss] = useState<string>('338.00');
  const [targetPrice, setTargetPrice] = useState<string>('375.00');
  const [strategy, setStrategy] = useState<string>('Momentum Breakout');
  const [entryReason, setEntryReason] = useState<string>('');
  const [tradeNotes, setTradeNotes] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('Core, Breakout');

  if (!isOpen) return null;

  // Selected security details
  const selectedSec = AUTHENTIC_PSX_SECURITIES.find((s) => s.symbol === symbol);
  const positionSize = (Number(quantity) || 0) * (Number(entryPrice) || 0);
  // Typical PSX broker commission 0.15% + SECP / CDC turnover charges ~0.03%
  const estimatedFees = Number((positionSize * 0.0015).toFixed(2));
  const estimatedTaxes = Number((positionSize * 0.0003).toFixed(2));

  const numStop = parseFloat(stopLoss);
  const numTarget = parseFloat(targetPrice);
  const initialRisk = !isNaN(numStop) && numStop > 0 ? Math.max(0, (entryPrice - numStop) * quantity) : 0;
  const initialRiskPercent = entryPrice > 0 && !isNaN(numStop) ? Math.abs((entryPrice - numStop) / entryPrice) * 100 : 0;
  const riskReward =
    !isNaN(numStop) && !isNaN(numTarget) && entryPrice > numStop && numTarget > entryPrice
      ? (numTarget - entryPrice) / (entryPrice - numStop)
      : null;

  const handleSymbolChange = (sym: string) => {
    setSymbol(sym);
    const s = AUTHENTIC_PSX_SECURITIES.find((x) => x.symbol === sym);
    if (s) {
      setEntryPrice(s.currentPrice);
      const defStop = (s.currentPrice * 0.96).toFixed(2);
      const defTarget = (s.currentPrice * 1.10).toFixed(2);
      setStopLoss(defStop);
      setTargetPrice(defTarget);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || quantity <= 0 || entryPrice <= 0) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      symbol,
      companyName: selectedSec?.name || symbol,
      sector: selectedSec?.sector || 'General',
      type,
      entryDate,
      entryTime,
      entryPrice: Number(entryPrice),
      quantity: Number(quantity),
      fees: estimatedFees,
      taxes: estimatedTaxes,
      stopLoss: !isNaN(numStop) && numStop > 0 ? numStop : undefined,
      targetPrice: !isNaN(numTarget) && numTarget > 0 ? numTarget : undefined,
      strategy,
      entryReason,
      tradeNotes,
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-xs border shadow-2xl overflow-hidden font-mono ${
          darkMode ? 'bg-[#0F1420] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-inherit flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 bg-blue-500 rounded-xs"></span>
            <h3 className="font-bold text-sm tracking-wider uppercase">Record PSX Execution / Order</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Symbol & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">PSX Symbol *</label>
              <select
                id="trade-symbol-select"
                value={symbol}
                onChange={(e) => handleSymbolChange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500"
              >
                {AUTHENTIC_PSX_SECURITIES.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {s.name} ({formatPKR(s.currentPrice)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Action Type *</label>
              <div className="flex rounded-xs border border-slate-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setType('BUY')}
                  className={`flex-1 py-1.5 font-bold text-center transition-colors ${
                    type === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  BUY (LONG)
                </button>
                <button
                  type="button"
                  onClick={() => setType('SELL')}
                  className={`flex-1 py-1.5 font-bold text-center transition-colors ${
                    type === 'SELL' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Strategy / Setup *</label>
              <select
                id="trade-strategy-select"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-blue-500"
              >
                <option value="Momentum Breakout">Momentum Breakout</option>
                <option value="Pullback to 20/50 EMA">Pullback to 20/50 EMA</option>
                <option value="Dividend Run-up">Dividend Run-up</option>
                <option value="Value Mean Reversion">Value Mean Reversion</option>
                <option value="Conglomerate Restructuring">Conglomerate Restructuring</option>
                <option value="Sector Rotation">Sector Rotation</option>
                <option value="Earnings Catalyst">Earnings Catalyst</option>
              </select>
            </div>
          </div>

          {/* Pricing & Volume */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Quantity (Shares) *</label>
              <input
                id="trade-quantity-input"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Entry Price (PKR) *</label>
              <input
                id="trade-entry-price-input"
                type="number"
                step="0.05"
                min="0.05"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Stop Loss (PKR)</label>
              <input
                id="trade-stop-loss-input"
                type="number"
                step="0.05"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Target Price (PKR)</label>
              <input
                id="trade-target-price-input"
                type="number"
                step="0.05"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Optional"
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
              />
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Entry Date *</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Entry Time (PKT)</label>
              <input
                type="time"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
              />
            </div>
          </div>

          {/* Quantitative Risk Summary Box */}
          <div className="p-3 rounded-xs border border-slate-700/80 bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Total Position Size</span>
              <span className="font-bold text-slate-200">{formatPKR(positionSize)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Est. Fees & Taxes</span>
              <span className="font-semibold text-slate-300">
                {formatPKR(estimatedFees + estimatedTaxes)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Initial Risk (R)</span>
              <span className="font-semibold text-amber-400">
                {initialRisk > 0 ? `${formatPKR(initialRisk)} (-${initialRiskPercent.toFixed(1)}%)` : 'Undefined'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Risk/Reward (R:R)</span>
              <span className="font-semibold text-blue-400">
                {riskReward ? `1 : ${riskReward.toFixed(2)}` : '—'}
              </span>
            </div>
          </div>

          {/* Rationale & Notes */}
          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Entry Reason / Thesis</label>
            <textarea
              rows={2}
              value={entryReason}
              onChange={(e) => setEntryReason(e.target.value)}
              placeholder="e.g. Breakout above 345 on 2x avg daily volume with fertilizer sector tailwinds."
              className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Core, Breakout, Dividend, Earnings"
              className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-inherit flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xs border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="submit-new-trade-btn"
              type="submit"
              className="px-5 py-1.5 rounded-xs bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-sm"
            >
              Execute & Record Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
