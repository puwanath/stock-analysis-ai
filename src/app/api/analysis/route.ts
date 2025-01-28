import { NextResponse } from 'next/server';
import Together from 'together-ai';

const MAX_RETRIES = 3;
const TIMEOUT = 60000; // 60 seconds

async function makeAIRequest(together: Together, prompt: string, retryCount = 0): Promise<any> {
  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional stock market analyst. Always respond in valid JSON format."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      // model: "deepseek-ai/DeepSeek-R1",
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { "type": "json_object" }
    });

    const content = response.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch {
      // Attempt to extract JSON if the response contains additional text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse JSON response');
    }
  } catch (error) {
    if (retryCount >= MAX_RETRIES) throw error;
    
    console.log(`Retry ${retryCount + 1} of ${MAX_RETRIES}`);
    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
    return makeAIRequest(together, prompt, retryCount + 1);
  }
}

export async function POST(request: Request) {
  try {
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

    if (!symbol || !stockData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    const prompt = `
Analyze the following stock data and provide a trading recommendation. 
Format your response EXACTLY as a JSON object with the specified structure.

Stock: ${symbol}
Price: $${stockData.basicInfo.currentPrice}
Change: ${stockData.basicInfo.percentChange}%
RSI: ${stockData.technical.rsi}
MACD: ${stockData.technical.macd.value}
Trend: ${stockData.technical.trend}

Required JSON Structure:
{
  "recommendation": "BUY" or "SELL" or "HOLD",
  "confidence": (number between 0.0 and 1.0),
  "targetPrice": (number),
  "stopLoss": (number),
  "reasoning": "detailed analysis",
  "risks": ["risk1", "risk2", "risk3"],
  "catalysts": ["catalyst1", "catalyst2", "catalyst3"]
}

Ensure the response is a valid JSON object matching this exact structure.
Do not include any additional text before or after the JSON object.`;

    const analysis = await makeAIRequest(together, prompt);

    // Validate response structure
    const requiredFields = ['recommendation', 'confidence', 'targetPrice', 'stopLoss', 'reasoning', 'risks'];
    const missingFields = requiredFields.filter(field => !(field in analysis));

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Invalid AI response: Missing fields - ${missingFields.join(', ')}`,
          response: analysis 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);

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