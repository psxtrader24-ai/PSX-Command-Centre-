export type MarketStatusType = 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'POST_MARKET';
export type DataBasisType = 'LATEST_CLOSE' | 'INTRADAY' | 'STALE' | 'DEMO_DATA';
export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED' | 'PARTIAL';
export type WinLossStatus = 'WIN' | 'LOSS' | 'BE';

export interface PSXQuote {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  turnover: number; // PKR
  lastUpdated: string;
  dataBasis: DataBasisType;
  pe?: number;
  dividendYield?: number;
}

export interface PSXIndex {
  symbol: string;
  name: string;
  value: number;
  currentValue?: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  historical: Array<{ date: string; close: number }>;
}

export interface Trade {
  id: string;
  symbol: string;
  companyName: string;
  sector: string;
  type: TradeType;
  entryDate: string; // YYYY-MM-DD
  entryTime: string; // HH:mm
  entryPrice: number;
  quantity: number;
  remainingQuantity?: number;
  positionSize: number; // entryPrice * quantity
  fees: number; // Brokerage, CDC, SECP, taxes
  taxes: number; // SST / CVT / Capital Gains Tax
  
  // Exit information for closed or partially closed trades
  exitDate?: string;
  exitPrice?: number;
  holdingPeriodDays?: number;
  grossPnL?: number;
  netPnL?: number;
  pnlPercent?: number;
  status: TradeStatus;
  
  // Strategy & Risk Management
  strategy: string;
  tradeNotes: string;
  entryReason: string;
  exitReason?: string;
  stopLoss?: number;
  targetPrice?: number;
  initialRisk?: number; // (entryPrice - stopLoss) * quantity
  riskRewardRatio?: number; // (target - entry) / (entry - stop)
  tags: string[];

  // Partial exits tracking
  partialExits?: Array<{
    id: string;
    date: string;
    quantity: number;
    price: number;
    fees: number;
    netPnL: number;
    exitReason?: string;
  }>;
}

export interface OpenPosition {
  symbol: string;
  companyName: string;
  sector: string;
  quantity: number;
  avgEntryPrice: number;
  costBasis: number; // quantity * avgEntryPrice + associated entry fees
  currentPrice: number;
  previousClose?: number;
  dailyChange?: number;
  dailyChangePercent?: number;
  marketValue: number; // quantity * currentPrice
  unrealizedPnL: number; // marketValue - costBasis
  unrealizedPnLPercent: number;
  weight: number; // marketValue / portfolioValue * 100
  stopLoss?: number;
  initialRisk?: number;
  currentRisk?: number; // quantity * (currentPrice - stopLoss) if stopLoss is defined
  distanceToStopPercent?: number;
  distanceFromEntryPercent?: number;
  tradeIds: string[];
}

export interface ClosedPosition {
  id: string;
  tradeId: string;
  symbol: string;
  companyName: string;
  sector: string;
  entryDate: string;
  exitDate: string;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  grossPnL: number;
  fees: number;
  taxes: number;
  feesAndTaxes: number;
  netPnL: number;
  returnPercent: number;
  holdingPeriodDays: number;
  winLoss: WinLossStatus;
  isWin: boolean;
  strategy: string;
  exitReason: string;
  stopLoss?: number;
  rMultiple?: number;
  tags: string[];
}

export interface CashTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  date: string; // YYYY-MM-DD
  amount: number;
  currency: string; // "PKR"
  account: string; // e.g. "Arif Habib Limited", "AKD Securities", "JS Global"
  method: string; // "IBFT", "Cheque", "Wire", "Cash"
  reference: string;
  notes: string;
}

export interface CapitalFlow {
  openingCapital: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netCapital: number; // Deposits - Withdrawals
  realizedTradingPnL: number;
  unrealizedTradingPnL: number;
  totalTradingPnL: number;
  netFeesTaxes: number;
  currentCash: number;
  currentInvestedCapital: number;
  currentMarketValue: number;
  currentEquity: number; // Cash + Market Value of Open Positions
}

export interface PortfolioKPIs {
  portfolioValue: number;
  availableCash: number;
  investedCapital: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netCapital: number;
  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  returnPercent: number;
  todayPnL: number;
  todayPnLPercent: number;
  openPositionsCount: number;
  closedTradesCount: number;
  winRate: number;
  profitFactor: number;
}

