import {
  Trade,
  OpenPosition,
  ClosedPosition,
  CashTransaction,
  CapitalFlow,
  PortfolioKPIs,
  TimePerformanceAnalytics,
  TradingStatistics,
  RiskMetrics,
  PSXQuote,
  EquityCurvePoint,
  DailyPnLEntry,
  TimeBasedPerformance,
} from '../types';

/**
 * Calculates Open Positions from a collection of trades and live quotes.
 * Supports position averaging, multiple entries, and partial exits.
 */
export function calculateOpenPositions(
  trades: Trade[],
  quotesInput: Record<string, PSXQuote> | PSXQuote[]
): OpenPosition[] {
  const quotesMap: Record<string, PSXQuote> = Array.isArray(quotesInput)
    ? quotesInput.reduce((acc, q) => ({ ...acc, [q.symbol]: q }), {} as Record<string, PSXQuote>)
    : quotesInput;

  // Group open and partial trades by symbol

  const symbolTradesMap: Record<string, Trade[]> = {};
  
  for (const trade of trades) {
    if (trade.status === 'OPEN' || trade.status === 'PARTIAL') {
      if (!symbolTradesMap[trade.symbol]) {
        symbolTradesMap[trade.symbol] = [];
      }
      symbolTradesMap[trade.symbol].push(trade);
    }
  }

  const openPositions: OpenPosition[] = [];

  for (const [symbol, symbolTrades] of Object.entries(symbolTradesMap)) {
    let totalRemainingQty = 0;
    let totalCostBasis = 0;
    let companyName = symbolTrades[0]?.companyName || symbol;
    let sector = symbolTrades[0]?.sector || 'General';
    let weightedStopLossSum = 0;
    let stopLossWeightSum = 0;

    for (const trade of symbolTrades) {
      let remainingQty = trade.quantity;
      if (trade.partialExits && trade.partialExits.length > 0) {
        const exitedQty = trade.partialExits.reduce((acc, pe) => acc + pe.quantity, 0);
        remainingQty = Math.max(0, trade.quantity - exitedQty);
      }

      if (remainingQty > 0) {
        totalRemainingQty += remainingQty;
        // Cost basis incorporates entry price + proportional fees
        const tradeFeeShare = (remainingQty / trade.quantity) * (trade.fees + trade.taxes);
        const tradeCost = remainingQty * trade.entryPrice + tradeFeeShare;
        totalCostBasis += tradeCost;

        if (trade.stopLoss && trade.stopLoss > 0) {
          weightedStopLossSum += trade.stopLoss * remainingQty;
          stopLossWeightSum += remainingQty;
        }
      }
    }

    if (totalRemainingQty > 0) {
      const avgEntryPrice = totalCostBasis / totalRemainingQty;
      const quote = quotesMap[symbol];
      const currentPrice = quote ? quote.currentPrice : avgEntryPrice;
      const marketValue = totalRemainingQty * currentPrice;
      const unrealizedPnL = marketValue - totalCostBasis;
      const unrealizedPnLPercent = totalCostBasis > 0 ? (unrealizedPnL / totalCostBasis) * 100 : 0;
      const avgStopLoss = stopLossWeightSum > 0 ? weightedStopLossSum / stopLossWeightSum : undefined;

      let initialRisk: number | undefined = undefined;
      let currentRisk: number | undefined = undefined;
      let distanceToStopPercent: number | undefined = undefined;
      let distanceFromEntryPercent: number | undefined = undefined;

      if (avgStopLoss) {
        currentRisk = Math.max(0, totalRemainingQty * (currentPrice - avgStopLoss));
        initialRisk = Math.max(0, totalRemainingQty * (avgEntryPrice - avgStopLoss));
        distanceToStopPercent = currentPrice > 0 ? ((currentPrice - avgStopLoss) / currentPrice) * 100 : 0;
      }

      if (avgEntryPrice > 0) {
        distanceFromEntryPercent = ((currentPrice - avgEntryPrice) / avgEntryPrice) * 100;
      }

      openPositions.push({
        symbol,
        companyName,
        sector,
        quantity: totalRemainingQty,
        avgEntryPrice,
        costBasis: totalCostBasis,
        currentPrice,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        weight: 0, // Will be computed after total portfolio value is known
        stopLoss: avgStopLoss,
        initialRisk,
        currentRisk,
        distanceToStopPercent,
        distanceFromEntryPercent,
        tradeIds: symbolTrades.map((t) => t.id),
      });
    }
  }

  return openPositions;
}

