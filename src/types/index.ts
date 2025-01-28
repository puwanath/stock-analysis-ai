export interface StockQuote {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketVolume: number;
    marketCap: number;
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
  
  export interface StockAnalysis {
    basicInfo: {
      currentPrice: number;
      change: number;
      percentChange: number;
      volume: number;
      marketCap: number;
    };
    technical: TechnicalIndicators;
    historical: HistoricalData[];
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }