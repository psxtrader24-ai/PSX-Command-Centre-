import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Database,
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { formatDate } from '../utils/formatters';

interface AuditLogViewProps {
  auditLogs: AuditLogEntry[];
  darkMode: boolean;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditLogs, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch =
      log.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const actions = Array.from(new Set(auditLogs.map((l) => l.action)));

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Data Integrity & Compliance Audit Trail ({filteredLogs.length} Events)
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Immutable log of every portfolio event, trade modification, cash movement, and market data synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail..."
                className="pl-8 pr-3 py-1 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 text-xs w-48"
              />
            </div>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xs border border-slate-700 bg-slate-900 text-slate-100 text-[11px]"
            >
              <option value="ALL">All Actions</option>
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-inherit text-[10px] text-slate-400 uppercase bg-slate-900/40">
                <th className="py-2.5 px-2 w-8"></th>
                <th className="py-2.5 px-3">Audit ID / Time</th>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity / ID</th>
                <th className="py-2.5 px-3">Summary & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredLogs.map((log) => {
                const isExpanded = expandedId === log.id;
                const hasDiff = log.previousValue || log.newValue;

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-2">
                        {hasDiff && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : log.id)}
                            className="p-1 text-slate-400 hover:text-slate-200"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-200">{log.id}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-300">{log.user}</td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                            log.action === 'CREATE'
                              ? 'bg-blue-950/80 border border-blue-600 text-blue-300'
                              : log.action === 'DEPOSIT'
                              ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300'
                              : log.action === 'WITHDRAWAL'
                              ? 'bg-rose-950/80 border border-rose-600 text-rose-300'
                              : log.action === 'EXECUTE_PARTIAL_EXIT'
                              ? 'bg-amber-950/80 border border-amber-600 text-amber-300'
                              : 'bg-slate-800 border border-slate-700 text-slate-300'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-200">{log.entity}</div>
                        <div className="text-[10px] text-slate-400">{log.entityId}</div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-200">
                        {log.summary}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-900/70 border-b border-inherit">
                        <td colSpan={6} className="p-3 text-[11px]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {log.previousValue && (
                              <div className="p-2.5 rounded-xs border border-slate-800 bg-slate-950">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                                  Previous State
                                </span>
                                <pre className="text-[10px] text-slate-300 overflow-x-auto">
                                  {JSON.stringify(log.previousValue, null, 2)}
                                </pre>
                              </div>
                            )}

                            {log.newValue && (
                              <div className="p-2.5 rounded-xs border border-slate-800 bg-slate-950">
                                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                                  New State
                                </span>
                                <pre className="text-[10px] text-slate-300 overflow-x-auto">
                                  {JSON.stringify(log.newValue, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