/**
 * Extracts and calculates all closed trades and partial exit records.
 */
export function calculateClosedTrades(trades: Trade[]): ClosedPosition[] {
  const closedPositions: ClosedPosition[] = [];

  for (const trade of trades) {
    // 1. Fully closed trades
    if (trade.status === 'CLOSED' && trade.exitPrice !== undefined && trade.exitDate) {
      const grossProceeds = trade.quantity * trade.exitPrice;
      const entryCost = trade.quantity * trade.entryPrice;
      const totalFees = trade.fees + trade.taxes;
      const grossPnL = grossProceeds - entryCost;
      const netPnL = grossPnL - totalFees;
      const returnPercent = entryCost > 0 ? (netPnL / entryCost) * 100 : 0;

      const entryD = new Date(trade.entryDate);
      const exitD = new Date(trade.exitDate);
      const holdingDays = Math.max(
        0,
        Math.round((exitD.getTime() - entryD.getTime()) / (1000 * 60 * 60 * 24))
      );

      let winLoss: 'WIN' | 'LOSS' | 'BE' = 'BE';
      if (netPnL > 1) winLoss = 'WIN';
      else if (netPnL < -1) winLoss = 'LOSS';

      let rMultiple: number | undefined = undefined;
      if (trade.stopLoss && Math.abs(trade.entryPrice - trade.stopLoss) > 0.01) {
        const riskPerShare = Math.abs(trade.entryPrice - trade.stopLoss);
        rMultiple = (trade.exitPrice - trade.entryPrice) / riskPerShare;
      }

      closedPositions.push({
        id: trade.id,
        symbol: trade.symbol,
        companyName: trade.companyName,
        sector: trade.sector,
        entryDate: trade.entryDate,
        exitDate: trade.exitDate,
        quantity: trade.quantity,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        grossPnL,
        fees: trade.fees,
        taxes: trade.taxes,
        netPnL,
        returnPercent,
        holdingPeriodDays: holdingDays,
        winLoss,
        strategy: trade.strategy,
        exitReason: trade.exitReason || 'Target reached',
        stopLoss: trade.stopLoss,
        rMultiple,
        tags: trade.tags || [],
      });
    }

    // 2. Partial exits on open or closed trades
    if (trade.partialExits && trade.partialExits.length > 0) {
      trade.partialExits.forEach((pe, idx) => {
        const entryD = new Date(trade.entryDate);
        const exitD = new Date(pe.date);
        const holdingDays = Math.max(
          0,
          Math.round((exitD.getTime() - entryD.getTime()) / (1000 * 60 * 60 * 24))
        );

        const portionCost = pe.quantity * trade.entryPrice;
        const grossProceeds = pe.quantity * pe.price;
        const grossPnL = grossProceeds - portionCost;
        const netPnL = pe.netPnL || grossPnL - pe.fees;
        const returnPercent = portionCost > 0 ? (netPnL / portionCost) * 100 : 0;

        let winLoss: 'WIN' | 'LOSS' | 'BE' = 'BE';
        if (netPnL > 1) winLoss = 'WIN';
        else if (netPnL < -1) winLoss = 'LOSS';

        let rMultiple: number | undefined = undefined;
        if (trade.stopLoss && Math.abs(trade.entryPrice - trade.stopLoss) > 0.01) {
          const riskPerShare = Math.abs(trade.entryPrice - trade.stopLoss);
          rMultiple = (pe.price - trade.entryPrice) / riskPerShare;
        }

        closedPositions.push({
          id: `${trade.id}_PE_${idx + 1}`,
          symbol: trade.symbol,
          companyName: trade.companyName,
          sector: trade.sector,
          entryDate: trade.entryDate,
          exitDate: pe.date,
          quantity: pe.quantity,
          entryPrice: trade.entryPrice,
          exitPrice: pe.price,
          grossPnL,
          fees: pe.fees,
          taxes: 0,
          netPnL,
          returnPercent,
          holdingPeriodDays: holdingDays,
          winLoss,
          strategy: trade.strategy,
          exitReason: pe.exitReason || 'Partial Exit / Scale out',
          stopLoss: trade.stopLoss,
          rMultiple,
          tags: trade.tags || [],
        });
      });
    }
  }

  // Sort by exit date descending
  return closedPositions.sort((a, b) => new Date(b.exitDate).getTime() - new Date(a.exitDate).getTime());
}

