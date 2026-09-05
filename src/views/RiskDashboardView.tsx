import React from 'react';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  TrendingDown,
  PieChart,
  Percent,
  Layers,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { RiskMetrics, PortfolioKPIs } from '../types';
import { formatPKR, formatPercent } from '../utils/formatters';

interface RiskDashboardViewProps {
  riskMetrics: RiskMetrics;
  kpis: PortfolioKPIs;
  darkMode: boolean;
}

export const RiskDashboardView: React.FC<RiskDashboardViewProps> = ({
  riskMetrics,
  kpis,
  darkMode,
}) => {
  const isHeatHigh = riskMetrics.portfolioHeat > 5.0;
  const isDrawdownDeep = riskMetrics.currentDrawdownPercent > 10.0;

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Risk Alert / Status Banner */}
      <div
        className={`p-3 rounded-xs border flex items-center justify-between ${
          isHeatHigh
            ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
            : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlert className={`w-4 h-4 ${isHeatHigh ? 'text-rose-400' : 'text-emerald-400'}`} />
          <div>
            <span className="font-bold text-xs uppercase tracking-wider block">
              {isHeatHigh ? 'High Risk Warning: Portfolio Heat Exceeds 5%' : 'Portfolio Risk Profile: Institutional Normal'}
            </span>
            <span className="text-[10px] text-slate-400">
              Total capital exposed to predefined stop losses is {formatPKR(riskMetrics.totalOpenRisk)} ({riskMetrics.portfolioHeat.toFixed(2)}% of equity).
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase">Drawdown Recovery</span>
          <span className="font-bold text-xs text-blue-400 uppercase">
            {riskMetrics.recoveryStatus === 'AT_PEAK' ? '● New All-Time Peak' : riskMetrics.recoveryStatus === 'RECOVERING' ? '● Recovering' : '⚠ In Drawdown'}
          </span>
        </div>
      </div>

      {/* Primary Risk Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Gross Exposure</span>
          <span className="text-sm sm:text-base font-bold text-slate-100">{formatPKR(riskMetrics.grossExposure)}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{riskMetrics.investedPercent.toFixed(1)}% Invested</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Cash Buffer</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400">{formatPKR(kpis.availableCash)}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{riskMetrics.cashPercent.toFixed(1)}% Liquidity</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Portfolio Heat</span>
          <span className={`text-sm sm:text-base font-bold ${isHeatHigh ? 'text-rose-400' : 'text-amber-400'}`}>
            {riskMetrics.portfolioHeat.toFixed(2)}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Total Open Risk / Equity</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Largest Position</span>
          <span className="text-sm sm:text-base font-bold text-blue-400">{riskMetrics.largestPositionSymbol}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{riskMetrics.largestPositionPercent.toFixed(1)}% Weight</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Current Drawdown</span>
          <span className="text-sm sm:text-base font-bold text-rose-400">-{riskMetrics.currentDrawdownPercent.toFixed(2)}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{formatPKR(riskMetrics.currentDrawdown)} from peak</span>
        </div>

        <div className={`p-3 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
          <span className="text-[10px] uppercase text-slate-400 block">Max Drawdown</span>
          <span className="text-sm sm:text-base font-bold text-rose-400">-{riskMetrics.maxDrawdownPercent.toFixed(2)}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{formatPKR(riskMetrics.maxDrawdown)}</span>
        </div>
      </div>

      {/* Sector Exposure & Concentration Rules */}
      <div className={`p-4 rounded-xs border ${darkMode ? 'bg-[#111622] border-[#243048]' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-3.5 bg-amber-500 rounded-xs"></span>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
            Sector Concentration & Prudent Limits
          </h3>
        </div>

        <div className="space-y-2.5">
          {riskMetrics.sectorConcentration.map((sec) => (
            <div key={sec.sector} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-semibold">{sec.sector}</span>
                <span className="text-slate-400">
                  {formatPKR(sec.value)} ({sec.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-xs bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-xs transition-all ${
                    sec.percentage > 35
                      ? 'bg-rose-500'
                      : sec.percentage > 25
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, sec.percentage)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
