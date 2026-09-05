import React, { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatPKR } from '../utils/formatters';

interface CashTransactionModalProps {
  isOpen: boolean;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  onClose: () => void;
  onSubmit: (cashData: any) => void;
  darkMode: boolean;
}

export const CashTransactionModal: React.FC<CashTransactionModalProps> = ({
  isOpen,
  type: initialType,
  onClose,
  onSubmit,
  darkMode,
}) => {
  const [type, setType] = useState<'DEPOSIT' | 'WITHDRAWAL'>(initialType);
  const [amount, setAmount] = useState<number>(500000);
  const [account, setAccount] = useState<string>('Arif Habib Ltd - CDS 03254');
  const [method, setMethod] = useState<string>('IBFT');
  const [reference, setReference] = useState<string>(`TRF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onSubmit({
      type,
      amount: Number(amount),
      account,
      method,
      reference,
      notes,
      date,
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
            <span
              className={`w-2 h-4 rounded-xs ${
                type === 'DEPOSIT' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
            <h3 className="font-bold text-sm uppercase">Record Capital Flow ({type})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-2.5 rounded-xs bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
            <span className="font-bold text-blue-400">Strict Capital Accounting Rule:</span> Deposits and withdrawals adjust your cash ledger and net capital. They are{' '}
            <strong className="text-amber-300">never counted as trading profit or loss</strong>.
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Transaction Type *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('DEPOSIT')}
                className={`py-2 rounded-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                  type === 'DEPOSIT'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                <span>Deposit Capital</span>
              </button>
              <button
                type="button"
                onClick={() => setType('WITHDRAWAL')}
                className={`py-2 rounded-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                  type === 'WITHDRAWAL'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>Withdraw Capital</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Amount (PKR) *</label>
              <input
                id="cash-amount-input"
                type="number"
                min="1"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">{formatPKR(amount)}</span>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Brokerage / Bank Account *</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
              >
                <option value="IBFT">IBFT (Inter-bank Transfer)</option>
                <option value="Cheque">Crossed Cheque</option>
                <option value="Wire">RTGS / Wire Transfer</option>
                <option value="CDC Direct">CDC Investor Direct</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Reference / Transaction ID</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. MEZN-TX-492010"
              className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Quarterly capital allocation, dividend payout, etc."
              className="w-full px-2.5 py-1.5 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
            />
          </div>

          <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xs border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="submit-cash-transaction-btn"
              type="submit"
              className={`px-5 py-1.5 rounded-xs font-bold text-white transition-colors shadow-sm ${
                type === 'DEPOSIT' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              Record {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
