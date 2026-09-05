import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Tag,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle,
  Edit3,
} from 'lucide-react';
import { TradeJournalEntry, Trade } from '../types';
import { formatDate } from '../utils/formatters';

interface TradeJournalViewProps {
  journals: TradeJournalEntry[];
  trades: Trade[];
  darkMode: boolean;
  onSaveJournal: (entry: Partial<TradeJournalEntry>) => void;
}

export const TradeJournalView: React.FC<TradeJournalViewProps> = ({
  journals,
  trades,
  darkMode,
  onSaveJournal,
}) => {
  const [selectedJournal, setSelectedJournal] = useState<TradeJournalEntry | null>(
    journals[0] || null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form states
  const [thesis, setThesis] = useState<string>(selectedJournal?.thesis || '');
  const [setup, setSetup] = useState<string>(selectedJournal?.setup || '');
  const [marketEnvironment, setMarketEnvironment] = useState<string>(
    selectedJournal?.marketEnvironment || ''
  );
  const [sectorStrength, setSectorStrength] = useState<string>(
    selectedJournal?.sectorStrength || ''
  );
  const [entryRationale, setEntryRationale] = useState<string>(
    selectedJournal?.entryRationale || ''
  );
  const [riskRationale, setRiskRationale] = useState<string>(
    selectedJournal?.riskRationale || ''
  );
  const [exitRationale, setExitRationale] = useState<string>(
    selectedJournal?.exitRationale || ''
  );
  const [mistakes, setMistakes] = useState<string>(selectedJournal?.mistakes || '');
  const [lessonsLearned, setLessonsLearned] = useState<string>(
    selectedJournal?.lessonsLearned || ''
  );

  const handleSelect = (j: TradeJournalEntry) => {
    setSelectedJournal(j);
    setThesis(j.thesis);
    setSetup(j.setup);
    setMarketEnvironment(j.marketEnvironment);
    setSectorStrength(j.sectorStrength);
    setEntryRationale(j.entryRationale);
    setRiskRationale(j.riskRationale);
    setExitRationale(j.exitRationale || '');
    setMistakes(j.mistakes || '');
    setLessonsLearned(j.lessonsLearned || '');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!selectedJournal) return;
    onSaveJournal({
      ...selectedJournal,
      thesis,
      setup,
      marketEnvironment,
      sectorStrength,
      entryRationale,
      riskRationale,
      exitRationale,
      mistakes,
      lessonsLearned,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Journal List */}
        <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Playbook & Journal Logs ({journals.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {journals.map((j) => {
              const isSelected = selectedJournal?.id === j.id;
              return (
                <div
                  key={j.id}
                  onClick={() => handleSelect(j)}
                  className={`p-3 rounded-xs border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-xs'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-100">{j.symbol}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(j.entryDate)}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-blue-300 truncate">
                    {j.title || j.setup}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                    {j.thesis}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {j.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 rounded-xs bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Journal Reader / Editor */}
        <div className={`p-5 rounded-xs border lg:col-span-2 ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          {selectedJournal ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-inherit">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-100">{selectedJournal.symbol}</span>
                    <span className="text-xs text-blue-400 font-semibold">— {selectedJournal.setup}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Trade ID: {selectedJournal.tradeId} | Logged: {formatDate(selectedJournal.entryDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Reflection</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Core Reflection Sections */}
              <div className="space-y-3 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Trade Thesis & Catalyst
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={thesis}
                      onChange={(e) => setThesis(e.target.value)}
                      className="w-full p-2 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                    />
                  ) : (
                    <p className="p-2.5 rounded-xs bg-slate-900/60 border border-slate-800 text-slate-200 leading-relaxed">
                      {selectedJournal.thesis}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Market Environment & KSE Context
                    </span>
                    {isEditing ? (
                      <input
                        value={marketEnvironment}
                        onChange={(e) => setMarketEnvironment(e.target.value)}
                        className="w-full p-2 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                      />
                    ) : (
                      <p className="p-2.5 rounded-xs bg-slate-900/60 border border-slate-800 text-slate-300">
                        {selectedJournal.marketEnvironment}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Sector Strength
                    </span>
                    {isEditing ? (
                      <input
                        value={sectorStrength}
                        onChange={(e) => setSectorStrength(e.target.value)}
                        className="w-full p-2 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                      />
                    ) : (
                      <p className="p-2.5 rounded-xs bg-slate-900/60 border border-slate-800 text-slate-300">
                        {selectedJournal.sectorStrength}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Entry Rationale
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={entryRationale}
                        onChange={(e) => setEntryRationale(e.target.value)}
                        className="w-full p-2 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                      />
                    ) : (
                      <p className="p-2.5 rounded-xs bg-slate-900/60 border border-slate-800 text-slate-300">
                        {selectedJournal.entryRationale}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Risk & Invalidation Rationale
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={riskRationale}
                        onChange={(e) => setRiskRationale(e.target.value)}
                        className="w-full p-2 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                      />
                    ) : (
                      <p className="p-2.5 rounded-xs bg-slate-900/60 border border-slate-800 text-slate-300">
                        {selectedJournal.riskRationale}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                      Mistakes & Execution Errors
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={mistakes}
                        onChange={(e) => setMistakes(e.target.value)}
                        className="w-full p-2 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                      />
                    ) : (
                      <p className="p-2.5 rounded-xs bg-slate-900/60 border border-slate-800 text-slate-300">
                        {selectedJournal.mistakes || 'None documented.'}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                      Lessons Learned & Rule Refinements
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={lessonsLearned}
                        onChange={(e) => setLessonsLearned(e.target.value)}
                        className="w-full p-2 rounded-xs border border-slate-700 bg-slate-900 text-slate-100"
                      />
                    ) : (
                      <p className="p-2.5 rounded-xs bg-slate-900/60 border border-slate-800 text-slate-300">
                        {selectedJournal.lessonsLearned || 'Continuous adherence to process.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              Select a journal entry to view or reflect on trading setups.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
