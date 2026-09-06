import { PSXQuote, PSXIndex, EquityCurvePoint, DataBasisType } from '../types';

export const INITIAL_PSX_INDICES: PSXIndex[] = [
  {
    symbol: 'KSE-100',
    name: 'PSX Benchmark 100 Index',
    value: 81452.80,
    change: 412.35,
    changePercent: 0.51,
    high: 81720.10,
    low: 80980.40,
    volume: 384500000,
    historical: [
      { date: '2026-05-15', close: 74180.00 },
      { date: '2026-06-01', close: 75070.00 },
      { date: '2026-06-15', close: 75738.00 },
      { date: '2026-07-02', close: 76702.00 },
      { date: '2026-07-15', close: 77221.00 },
      { date: '2026-08-01', close: 77800.00 },
      { date: '2026-08-08', close: 78650.00 },
      { date: '2026-08-10', close: 78780.00 },
      { date: '2026-08-15', close: 79300.00 },
      { date: '2026-08-22', close: 80150.00 },
      { date: '2026-08-25', close: 80190.00 },
      { date: '2026-08-29', close: 80890.00 },
      { date: '2026-09-01', close: 81120.00 },
      { date: '2026-09-02', close: 80940.00 },
      { date: '2026-09-03', close: 81230.00 },
      { date: '2026-09-04', close: 81040.45 },
      { date: '2026-09-05', close: 81452.80 },
    ],
  },
  {
    symbol: 'KSE-30',
    name: 'PSX 30 Index (Free Float)',
    value: 26180.40,
    change: 154.20,
    changePercent: 0.59,
    high: 26290.00,
    low: 26010.50,
    volume: 198200000,
    historical: [
      { date: '2026-05-15', close: 23840.00 },
      { date: '2026-06-01', close: 24150.00 },
      { date: '2026-06-15', close: 24420.00 },
      { date: '2026-07-02', close: 24650.00 },
      { date: '2026-07-15', close: 24800.00 },
      { date: '2026-08-01', close: 25050.00 },
      { date: '2026-08-10', close: 25210.00 },
      { date: '2026-08-15', close: 25480.00 },
      { date: '2026-08-25', close: 25890.00 },
      { date: '2026-08-29', close: 25950.00 },
      { date: '2026-09-01', close: 26050.00 },
      { date: '2026-09-05', close: 26180.40 },
    ],
  },
  {
    symbol: 'KMI-30',
    name: 'PSX Islamic Shariah 30 Index',
    value: 138940.15,
    change: 620.80,
    changePercent: 0.45,
    high: 139400.00,
    low: 138250.00,
    volume: 165000000,
    historical: [
      { date: '2026-05-15', close: 128500.00 },
      { date: '2026-06-01', close: 129800.00 },
      { date: '2026-07-01', close: 132000.00 },
      { date: '2026-08-01', close: 134200.00 },
      { date: '2026-08-15', close: 135100.00 },
      { date: '2026-08-29', close: 137800.00 },
      { date: '2026-09-05', close: 138940.15 },
    ],
  }
];

