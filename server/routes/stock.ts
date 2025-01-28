import { Router } from 'express';
import { StockController } from '../controllers/stockController';

const router = Router();
const stockController = new StockController();

router.get('/:symbol', stockController.getStockData);
router.get('/:symbol/technical', stockController.getTechnicalIndicators);
router.get('/:symbol/fundamentals', stockController.getFundamentals);

export { router as stockRouter };