export interface TimePerformancePeriod {
  periodLabel: string;
  pnl: number;
  returnPercent: number;
  realizedPnL: number;
  unrealizedPnL: number;
  deposits: number;
  withdrawals: number;
  tradeCount: number;
  winRate: number;
}

export interface TimePerformanceAnalytics {
  weekly: TimePerformancePeriod;
  monthly: TimePerformancePeriod;
  quarterly: TimePerformancePeriod;
  yearly: TimePerformancePeriod;
  allTime: TimePerformancePeriod & {
    totalTrades: number;
    profitFactor: number;
    maxDrawdown: number;
    maxDrawdownPercent: number;
  };
}

export interface TradingStatistics {
  winRate: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  totalClosedTrades: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  payoffRatio: number; // averageWin / averageLoss
  expectancy: number; // (winRate% * avgWin) - (lossRate% * avgLoss)
  averageR: number;
  largestWinner: { symbol: string; amount: number; date: string } | null;
  largestLoser: { symbol: string; amount: number; date: string } | null;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  averageHoldingPeriodDays: number;
}

export interface RiskMetrics {
  grossExposure: number; // Sum of abs market value of positions
  netExposure: number; // Market value of longs - shorts (PSX mostly long)
  cashPercent: number;
  investedPercent: number;
  largestPositionPercent: number;
  largestPositionSymbol: string;
  sectorConcentration: Array<{ sector: string; percentage: number; value: number }>;
  numberOfPositions: number;
  riskPerTradeAvg: number;
  totalOpenRisk: number; // Rs at risk to stop losses
  portfolioHeat: number; // totalOpenRisk / portfolioEquity * 100
  currentDrawdown: number;
  currentDrawdownPercent: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  peakEquity: number;
  drawdownDurationDays: number;
  recoveryStatus: 'AT_PEAK' | 'RECOVERING' | 'IN_DRAWDOWN';
}

export interface EquityCurvePoint {
  date: string;
  portfolioEquity: number;
  cash: number;
  invested: number;
  netDeposits: number;
  benchmarkReturnPercent: number; // KSE-100 return % from start
  portfolioReturnPercent: number;
  drawdownPercent: number;
}

export interface DailyPnLEntry {
  date: string;
  dayOfWeek: string;
  pnl: number;
  returnPercent: number;
  tradeCount: number;
  status: 'WIN' | 'LOSS' | 'FLAT';
}

export interface TradeJournalEntry {
  id: string;
  tradeId: string;
  symbol: string;
  entryDate: string;
  title?: string;
  thesis: string;
  setup: string;
  marketEnvironment: string;
  sectorStrength: string;
  entryRationale: string;
  riskRationale: string;
  exitRationale?: string;
  mistakes?: string;
  lessonsLearned?: string;
  tags: string[];
  screenshotUrl?: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXECUTE_PARTIAL_EXIT' | 'DEPOSIT' | 'WITHDRAWAL' | 'SYNC_MARKET_DATA';
  entity: 'TRADE' | 'POSITION' | 'CASH' | 'JOURNAL' | 'MARKET_DATA';
  entityId: string;
  summary: string;
  previousValue?: any;
  newValue?: any;
}

export interface MarketStatusInfo {
  isOpen: boolean;
  status: 'OPEN' | 'CLOSED';
  sessionName: string;
  nextEvent: string;
  serverTimePKT: string;
}

export type ClosedTradeRecord = ClosedPosition;
export type DailyPnLRecord = DailyPnLEntry;

export interface TimeBasedPerformance {
  period: string;
  startingEquity: number;
  endingEquity: number;
  netFlows: number;
  grossTradingPnL: number;
  feesAndTaxes: number;
  netTradingPnL: number;
  returnPercent: number;
  winRate: number;
  tradesCount: number;
  profitFactor: number;
  benchmarkReturnPercent?: number;
  outperformancePercent?: number;
}

export interface BenchmarkComparisonSummary {
  timeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'INCEPTION';
  label: string;
  portfolioReturnPercent: number;
  benchmarkReturnPercent: number;
  outperformancePercent: number;
  isOutperforming: boolean;
  benchmarkSymbol: string;
  benchmarkClose: number;
  benchmarkChangePercent: number;
  alpha: number;
  beta: number;
  sharpeRatio: number;
  maxDrawdownPercent: number;
}