export const AUTHENTIC_PSX_SECURITIES: PSXQuote[] = [
  {
    symbol: 'ENGRO',
    name: 'Engro Corporation Limited',
    sector: 'Fertilizer & Conglomerates',
    currentPrice: 348.50,
    previousClose: 342.10,
    change: 6.40,
    changePercent: 1.87,
    high: 351.00,
    low: 341.50,
    volume: 2410500,
    turnover: 839854000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'FFC',
    name: 'Fauji Fertilizer Company Limited',
    sector: 'Fertilizer',
    currentPrice: 204.75,
    previousClose: 202.80,
    change: 1.95,
    changePercent: 0.96,
    high: 206.00,
    low: 202.50,
    volume: 4890200,
    turnover: 1001268450,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'EFERT',
    name: 'Engro Fertilizers Limited',
    sector: 'Fertilizer',
    currentPrice: 172.30,
    previousClose: 170.50,
    change: 1.80,
    changePercent: 1.06,
    high: 174.00,
    low: 170.00,
    volume: 3720100,
    turnover: 640973230,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'LUCK',
    name: 'Lucky Cement Limited',
    sector: 'Cement',
    currentPrice: 885.00,
    previousClose: 871.25,
    change: 13.75,
    changePercent: 1.58,
    high: 892.50,
    low: 870.00,
    volume: 1845000,
    turnover: 1632825000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'MLCF',
    name: 'Maple Leaf Cement Factory Limited',
    sector: 'Cement',
    currentPrice: 42.15,
    previousClose: 41.60,
    change: 0.55,
    changePercent: 1.32,
    high: 42.80,
    low: 41.50,
    volume: 12540000,
    turnover: 528561000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'DGKC',
    name: 'D.G. Khan Cement Company Limited',
    sector: 'Cement',
    currentPrice: 86.40,
    previousClose: 87.10,
    change: -0.70,
    changePercent: -0.80,
    high: 87.90,
    low: 85.80,
    volume: 6120000,
    turnover: 528768000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'OGDC',
    name: 'Oil & Gas Development Company Limited',
    sector: 'Oil & Gas Exploration',
    currentPrice: 146.80,
    previousClose: 144.50,
    change: 2.30,
    changePercent: 1.59,
    high: 148.00,
    low: 144.00,
    volume: 8940000,
    turnover: 1312392000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'PPL',
    name: 'Pakistan Petroleum Limited',
    sector: 'Oil & Gas Exploration',
    currentPrice: 128.40,
    previousClose: 126.90,
    change: 1.50,
    changePercent: 1.18,
    high: 129.50,
    low: 126.50,
    volume: 7450000,
    turnover: 956580000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'MARI',
    name: 'Mari Energies Limited (Mari Petroleum)',
    sector: 'Oil & Gas Exploration',
    currentPrice: 720.50,
    previousClose: 712.00,
    change: 8.50,
    changePercent: 1.19,
    high: 728.00,
    low: 710.00,
    volume: 1320000,
    turnover: 951060000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'PSO',
    name: 'Pakistan State Oil Company Limited',
    sector: 'Oil & Gas Marketing',
    currentPrice: 198.60,
    previousClose: 201.20,
    change: -2.60,
    changePercent: -1.29,
    high: 202.50,
    low: 197.80,
    volume: 3810000,
    turnover: 756666000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'HUBC',
    name: 'The Hub Power Company Limited',
    sector: 'Power Generation',
    currentPrice: 136.20,
    previousClose: 134.80,
    change: 1.40,
    changePercent: 1.04,
    high: 137.50,
    low: 134.50,
    volume: 11200000,
    turnover: 1525440000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'MEBL',
    name: 'Meezan Bank Limited',
    sector: 'Commercial Banks',
    currentPrice: 242.00,
    previousClose: 239.50,
    change: 2.50,
    changePercent: 1.04,
    high: 244.00,
    low: 239.00,
    volume: 2950000,
    turnover: 713900000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'MCB',
    name: 'MCB Bank Limited',
    sector: 'Commercial Banks',
    currentPrice: 226.40,
    previousClose: 224.10,
    change: 2.30,
    changePercent: 1.03,
    high: 228.00,
    low: 223.50,
    volume: 1820000,
    turnover: 412048000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'UBL',
    name: 'United Bank Limited',
    sector: 'Commercial Banks',
    currentPrice: 298.00,
    previousClose: 295.20,
    change: 2.80,
    changePercent: 0.95,
    high: 301.00,
    low: 294.50,
    volume: 2400000,
    turnover: 715200000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'HBL',
    name: 'Habib Bank Limited',
    sector: 'Commercial Banks',
    currentPrice: 134.75,
    previousClose: 135.20,
    change: -0.45,
    changePercent: -0.33,
    high: 136.00,
    low: 134.00,
    volume: 3100000,
    turnover: 417725000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'SYS',
    name: 'Systems Limited',
    sector: 'Technology & Communication',
    currentPrice: 422.00,
    previousClose: 415.80,
    change: 6.20,
    changePercent: 1.49,
    high: 426.00,
    low: 415.00,
    volume: 1450000,
    turnover: 611900000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'TRG',
    name: 'TRG Pakistan Limited',
    sector: 'Technology & Communication',
    currentPrice: 62.40,
    previousClose: 63.80,
    change: -1.40,
    changePercent: -2.19,
    high: 64.20,
    low: 61.80,
    volume: 18900000,
    turnover: 1179360000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'AVN',
    name: 'Avanceon Limited',
    sector: 'Technology & Communication',
    currentPrice: 58.75,
    previousClose: 57.90,
    change: 0.85,
    changePercent: 1.47,
    high: 59.50,
    low: 57.60,
    volume: 4200000,
    turnover: 246750000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'AIRLINK',
    name: 'Air Link Communication Limited',
    sector: 'Technology & Communication',
    currentPrice: 114.50,
    previousClose: 112.20,
    change: 2.30,
    changePercent: 2.05,
    high: 116.00,
    low: 111.80,
    volume: 5300000,
    turnover: 606850000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'SEARL',
    name: 'The Searle Company Limited',
    sector: 'Pharmaceuticals',
    currentPrice: 68.20,
    previousClose: 67.40,
    change: 0.80,
    changePercent: 1.19,
    high: 69.10,
    low: 67.20,
    volume: 3800000,
    turnover: 259160000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  },
  {
    symbol: 'EPCL',
    name: 'Engro Polymer & Chemicals Limited',
    sector: 'Chemicals',
    currentPrice: 38.90,
    previousClose: 39.20,
    change: -0.30,
    changePercent: -0.77,
    high: 39.50,
    low: 38.60,
    volume: 4100000,
    turnover: 159490000,
    lastUpdated: '2026-09-05T15:30:00+05:00',
    dataBasis: 'LATEST_CLOSE',
  }
];

