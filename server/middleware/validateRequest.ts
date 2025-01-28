import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateStockSymbol = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { symbol } = req.params;
  
  if (!symbol || !/^[A-Z]{1,5}$/.test(symbol)) {
    throw new AppError(400, 'Invalid stock symbol');
  }

  next();
};