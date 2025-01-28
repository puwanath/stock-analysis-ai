export interface StockQuote {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketVolume: number;
    marketCap: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
  }
  
  export interface HistoricalData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  export interface TechnicalIndicators {
    sma50: number;
    sma200: number;
    rsi: number;
    macd: {
      macdLine: number;
      signalLine: number;
      histogram: number;
    };
    trend: 'bullish' | 'bearish' | 'neutral';
    support: number;
    resistance: number;
  }
  
  export interface AIAnalysis {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
    priceTargets: {
      entry: number;
      exit: number;
      stopLoss: number;
    };
    riskFactors: string[];
    catalysts: string[];
  }
  
  export interface StockAnalysis {
    basicInfo: StockQuote;
    technical: TechnicalIndicators;
    historical: HistoricalData[];
    fundamentals: {
      pe: number;
      eps: number;
      dividendYield: number;
      beta: number;
    };
    aiAnalysis: AIAnalysis;
  }

  export interface TechnicalData {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    sma: {
      sma20: number;
      sma50: number;
      sma200: number;
    };
    trend: 'bullish' | 'bearish' | 'neutral';
    support: number;
    resistance: number;
    volumes: {
      current: number;
      average: number;
    };
  }

  export interface StockData {
    basicInfo: {
      currentPrice: number;
      change: number;
      percentChange: number;
      volume: number;
      marketCap: number;
    };
    technical: TechnicalData;
    historical: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>;
    aiAnalysis?: {
      recommendation: 'BUY' | 'SELL' | 'HOLD';
      confidence: number;
      targetPrice: number;
      stopLoss: number;
      reasoning: string;
      risks: string[];
    };
  }
  