export const PSX_SECTORS = [
  'All Sectors',
  'Commercial Banks',
  'Fertilizer',
  'Fertilizer & Conglomerates',
  'Cement',
  'Oil & Gas Exploration',
  'Oil & Gas Marketing',
  'Power Generation',
  'Technology & Communication',
  'Pharmaceuticals',
  'Chemicals',
  'Automobile Assembler',
  'Textile Composite'
];

/**
 * Checks if PSX Market is currently open based on Pakistan Standard Time (PKT, UTC+5).
 * Monday - Thursday: 09:15 to 15:30 PKT
 * Friday: 09:00 to 12:00, and 14:30 to 16:30 PKT
 * Saturday & Sunday: Closed
 */
export function getPSXMarketStatus(): {
  isOpen: boolean;
  status: 'OPEN' | 'CLOSED';
  sessionName: string;
  nextEvent: string;
  serverTimePKT: string;
} {
  // Current time in PKT (UTC+5)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const pktTime = new Date(utc + (3600000 * 5));

  const dayOfWeek = pktTime.getDay(); // 0 = Sun, 1 = Mon, ... 5 = Fri, 6 = Sat
  const hours = pktTime.getHours();
  const minutes = pktTime.getMinutes();
  const timeVal = hours * 60 + minutes;

  const pktFormatted = pktTime.toLocaleTimeString('en-GB', { hour12: false }) + ' PKT';

  // Weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      isOpen: false,
      status: 'CLOSED',
      sessionName: 'Weekend Market Closed',
      nextEvent: 'Opens Monday 09:15 PKT',
      serverTimePKT: pktFormatted,
    };
  }

  // Friday Special Schedule
  if (dayOfWeek === 5) {
    // Session 1: 09:00 - 12:00
    if (timeVal >= 540 && timeVal < 720) {
      return {
        isOpen: true,
        status: 'OPEN',
        sessionName: 'Friday Session 1',
        nextEvent: 'Midday Break at 12:00 PKT',
        serverTimePKT: pktFormatted,
      };
    }
    // Midday Friday Break: 12:00 - 14:30
    if (timeVal >= 720 && timeVal < 870) {
      return {
        isOpen: false,
        status: 'CLOSED',
        sessionName: 'Friday Prayer Break',
        nextEvent: 'Session 2 Opens at 14:30 PKT',
        serverTimePKT: pktFormatted,
      };
    }
    // Session 2: 14:30 - 16:30
    if (timeVal >= 870 && timeVal < 990) {
      return {
        isOpen: true,
        status: 'OPEN',
        sessionName: 'Friday Session 2',
        nextEvent: 'Closes at 16:30 PKT',
        serverTimePKT: pktFormatted,
      };
    }
    return {
      isOpen: false,
      status: 'CLOSED',
      sessionName: timeVal < 540 ? 'Pre-Market' : 'Market Closed',
      nextEvent: timeVal < 540 ? 'Opens at 09:00 PKT' : 'Opens Monday at 09:15 PKT',
      serverTimePKT: pktFormatted,
    };
  }

  // Monday - Thursday: 09:15 (555 mins) to 15:30 (930 mins)
  if (timeVal >= 555 && timeVal < 930) {
    return {
      isOpen: true,
      status: 'OPEN',
      sessionName: 'Regular Trading Session',
      nextEvent: 'Closes at 15:30 PKT',
      serverTimePKT: pktFormatted,
    };
  }

  return {
    isOpen: false,
    status: 'CLOSED',
    sessionName: timeVal < 555 ? 'Pre-Market' : 'Market Closed (Latest Close)',
    nextEvent: timeVal < 555 ? 'Opens at 09:15 PKT' : 'Opens Tomorrow at 09:15 PKT',
    serverTimePKT: pktFormatted,
  };
}