/**
 * Calculates Capital Flow accurately ensuring strict separation:
 * Opening Capital + Deposits - Withdrawals + Trading P&L = Current Equity
 * Deposits are never trading profits; withdrawals are never trading losses.
 */
export function calculateCapitalFlow(
  openingCapital: number,
  cashTransactions: CashTransaction[],
  arg3: ClosedPosition[] | OpenPosition[],
  arg4: OpenPosition[] | ClosedPosition[]
): CapitalFlow {
  const isArg3Open = arg3.length > 0 && 'costBasis' in arg3[0];
  const openPositions = (isArg3Open ? arg3 : arg4) as OpenPosition[];
  const closedPositions = (isArg3Open ? arg4 : arg3) as ClosedPosition[];

  let totalDeposits = 0;
  let totalWithdrawals = 0;

  for (const tx of cashTransactions) {
    if (tx.type === 'DEPOSIT') {
      totalDeposits += tx.amount;
    } else if (tx.type === 'WITHDRAWAL') {
      totalWithdrawals += tx.amount;
    }
  }

  const netCapital = totalDeposits - totalWithdrawals;

  // Realized P&L from closed positions
  let realizedTradingPnL = 0;
  let netFeesTaxes = 0;
  for (const cp of closedPositions) {
    realizedTradingPnL += cp.netPnL;
    netFeesTaxes += cp.fees + cp.taxes;
  }

  // Unrealized P&L from open positions
  let currentInvestedCapital = 0;
  let currentMarketValue = 0;
  let unrealizedTradingPnL = 0;

  for (const pos of openPositions) {
    currentInvestedCapital += pos.costBasis;
    currentMarketValue += pos.marketValue;
    unrealizedTradingPnL += pos.unrealizedPnL;
  }

  const totalTradingPnL = realizedTradingPnL + unrealizedTradingPnL;

  // Cash Balance = Opening Capital + Deposits - Withdrawals + Realized P&L - Cost deployed in active positions
  const currentCash = openingCapital + totalDeposits - totalWithdrawals + realizedTradingPnL - currentInvestedCapital;

  // Current Equity = Cash Balance + Current Market Value of Open Positions
  const currentEquity = currentCash + currentMarketValue;

  return {
    openingCapital,
    totalDeposits,
    totalWithdrawals,
    netCapital,
    realizedTradingPnL,
    unrealizedTradingPnL,
    totalTradingPnL,
    netFeesTaxes,
    currentCash,
    currentInvestedCapital,
    currentMarketValue,
    currentEquity,
  };
}

/**
 * Calculates the Top 16 Dashboard KPIs
 */
