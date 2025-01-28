import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { stockRouter } from './routes/stock';
import { analysisRouter } from './routes/analysis';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stock', stockRouter);
app.use('/api/analysis', analysisRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});