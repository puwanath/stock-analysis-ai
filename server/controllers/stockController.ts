import { Request, Response, NextFunction } from 'express';
import { YahooFinanceService } from '@/services/yahooFinance';
import { TechnicalAnalysisService } from '@/services/technicalAnalysis';

export class StockController {
  private yahooFinance: YahooFinanceService;
  private technicalAnalysis: TechnicalAnalysisService;

  constructor() {
    this.yahooFinance = new YahooFinanceService();
    this.technicalAnalysis = new TechnicalAnalysisService();
  }

  getStockData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol } = req.params;
      const data = await this.yahooFinance.getStockData(symbol);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getTechnicalIndicators = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol } = req.params;
      const historicalData = await this.yahooFinance.getHistoricalData(symbol);
      const technicalData = this.technicalAnalysis.calculateIndicators(historicalData);
      res.json(technicalData);
    } catch (error) {
      next(error);
    }
  };

  getFundamentals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol } = req.params;
      const fundamentals = await this.yahooFinance.getFundamentalData(symbol);
      res.json(fundamentals);
    } catch (error) {
      next(error);
    }
  };
}