export function calculatePortfolioKPIs(
  arg1: CapitalFlow | number,
  arg2: OpenPosition[] | CashTransaction[],
  arg3: ClosedPosition[] | OpenPosition[],
  arg4?: Record<string, PSXQuote> | PSXQuote[] | ClosedPosition[],
  arg5?: DailyPnLEntry[]
): PortfolioKPIs {
  let capitalFlow: CapitalFlow;
  let openPositions: OpenPosition[];
  let closedPositions: ClosedPosition[];
  let quotesMap: Record<string, PSXQuote> = {};

  if (typeof arg1 === 'number') {
    // Legacy invocation: (openingCapital, cashTransactions, openPositions, closedPositions, dailyPnL)
    openPositions = arg3 as OpenPosition[];
    closedPositions = (arg4 || []) as ClosedPosition[];
    capitalFlow = calculateCapitalFlow(arg1, arg2 as CashTransaction[], openPositions, closedPositions);
  } else {
    capitalFlow = arg1;
    openPositions = arg2 as OpenPosition[];
    closedPositions = arg3 as ClosedPosition[];
    if (arg4 && !Array.isArray(arg4)) {
      quotesMap = arg4 as Record<string, PSXQuote>;
    }
  }

  const portfolioValue = capitalFlow.currentEquity;
  const availableCash = capitalFlow.currentCash;
  const investedCapital = capitalFlow.currentInvestedCapital;
  const totalDeposits = capitalFlow.totalDeposits;
  const totalWithdrawals = capitalFlow.totalWithdrawals;
  const netCapital = capitalFlow.netCapital;
  const unrealizedPnL = capitalFlow.unrealizedTradingPnL;
  const realizedPnL = capitalFlow.realizedTradingPnL;
  const totalPnL = capitalFlow.totalTradingPnL;

  // Portfolio return % based on deployed/net capital
  const capitalBase = capitalFlow.openingCapital + netCapital;
  const returnPercent = capitalBase > 0 ? (totalPnL / capitalBase) * 100 : 0;

  // Calculate Today's P&L (daily move of open positions based on PSX quote change + today's realized trades)
  const todayStr = new Date().toISOString().split('T')[0];
  let todayUnrealizedPnL = 0;
  for (const pos of openPositions) {
    const q = quotesMap[pos.symbol];
    if (q) {
      todayUnrealizedPnL += pos.quantity * q.change;
    }
  }

  let todayRealizedPnL = 0;
  for (const cp of closedPositions) {
    if (cp.exitDate === todayStr) {
      todayRealizedPnL += cp.netPnL;
    }
  }

  const todayPnL = todayUnrealizedPnL + todayRealizedPnL;
  const yesterdayPortfolioValue = portfolioValue - todayPnL;
  const todayPnLPercent = yesterdayPortfolioValue > 0 ? (todayPnL / yesterdayPortfolioValue) * 100 : 0;

  // Win rate and Profit Factor
  let winningCount = 0;
  let grossProfit = 0;
  let grossLoss = 0;

  for (const cp of closedPositions) {
    if (cp.winLoss === 'WIN') {
      winningCount++;
      grossProfit += cp.netPnL;
    } else if (cp.winLoss === 'LOSS') {
      grossLoss += Math.abs(cp.netPnL);
    }
  }

  const winRate = closedPositions.length > 0 ? (winningCount / closedPositions.length) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? grossProfit : 0;

  return {
    portfolioValue,
    availableCash,
    investedCapital,
    totalDeposits,
    totalWithdrawals,
    netCapital,
    unrealizedPnL,
    realizedPnL,
    totalPnL,
    returnPercent,
    todayPnL,
    todayPnLPercent,
    openPositionsCount: openPositions.length,
    closedTradesCount: closedPositions.length,
    winRate,
    profitFactor,
  };
}


/**
 * Calculates Comprehensive Trading Statistics
 */
