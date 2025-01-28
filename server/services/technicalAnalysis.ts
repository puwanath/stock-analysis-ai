import { HistoricalData, TechnicalIndicators } from '../types';

export class TechnicalAnalysisService {
  calculateIndicators(data: HistoricalData[]): TechnicalIndicators {
    return {
      sma50: this.calculateSMA(data, 50),
      sma200: this.calculateSMA(data, 200),
      rsi: this.calculateRSI(data, 14),
      macd: this.calculateMACD(data),
      trend: this.determineTrend(data),
      support: this.findSupport(data),
      resistance: this.findResistance(data)
    };
  }

  private calculateSMA(data: HistoricalData[], period: number): number {
    if (data.length < period) return 0;
    const prices = data.slice(-period).map(d => d.close);
    return prices.reduce((a, b) => a + b) / period;
  }

  private calculateRSI(data: HistoricalData[], period: number): number {
    if (data.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = data[data.length - i].close - data[data.length - i - 1].close;
      if (change >= 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    return 100 - (100 / (1 + (avgGain / avgLoss)));
  }

  private calculateMACD(data: HistoricalData[]): { macdLine: number; signalLine: number; histogram: number } {
    const ema12 = this.calculateEMA(data, 12);
    const ema26 = this.calculateEMA(data, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA(data.map(d => ({ ...d, close: macdLine })), 9);
    
    return {
      macdLine,
      signalLine,
      histogram: macdLine - signalLine
    };
  }

  private calculateEMA(data: HistoricalData[], period: number): number {
    const k = 2 / (period + 1);
    let ema = data[0].close;

    for (let i = 1; i < data.length; i++) {
      ema = data[i].close * k + ema * (1 - k);
    }

    return ema;
  }

  private determineTrend(data: HistoricalData[]): 'bullish' | 'bearish' | 'neutral' {
    const sma20 = this.calculateSMA(data, 20);
    const sma50 = this.calculateSMA(data, 50);
    const currentPrice = data[data.length - 1].close;

    if (currentPrice > sma20 && sma20 > sma50) return 'bullish';
    if (currentPrice < sma20 && sma20 < sma50) return 'bearish';
    return 'neutral';
  }

  private findSupport(data: HistoricalData[]): number {
    const prices = data.map(d => d.low);
    return Math.min(...prices);
  }

  private findResistance(data: HistoricalData[]): number {
    const prices = data.map(d => d.high);
    return Math.max(...prices);
  }
}