# Stock Analysis with AI Assistant (DeepSeek R1, Llama3.3 70B instruction)

## Overview
This is a stock analysis web application that combines technical analysis with AI-powered insights using DeepSeek R1. It provides real-time stock data analysis, technical indicators, and AI-driven trading recommendations.

## Features
- Real-time stock data from Yahoo Finance
- Technical Analysis:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Moving Averages (SMA 20, 50, 200)
  - Support and Resistance levels
  - Volume Analysis
- Interactive Charts:
  - Candlestick charts with multiple timeframes
  - Volume visualization
- AI Analysis:
  - Trading recommendations (Buy/Sell/Hold)
  - Price targets and stop-loss levels
  - Risk analysis
  - Potential catalysts

## Tech Stack
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: TradingView Lightweight Charts
- **Data**: Yahoo Finance API
- **AI**: Together AI (DeepSeek R1, Llama3.3 70B instruction model)

## Installation

1. Clone the repository:
```bash
git clone [https://github.com/puwanath/stock-analysis-ai.git]
cd stock-analysis
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
TOGETHER_API_KEY=your_together_ai_api_key
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── stock/         # Stock data API
│   │   └── analysis/      # AI analysis API
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── charts/           # Chart components
│   └── analysis/         # Analysis components
├── services/             # Service layer
│   ├── stockService.ts
│   ├── yahooFinance.ts
│   └── technicalAnalysis.ts
└── types/                # TypeScript types
    └── index.ts
```

## Usage

1. Enter a stock symbol (e.g., AAPL, GOOGL)
2. View technical analysis including:
   - Current price and changes
   - Technical indicators
   - Support and resistance levels
3. Analyze price action using interactive charts
4. Get AI-powered recommendations and insights

## API Reference

### Stock Data API
```typescript
GET /api/stock?symbol=AAPL
```
Returns stock data including:
- Basic information
- Technical indicators
- Historical data

### AI Analysis API
```typescript
POST /api/analysis
Body: {
  symbol: string,
  stockData: StockAnalysis
}
```
Returns AI analysis including:
- Trading recommendation
- Price targets
- Risk assessment

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Dependencies

### Main Dependencies
```json
{
  "next": "13.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "together-ai": "latest",
  "yahoo-finance2": "latest"
}
```

### Development Dependencies
```json
{
  "@types/react": "18.x",
  "@types/node": "18.x",
  "eslint": "8.x",
  "typescript": "5.x"
}
```

## Environment Variables
| Variable | Description |
|----------|-------------|
| `TOGETHER_API_KEY` | API key for Together AI |

## License
MIT License

## Support
For support, reach out:
- Open an issue
- Submit a pull request
- Contact the maintainers

## Future Updates
- [ ] Add more technical indicators
- [ ] Implement alerts system
- [ ] Add portfolio tracking
- [ ] Enhance AI analysis with sentiment data
- [ ] Add backtesting capabilities

## Acknowledgements
- [Together AI](https://together.ai) for DeepSeek R1 model
- [Yahoo Finance](https://finance.yahoo.com) for market data
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [TradingView](https://tradingview.com) for charting library
