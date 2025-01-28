export interface ChartConfig {
    timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
    indicators: string[];
    showVolume: boolean;
  }