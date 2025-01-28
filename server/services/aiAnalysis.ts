import Together from 'together-ai';
import { StockAnalysis, AIAnalysis } from '../types';

export class AIAnalysisService {
  private together: Together;

  constructor() {
    this.together = new Together(process.env.TOGETHER_API_KEY);
  }

  async generateAnalysis(stockData: StockAnalysis): Promise<AIAnalysis> {
    try {
      const prompt = this.constructPrompt(stockData);
      
      const response = await this.together.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "deepseek-ai/DeepSeek-R1",
        max_tokens: 1000,
        temperature: 0.7
      });

      return this.parseAIResponse(response.choices[0].message.content);
    } catch (error) {
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  private constructPrompt(data: StockAnalysis): string {
    const { basicInfo, technical, fundamentals } = data;
    
    return `
    Analyze the following stock data for ${basicInfo.symbol}:

    PRICE INFORMATION:
    - Current Price: $${basicInfo.regularMarketPrice}
    - 52 Week High: $${basicInfo.fiftyTwoWeekHigh}
    - 52 Week Low: $${basicInfo.fiftyTwoWeekLow}
    - Market Cap: $${(basicInfo.marketCap / 1e9).toFixed(2)}B

    TECHNICAL INDICATORS:
    - RSI (14): ${technical.rsi}
    - MACD: ${technical.macd.macdLine}
    - Trend: ${technical.trend}
    - Support Level: $${technical.support}
    - Resistance Level: $${technical.resistance}

    FUNDAMENTAL METRICS:
    - P/E Ratio: ${fundamentals.pe}
    - EPS: ${fundamentals.eps}
    - Dividend Yield: ${(fundamentals.dividendYield * 100).toFixed(2)}%
    - Beta: ${fundamentals.beta}

    Please provide a comprehensive analysis including:
    1. A clear BUY, SELL, or HOLD recommendation with confidence level (0-1)
    2. Detailed reasoning for the recommendation
    3. Specific price targets (entry, exit, and stop-loss levels)
    4. Key risk factors to consider
    5. Potential catalysts that could move the stock

    Focus on maximizing profit while managing risk. Format the response as JSON.
    `;
  }

  private parseAIResponse(response: string): AIAnalysis {
    try {
      const parsed = JSON.parse(response);
      
      return {
        recommendation: parsed.recommendation,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning,
        priceTargets: {
          entry: parsed.priceTargets.entry,
          exit: parsed.priceTargets.exit,
          stopLoss: parsed.priceTargets.stopLoss
        },
        riskFactors: parsed.riskFactors,
        catalysts: parsed.catalysts
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }
}