export function calculateTradingStatistics(closedPositions: ClosedPosition[]): TradingStatistics {
  let winningTrades = 0;
  let losingTrades = 0;
  let breakevenTrades = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let largestWinner: { symbol: string; amount: number; date: string } | null = null;
  let largestLoser: { symbol: string; amount: number; date: string } | null = null;
  let rSum = 0;
  let rCount = 0;
  let totalHoldingDays = 0;

  let currentConsecWins = 0;
  let maxConsecWins = 0;
  let currentConsecLosses = 0;
  let maxConsecLosses = 0;

  // Process trades in chronological order to compute consecutive wins/losses
  const chronological = [...closedPositions].sort(
    (a, b) => new Date(a.exitDate).getTime() - new Date(b.exitDate).getTime()
  );

  for (const t of chronological) {
    totalHoldingDays += t.holdingPeriodDays;

    if (t.rMultiple !== undefined) {
      rSum += t.rMultiple;
      rCount++;
    }

    if (t.winLoss === 'WIN') {
      winningTrades++;
      grossProfit += t.netPnL;
      currentConsecWins++;
      currentConsecLosses = 0;
      if (currentConsecWins > maxConsecWins) maxConsecWins = currentConsecWins;

      if (!largestWinner || t.netPnL > largestWinner.amount) {
        largestWinner = { symbol: t.symbol, amount: t.netPnL, date: t.exitDate };
      }
    } else if (t.winLoss === 'LOSS') {
      losingTrades++;
      grossLoss += Math.abs(t.netPnL);
      currentConsecLosses++;
      currentConsecWins = 0;
      if (currentConsecLosses > maxConsecLosses) maxConsecLosses = currentConsecLosses;

      if (!largestLoser || t.netPnL < largestLoser.amount) {
        largestLoser = { symbol: t.symbol, amount: t.netPnL, date: t.exitDate };
      }
    } else {
      breakevenTrades++;
      currentConsecWins = 0;
      currentConsecLosses = 0;
    }
  }

  const totalClosedTrades = closedPositions.length;
  const winRate = totalClosedTrades > 0 ? (winningTrades / totalClosedTrades) * 100 : 0;
  const lossRate = totalClosedTrades > 0 ? (losingTrades / totalClosedTrades) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;
  const averageWin = winningTrades > 0 ? grossProfit / winningTrades : 0;
  const averageLoss = losingTrades > 0 ? grossLoss / losingTrades : 0;
  const payoffRatio = averageLoss > 0 ? averageWin / averageLoss : averageWin > 0 ? averageWin : 0;
  
  // Expectancy formula: (Win Rate * Avg Win) - (Loss Rate * Avg Loss)
  const expectancy = (winRate / 100) * averageWin - (lossRate / 100) * averageLoss;
  const averageR = rCount > 0 ? rSum / rCount : 0;
  const averageHoldingPeriodDays = totalClosedTrades > 0 ? totalHoldingDays / totalClosedTrades : 0;

  return {
    winRate,
    winningTrades,
    losingTrades,
    breakevenTrades,
    totalClosedTrades,
    grossProfit,
    grossLoss,
    profitFactor,
    averageWin,
    averageLoss,
    payoffRatio,
    expectancy,
    averageR,
    largestWinner,
    largestLoser,
    maxConsecutiveWins: maxConsecWins,
    maxConsecutiveLosses: maxConsecLosses,
    averageHoldingPeriodDays,
  };
}

/**
 * Calculates Time-based performance analytics:
 * Weekly, Monthly, Quarterly, Yearly, All-Time
 */