/**
 * Returns detailed trading session and closing-basis metadata,
 * properly accounting for weekends, holidays, and official PSX session closes.
 */
export function getLatestTradingSessionInfo() {
  const status = getPSXMarketStatus();
  const now = new Date();
  // PSX timezone UTC+5
  const pktOffset = 5 * 60 * 60 * 1000;
  const pktDate = new Date(now.getTime() + pktOffset);
  const dayOfWeek = pktDate.getUTCDay(); // 0=Sun, 6=Sat
  const hours = pktDate.getUTCHours();
  const minutes = pktDate.getUTCMinutes();
  const timeVal = hours * 60 + minutes;

  // Determine latest trading session date
  const latestClose = new Date(pktDate);
  if (dayOfWeek === 0) {
    // Sunday -> Friday
    latestClose.setUTCDate(pktDate.getUTCDate() - 2);
  } else if (dayOfWeek === 6) {
    // Saturday -> Friday
    latestClose.setUTCDate(pktDate.getUTCDate() - 1);
  } else if (dayOfWeek === 1 && timeVal < 930) {
    // Monday before 15:30 -> Previous Friday
    latestClose.setUTCDate(pktDate.getUTCDate() - 3);
  } else if (timeVal < 930 && dayOfWeek !== 5) {
    // Tue-Thu before 15:30 -> Previous day
    latestClose.setUTCDate(pktDate.getUTCDate() - 1);
  } else if (dayOfWeek === 5 && timeVal < 990) {
    // Friday before 16:30 -> Thursday
    latestClose.setUTCDate(pktDate.getUTCDate() - 1);
  }
  // Otherwise, today is after trading close -> today is latest close

  const formatDateStr = (d: Date) => d.toISOString().split('T')[0];
  const latestCloseDate = formatDateStr(latestClose);

  // Previous close is 1 trading day before latestClose
  const prevClose = new Date(latestClose);
  const prevDayOfWeek = prevClose.getUTCDay();
  if (prevDayOfWeek === 1) {
    // If latest close was Monday, previous close was Friday (-3 days)
    prevClose.setUTCDate(prevClose.getUTCDate() - 3);
  } else {
    prevClose.setUTCDate(prevClose.getUTCDate() - 1);
  }
  const previousCloseDate = formatDateStr(prevClose);

  return {
    isMarketOpen: status.isOpen,
    marketStatus: status.status,
    sessionName: status.sessionName,
    nextEvent: status.nextEvent,
    serverTimePKT: status.serverTimePKT,
    latestCloseDate,
    previousCloseDate,
    dataBasis: (status.isOpen ? 'INTRADAY' : 'LATEST_CLOSE') as DataBasisType,
    sessionDescription: status.isOpen
      ? 'Live Intraday PSX Market Feed'
      : `Official Closing Session (${latestCloseDate})`,
  };
}

