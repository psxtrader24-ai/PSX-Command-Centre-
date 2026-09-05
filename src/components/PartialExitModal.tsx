import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { formatPKR, formatPercent } from '../utils/formatters';
import { OpenPosition } from '../types';

interface PartialExitModalProps {
  isOpen: boolean;
  position: OpenPosition | null;
  onClose: () => void;
  onSubmit: (data: {
    quantity: number;
    exitPrice: number;
    exitDate: string;
    exitReason: string;
    fees: number;
  }) => void;
  darkMode: boolean;
}

export const PartialExitModal: React.FC<PartialExitModalProps> = ({
  isOpen,
  position,
  onClose,
  onSubmit,
  darkMode,
}) => {
  if (!isOpen || !position) return null;

  const [exitQuantity, setExitQuantity] = useState<number>(Math.floor(position.quantity / 2) || 1);
  const [exitPrice, setExitPrice] = useState<number>(position.currentPrice);
  const [exitDate, setExitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [exitReason, setExitReason] = useState<string>('Target reached / scaling out partial');

  const portionCost = exitQuantity * position.avgEntryPrice;
  const grossProceeds = exitQuantity * exitPrice;
  const estFees = Number((grossProceeds * 0.0015).toFixed(2));
  const estGrossPnL = grossProceeds - portionCost;
  const estNetPnL = estGrossPnL - estFees;
  const estReturnPercent = portionCost > 0 ? (estNetPnL / portionCost) * 100 : 0;
  const remainingShares = position.quantity - exitQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exitQuantity <= 0 || exitQuantity > position.quantity || exitPrice <= 0) return;

    onSubmit({
      quantity: Number(exitQuantity),
      exitPrice: Number(exitPrice),
      exitDate,
      exitReason,
      fees: estFees,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn font-mono text-xs">
      <div
        className={`w-full max-w-lg rounded-xs border shadow-2xl overflow-hidden ${
          darkMode ? 'bg-[#0F1420] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        <div className="px-5 py-3 border-b border-inherit flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-4 bg-amber-500 rounded-xs"></span>
            <h3 className="font-bold text-sm uppercase">
              Exit Position ({position.symbol} — {position.companyName})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Active stats */}
          <div className="p-3 rounded-xs border border-slate-800 bg-slate-900/70 grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Total Active Qty</span>
              <span className="font-bold text-slate-200">{position.quantity.toLocaleString()} shs</span>
            </div>
            <div>
              <span className="text-slate-400 block">Avg Entry Cost</span>
              <span className="font-bold text-slate-200">{formatPKR(position.avgEntryPrice)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Latest PSX Price</span>
              <span className="font-bold text-emerald-400">{formatPKR(position.currentPrice)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Shares to Exit *</label>
              <input
                id="exit-quantity-input"
                type="number"
                min="1"
                max={position.quantity}
                value={exitQuantity}
                onChange={(e) => setExitQuantity(Math.min(position.quantity, Math.max(1, parseInt(e.target.value) || 0)))}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
              <div className="flex gap-2 mt-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setExitQuantity(Math.floor(position.quantity * 0.25) || 1)}
                  className="text-blue-400 hover:underline"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => setExitQuantity(Math.floor(position.quantity * 0.5) || 1)}
                  className="text-blue-400 hover:underline"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setExitQuantity(Math.floor(position.quantity * 0.75) || 1)}
                  className="text-blue-400 hover:underline"
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => setExitQuantity(position.quantity)}
                  className="text-amber-400 hover:underline font-bold"
                >
                  100% (Full)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Exit Price (PKR) *</label>
              <input
                id="exit-price-input"
                type="number"
                step="0.05"
                min="0.05"
                value={exitPrice}
                onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Remaining after exit: {remainingShares.toLocaleString()} shares
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Exit Date *</label>
              <input
                type="date"
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Exit Reason / Setup</label>
              <input
                type="text"
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
              />
            </div>
          </div>

          {/* Realized P&L Preview */}
          <div className="p-3 rounded-xs border border-slate-700 bg-slate-900/90 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Realized Net P&L (After Fees)</span>
              <span
                className={`text-base font-bold ${
                  estNetPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatPKR(estNetPnL, { showSign: true })} ({formatPercent(estReturnPercent)})
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <div>Gross: {formatPKR(estGrossPnL, { showSign: true })}</div>
              <div>Est. Fees: {formatPKR(estFees)}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-inherit flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xs border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="confirm-partial-exit-btn"
              type="submit"
              className="px-5 py-1.5 rounded-xs bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors shadow-sm"
            >
              {remainingShares === 0 ? 'Close Position Completely' : 'Execute Partial Exit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
