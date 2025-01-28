import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Fetch stock data
    const quote = await yahooFinance.quote(symbol);
    
    // Fetch historical data for volume analysis
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    const historical = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    });

    // Calculate volume averages
    const volumes = historical.map(item => item.volume);
    const averageVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const currentVolume = volumes[volumes.length - 1];

    // Calculate support and resistance
    const prices = historical.map(item => item.close);
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const support = sortedPrices[Math.floor(sortedPrices.length * 0.2)]; // 20th percentile
    const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.8)]; // 80th percentile

    // Format response data
    const responseData = {
      basicInfo: {
        currentPrice: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        percentChange: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
      },
      technical: {
        rsi: calculateRSI(prices, 14),
        macd: calculateMACD(prices),
        sma: {
          sma20: calculateSMA(prices, 20),
          sma50: calculateSMA(prices, 50),
          sma200: calculateSMA(prices, 200),
        },
        trend: determineTrend(prices),
        support,
        resistance,
        volumes: {
          current: currentVolume,
          average: averageVolume
        }
      },
      historical: historical.map(item => ({
        date: item.date.toISOString().split('T')[0],
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }))
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Stock API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateRSI(prices: number[], period: number): number {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[prices.length - i] - prices[prices.length - i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  return 100 - (100 / (1 + (avgGain / avgLoss)));
}

function calculateMACD(prices: number[]) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;
  const signalLine = calculateEMA(Array(prices.length).fill(macdLine), 9);

  return {
    value: macdLine,
    signal: signalLine,
    histogram: macdLine - signalLine
  };
}

function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  const slice = prices.slice(-period);
  return slice.reduce((sum, price) => sum + price, 0) / period;
}

function calculateEMA(prices: number[], period: number): number {
  const k = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  
  return ema;
}

function determineTrend(prices: number[]): 'bullish' | 'bearish' | 'neutral' {
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const currentPrice = prices[prices.length - 1];

  if (currentPrice > sma20 && sma20 > sma50) return 'bullish';
  if (currentPrice < sma20 && sma20 < sma50) return 'bearish';
  return 'neutral';
}