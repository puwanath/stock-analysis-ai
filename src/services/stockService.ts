import { StockAnalysis, ApiResponse } from '@/types';

export class StockService {
  private static BASE_URL = '/api';

  static async getStockAnalysis(symbol: string): Promise<ApiResponse<StockAnalysis>> {
    try {
      const response = await fetch(`${this.BASE_URL}/stock/${symbol}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stock data'
      };
    }
  }

  static async getAIAnalysis(symbol: string, data: Partial<StockAnalysis>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.BASE_URL}/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, data })
      });
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch AI analysis'
      };
    }
  }
}