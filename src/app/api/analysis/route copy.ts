import { NextResponse } from 'next/server';
import Together from 'together-ai';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000; // 30 seconds
const MAX_TIMEOUT = 60000; // 60 seconds

async function withTimeout(promise: Promise<any>, timeout: number) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
}

async function retryWithBackoff(
  operation: () => Promise<any>,
  retryCount: number = 0
): Promise<any> {
  try {
    const timeout = Math.min(INITIAL_TIMEOUT * Math.pow(1.5, retryCount), MAX_TIMEOUT);
    return await withTimeout(operation(), timeout);
  } catch (error) {
    if (retryCount >= MAX_RETRIES - 1) throw error;
    
    // Exponential backoff
    const delay = 1000 * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retryWithBackoff(operation, retryCount + 1);
  }
}

export async function POST(request: Request) {
  try {
    // Check if API key exists
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Together AI API key is not configured' },
        { status: 500 }
      );
    }

    const together = new Together(apiKey);
    const body = await request.json();
    const { symbol, stockData } = body;

    // Validate input data
    if (!symbol || !stockData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    const prompt = `
      As a professional stock market analyst, analyze the following stock data for ${symbol}:
      
      Current Price: $${stockData.basicInfo.currentPrice}
      Change: ${stockData.basicInfo.percentChange}%
      Volume: ${stockData.basicInfo.volume}
      Market Cap: $${(stockData.basicInfo.marketCap / 1e9).toFixed(2)}B
      
      Technical Indicators:
      - RSI (14): ${stockData.technical.rsi.toFixed(2)}
      - MACD: ${stockData.technical.macd.value.toFixed(2)} (Signal: ${stockData.technical.macd.signal.toFixed(2)})
      - SMA 20: $${stockData.technical.sma.sma20.toFixed(2)}
      - SMA 50: $${stockData.technical.sma.sma50.toFixed(2)}
      - SMA 200: $${stockData.technical.sma.sma200.toFixed(2)}
      - Current Trend: ${stockData.technical.trend}
      - Support Level: $${stockData.technical.support.toFixed(2)}
      - Resistance Level: $${stockData.technical.resistance.toFixed(2)}
      
      Volume Analysis:
      - Current Volume: ${stockData.technical.volumes.current.toLocaleString()}
      - Average Volume: ${stockData.technical.volumes.average.toLocaleString()}
      
      Based on this comprehensive data, provide a detailed trading analysis in JSON format with the following structure:
      {
        "recommendation": "BUY/SELL/HOLD",
        "confidence": (number between 0 and 1),
        "targetPrice": (realistic price target based on technical levels),
        "stopLoss": (suggested stop loss level),
        "reasoning": "detailed explanation of the recommendation",
        "risks": [
          "list key risk factors"
        ],
        "catalysts": [
          "list potential catalysts"
        ],
        "technicalSummary": "brief summary of technical indicators"
      }
    `;

    try {
      const aiResponse = await retryWithBackoff(async () => {
        const response = await together.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          // model: "deepseek-ai/DeepSeek-R1",
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
          temperature: 0.7,
          max_tokens: 1000,
          timeout: INITIAL_TIMEOUT
        });
        return response;
      });

      let analysis;
      try {
        analysis = JSON.parse(aiResponse.choices[0].message.content);
        
        // Validate required fields
        const requiredFields = ['recommendation', 'confidence', 'targetPrice', 'stopLoss', 'reasoning', 'risks'];
        const missingFields = requiredFields.filter(field => !analysis[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Invalid AI response: Missing fields - ${missingFields.join(', ')}`);
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', aiResponse);
        throw new Error('Invalid AI response format');
      }

      return NextResponse.json(analysis);

    } catch (aiError: any) {
      // Handle specific Together AI API errors
      if (aiError.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Together AI API key' },
          { status: 401 }
        );
      }
      if (aiError.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded' },
          { status: 429 }
        );
      }
      throw aiError;
    }

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate AI analysis',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}