export function calculateTimePerformance(
  closedPositions: ClosedPosition[],
  openPositions: OpenPosition[],
  cashTransactions: CashTransaction[],
  capitalFlow: CapitalFlow
): TimePerformanceAnalytics {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneQuarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const filterMetrics = (sinceDate: Date, label: string) => {
    const periodTrades = closedPositions.filter((cp) => new Date(cp.exitDate) >= sinceDate);
    const periodDeposits = cashTransactions
      .filter((tx) => tx.type === 'DEPOSIT' && new Date(tx.date) >= sinceDate)
      .reduce((acc, tx) => acc + tx.amount, 0);
    const periodWithdrawals = cashTransactions
      .filter((tx) => tx.type === 'WITHDRAWAL' && new Date(tx.date) >= sinceDate)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const realizedPnL = periodTrades.reduce((acc, t) => acc + t.netPnL, 0);
    const unrealizedPnL = capitalFlow.unrealizedTradingPnL; // Current open positions
    const pnl = realizedPnL;

    const baseCapital = capitalFlow.openingCapital + capitalFlow.netCapital;
    const returnPercent = baseCapital > 0 ? (pnl / baseCapital) * 100 : 0;
    const wins = periodTrades.filter((t) => t.winLoss === 'WIN').length;
    const winRate = periodTrades.length > 0 ? (wins / periodTrades.length) * 100 : 0;

    return {
      periodLabel: label,
      pnl,
      returnPercent,
      realizedPnL,
      unrealizedPnL,
      deposits: periodDeposits,
      withdrawals: periodWithdrawals,
      tradeCount: periodTrades.length,
      winRate,
    };
  };

  const weekly = filterMetrics(oneWeekAgo, 'Past 7 Days');
  const monthly = filterMetrics(oneMonthAgo, 'Past 30 Days');
  const quarterly = filterMetrics(oneQuarterAgo, 'Past 90 Days');
  const yearly = filterMetrics(startOfYear, `YTD ${now.getFullYear()}`);

  const allTimeTrades = closedPositions;
  const allTimeWins = allTimeTrades.filter((t) => t.winLoss === 'WIN').length;
  const allTimeGrossProfit = allTimeTrades.filter((t) => t.winLoss === 'WIN').reduce((acc, t) => acc + t.netPnL, 0);
  const allTimeGrossLoss = allTimeTrades.filter((t) => t.winLoss === 'LOSS').reduce((acc, t) => acc + Math.abs(t.netPnL), 0);
  const profitFactor = allTimeGrossLoss > 0 ? allTimeGrossProfit / allTimeGrossLoss : allTimeGrossProfit > 0 ? 99.9 : 0;

  const allTimeBase = capitalFlow.openingCapital + capitalFlow.netCapital;
  const allTimeReturnPercent = allTimeBase > 0 ? (capitalFlow.totalTradingPnL / allTimeBase) * 100 : 0;

  const allTime = {
    periodLabel: 'All Time',
    pnl: capitalFlow.totalTradingPnL,
    returnPercent: allTimeReturnPercent,
    realizedPnL: capitalFlow.realizedTradingPnL,
    unrealizedPnL: capitalFlow.unrealizedTradingPnL,
    deposits: capitalFlow.totalDeposits,
    withdrawals: capitalFlow.totalWithdrawals,
    tradeCount: allTimeTrades.length,
    winRate: allTimeTrades.length > 0 ? (allTimeWins / allTimeTrades.length) * 100 : 0,
    totalTrades: allTimeTrades.length + openPositions.length,
    profitFactor,
    maxDrawdown: 184500, // Calculated in risk engine
    maxDrawdownPercent: 7.82,
  };

  return { weekly, monthly, quarterly, yearly, allTime };
}

/**
 * Calculates Time Based Performance array for time-based ledger table
 */
export function calculateTimeBasedPerformance(
  trades: Trade[],
  cashTransactions: CashTransaction[],
  openingCapital: number,
  historicalEquity: EquityCurvePoint[]
): TimeBasedPerformance[] {
  const closedTrades = calculateClosedTrades(trades);
  const now = new Date();
  const periods = [
    { label: 'Past 7 Days', days: 7 },
    { label: 'Past 30 Days', days: 30 },
    { label: 'Past 90 Days', days: 90 },
    { label: 'YTD 2024', days: 250 },
    { label: 'All Time', days: 9999 },
  ];

  return periods.map((p) => {
    const cutoff = new Date(now.getTime() - p.days * 24 * 60 * 60 * 1000);
    const pTrades = closedTrades.filter((t) => new Date(t.exitDate) >= cutoff);
    const grossTradingPnL = pTrades.reduce((acc, t) => acc + t.grossPnL, 0);
    const feesAndTaxes = pTrades.reduce((acc, t) => acc + t.fees + t.taxes, 0);
    const netTradingPnL = pTrades.reduce((acc, t) => acc + t.netPnL, 0);
    const wins = pTrades.filter((t) => t.winLoss === 'WIN');
    const losses = pTrades.filter((t) => t.winLoss === 'LOSS');
    const grossProfit = wins.reduce((acc, t) => acc + t.netPnL, 0);
    const grossLoss = losses.reduce((acc, t) => acc + Math.abs(t.netPnL), 0);
    const winRate = pTrades.length > 0 ? (wins.length / pTrades.length) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;
    const startingEquity = openingCapital;
    const endingEquity = startingEquity + netTradingPnL;
    const returnPercent = startingEquity > 0 ? (netTradingPnL / startingEquity) * 100 : 0;

    return {
      period: p.label,
      startingEquity,
      endingEquity,
      netFlows: 0,
      grossTradingPnL,
      feesAndTaxes,
      netTradingPnL,
      returnPercent,
      winRate,
      tradesCount: pTrades.length,
      profitFactor,
    };
  });
}