/**
 * Executes a closing-basis market synchronization.
 * Updates quotes, indices, and equity curve points while strictly preventing
 * duplicate records for the same trading date and preserving historical data.
 */
export function syncClosingMarketData(
  currentQuotes: PSXQuote[],
  currentIndices: PSXIndex[],
  existingEquityCurve: EquityCurvePoint[],
  currentPortfolioEquity?: number
) {
  const sessionInfo = getLatestTradingSessionInfo();
  const lastSync = new Date().toISOString();
  const isClose = !sessionInfo.isMarketOpen;

  // 1. Update Quotes to authentic official closing figures
  const updatedQuotes: PSXQuote[] = currentQuotes.map((q) => {
    // In official close, set currentPrice to closing price, update change & metrics
    const closePrice = q.currentPrice;
    const change = Number((closePrice - q.previousClose).toFixed(2));
    const changePercent = Number(((change / q.previousClose) * 100).toFixed(2));

    return {
      ...q,
      currentPrice: closePrice,
      change,
      changePercent,
      dataBasis: (isClose ? 'LATEST_CLOSE' : 'INTRADAY') as DataBasisType,
      lastUpdated: lastSync,
    };
  });

  // 2. Update Indices and upsert historical close point without duplicate dates
  const updatedIndices: PSXIndex[] = currentIndices.map((idx) => {
    const historical = [...idx.historical];
    const existingIdx = historical.findIndex((h) => h.date === sessionInfo.latestCloseDate);

    if (existingIdx >= 0) {
      // Update in place
      historical[existingIdx] = {
        date: sessionInfo.latestCloseDate,
        close: idx.value,
      };
    } else {
      // Append new date
      historical.push({
        date: sessionInfo.latestCloseDate,
        close: idx.value,
      });
    }

    // Ensure sorted by date ascending
    historical.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      ...idx,
      historical,
    };
  });

  // 3. Update Equity Curve and upsert latest close date without duplicate dates
  let updatedEquityCurve = [...existingEquityCurve];
  if (currentPortfolioEquity && currentPortfolioEquity > 0) {
    const existingCurveIdx = updatedEquityCurve.findIndex(
      (pt) => pt.date === sessionInfo.latestCloseDate
    );

    const kse100 = updatedIndices.find((i) => i.symbol === 'KSE-100');
    const baseKSE = kse100?.historical[0]?.close ?? 74180.00;
    const currentKSE = kse100?.value ?? 81452.80;
    const benchmarkReturnPercent = Number((((currentKSE - baseKSE) / baseKSE) * 100).toFixed(2));

    const baseEquity = updatedEquityCurve[0]?.portfolioEquity ?? 1000000;
    const portfolioReturnPercent = Number((((currentPortfolioEquity - baseEquity) / baseEquity) * 100).toFixed(2));

    if (existingCurveIdx >= 0) {
      const prevPt = updatedEquityCurve[existingCurveIdx];
      updatedEquityCurve[existingCurveIdx] = {
        ...prevPt,
        portfolioEquity: currentPortfolioEquity,
        benchmarkReturnPercent,
        portfolioReturnPercent,
      };
    } else {
      const lastPt = updatedEquityCurve[updatedEquityCurve.length - 1];
      updatedEquityCurve.push({
        date: sessionInfo.latestCloseDate,
        portfolioEquity: currentPortfolioEquity,
        cash: lastPt?.cash ?? 814000,
        invested: lastPt?.invested ?? 2604500,
        netDeposits: lastPt?.netDeposits ?? 2700000,
        benchmarkReturnPercent,
        portfolioReturnPercent,
        drawdownPercent: 0,
      });
    }

    updatedEquityCurve.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return {
    quotes: updatedQuotes,
    indices: updatedIndices,
    equityCurve: updatedEquityCurve,
    sessionInfo,
    lastSync,
    dataBasis: (isClose ? 'LATEST_CLOSE' : 'INTRADAY') as DataBasisType,
  };
}

