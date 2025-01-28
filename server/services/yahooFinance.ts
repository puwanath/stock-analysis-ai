import yahooFinance from 'yahoo-finance2';
import { StockQuote, HistoricalData } from '../types';

export class YahooFinanceService {
  async getStockData(symbol: string): Promise<StockQuote> {
    try {
      const quote = await yahooFinance.quote(symbol);
      return {
        symbol: quote.symbol,
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChange: quote.regularMarketChange,
        regularMarketChangePercent: quote.regularMarketChangePercent,
        regularMarketVolume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow
      };
    } catch (error) {
      throw new Error(`Failed to fetch stock data: ${error.message}`);
    }
  }

  async getHistoricalData(symbol: string): Promise<HistoricalData[]> {
    try {
      const result = await yahooFinance.historical(symbol, {
        period1: '3mo',
        interval: '1d'
      });

      return result.map(item => ({
        date: item.date.toISOString(),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }));
    } catch (error) {
      throw new Error(`Failed to fetch historical data: ${error.message}`);
    }
  }

  async getFundamentalData(symbol: string) {
    try {
      const quoteSummary = await yahooFinance.quoteSummary(symbol, {
        modules: ['financialData', 'defaultKeyStatistics']
      });

      return {
        pe: quoteSummary.defaultKeyStatistics.forwardPE,
        eps: quoteSummary.defaultKeyStatistics.forwardEps,
        dividendYield: quoteSummary.summaryDetail?.dividendYield || 0,
        beta: quoteSummary.defaultKeyStatistics.beta,
        priceToBook: quoteSummary.defaultKeyStatistics.priceToBook,
        profitMargin: quoteSummary.financialData.profitMargins
      };
    } catch (error) {
      throw new Error(`Failed to fetch fundamental data: ${error.message}`);
    }
  }
}