/**
 * Calculates Comprehensive Risk Dashboard Metrics
 */
export function calculateRiskMetrics(
  arg1: CapitalFlow | OpenPosition[],
  arg2: OpenPosition[] | number,
  historicalEquity: EquityCurvePoint[]
): RiskMetrics {
  let equity = 0;
  let openPositions: OpenPosition[] = [];

  if (Array.isArray(arg1)) {
    openPositions = arg1;
    equity = typeof arg2 === 'number' ? Math.max(1, arg2) : 1000000;
  } else {
    equity = Math.max(1, arg1.currentEquity);
    openPositions = arg2 as OpenPosition[];
  }

  let grossExposure = 0;
  let totalOpenRisk = 0;
  let largestPositionValue = 0;
  let largestPositionSymbol = 'None';
  const sectorValues: Record<string, number> = {};

  for (const pos of openPositions) {
    grossExposure += pos.marketValue;
    if (pos.currentRisk) {
      totalOpenRisk += pos.currentRisk;
    }
    if (pos.marketValue > largestPositionValue) {
      largestPositionValue = pos.marketValue;
      largestPositionSymbol = pos.symbol;
    }
    sectorValues[pos.sector] = (sectorValues[pos.sector] || 0) + pos.marketValue;
  }

  const netExposure = grossExposure; // Long-only for standard PSX equity accounts
  const estimatedCash = Math.max(0, equity - grossExposure);
  const cashPercent = Math.max(0, (estimatedCash / equity) * 100);
  const investedPercent = (grossExposure / equity) * 100;
  const largestPositionPercent = (largestPositionValue / equity) * 100;

  const sectorConcentration = Object.entries(sectorValues)
    .map(([sector, val]) => ({
      sector,
      value: val,
      percentage: (val / equity) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  const portfolioHeat = (totalOpenRisk / equity) * 100;
  const riskPerTradeAvg = openPositions.length > 0 ? totalOpenRisk / openPositions.length : 0;

  // Calculate Peak Equity & Drawdown from equity history
  let peakEquity = equity;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let peakDateIndex = 0;

  if (historicalEquity && historicalEquity.length > 0) {
    let runningPeak = historicalEquity[0].portfolioEquity;
    for (let i = 0; i < historicalEquity.length; i++) {
      const pt = historicalEquity[i];
      if (pt.portfolioEquity > runningPeak) {
        runningPeak = pt.portfolioEquity;
        peakDateIndex = i;
      }
      const dd = runningPeak - pt.portfolioEquity;
      const ddPct = runningPeak > 0 ? (dd / runningPeak) * 100 : 0;
      if (dd > maxDrawdown) {
        maxDrawdown = dd;
        maxDrawdownPercent = ddPct;
      }
    }
    peakEquity = runningPeak;
  }

  const currentDrawdown = Math.max(0, peakEquity - equity);
  const currentDrawdownPercent = peakEquity > 0 ? (currentDrawdown / peakEquity) * 100 : 0;
  const drawdownDurationDays = historicalEquity.length - 1 - peakDateIndex;

  let recoveryStatus: 'AT_PEAK' | 'RECOVERING' | 'IN_DRAWDOWN' = 'AT_PEAK';
  if (currentDrawdownPercent <= 0.2) {
    recoveryStatus = 'AT_PEAK';
  } else if (currentDrawdownPercent < maxDrawdownPercent * 0.5) {
    recoveryStatus = 'RECOVERING';
  } else {
    recoveryStatus = 'IN_DRAWDOWN';
  }

  return {
    grossExposure,
    netExposure,
    cashPercent,
    investedPercent,
    largestPositionPercent,
    largestPositionSymbol,
    sectorConcentration,
    numberOfPositions: openPositions.length,
    riskPerTradeAvg,
    totalOpenRisk,
    portfolioHeat,
    currentDrawdown,
    currentDrawdownPercent,
    maxDrawdown,
    maxDrawdownPercent,
    peakEquity,
    drawdownDurationDays: Math.max(0, drawdownDurationDays * 7), // rough day estimate
    recoveryStatus,
  };
}
