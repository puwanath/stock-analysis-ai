'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, AlertTriangle, TrendingUp, BarChart2, Activity, Target } from 'lucide-react';

interface TechnicalIndicatorsProps {
  data: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    sma: {
      sma20: number;
      sma50: number;
      sma200: number;
    };
    trend: 'bullish' | 'bearish' | 'neutral';
    support: number;
    resistance: number;
    volumes: {
      current: number;
      average: number;
    };
  };
}

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ data }) => {
  const getTrendStrength = () => {
    const sma20 = data.sma.sma20;
    const sma50 = data.sma.sma50;
    const sma200 = data.sma.sma200;
    
    if (sma20 > sma50 && sma50 > sma200) return { strength: 'Strong Uptrend', color: 'text-green-400' };
    if (sma20 < sma50 && sma50 < sma200) return { strength: 'Strong Downtrend', color: 'text-red-400' };
    if (sma20 > sma50) return { strength: 'Moderate Uptrend', color: 'text-green-300' };
    if (sma20 < sma50) return { strength: 'Moderate Downtrend', color: 'text-red-300' };
    return { strength: 'Neutral', color: 'text-yellow-400' };
  };

  const getSignalStrength = () => {
    let signals = [];
    // RSI Signals
    if (data.rsi > 70) signals.push({ type: 'SELL', reason: 'Overbought (RSI > 70)', strength: 'Strong' });
    else if (data.rsi < 30) signals.push({ type: 'BUY', reason: 'Oversold (RSI < 30)', strength: 'Strong' });
    
    // MACD Signals
    if (data.macd.histogram > 0 && data.macd.histogram > data.macd.signal) 
      signals.push({ type: 'BUY', reason: 'MACD Bullish Crossover', strength: 'Moderate' });
    else if (data.macd.histogram < 0 && data.macd.histogram < data.macd.signal)
      signals.push({ type: 'SELL', reason: 'MACD Bearish Crossover', strength: 'Moderate' });

    // Volume Analysis
    const volumeRatio = data.volumes.current / data.volumes.average;
    if (volumeRatio > 1.5) signals.push({ type: 'ALERT', reason: 'High Volume Activity', strength: 'High' });

    return signals;
  };

  const trendStrength = getTrendStrength();
  const signals = getSignalStrength();

  return (
    <div className="grid gap-6">
      {/* Main Trend Analysis */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Primary Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Moving Averages</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SMA 20</span>
                    <span className={data.sma.sma20 > data.sma.sma50 ? 'text-green-400' : 'text-red-400'}>
                      ${data.sma.sma20.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SMA 50</span>
                    <span className={data.sma.sma50 > data.sma.sma200 ? 'text-green-400' : 'text-red-400'}>
                      ${data.sma.sma50.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SMA 200</span>
                    <span className="text-white">${data.sma.sma200.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Trend Strength</h3>
                <div className={`text-xl font-bold ${trendStrength.color}`}>
                  {trendStrength.strength}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Price Action with Moving Average Alignment
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Signals */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Momentum Indicators</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">RSI (14)</span>
                    <span className={`font-bold ${
                      data.rsi > 70 ? 'text-red-400' : 
                      data.rsi < 30 ? 'text-green-400' : 
                      'text-white'
                    }`}>{data.rsi.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        data.rsi > 70 ? 'bg-red-400' :
                        data.rsi < 30 ? 'bg-green-400' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${data.rsi}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {data.rsi > 70 ? 'Overbought' : data.rsi < 30 ? 'Oversold' : 'Neutral Range'}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">MACD</span>
                    <span className={`font-bold ${data.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.macd.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Signal: {data.macd.signal.toFixed(2)}</span>
                    <span className={data.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'}>
                      Hist: {data.macd.histogram.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Support & Resistance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Resistance</span>
                  <span className="text-red-400 font-bold">${data.resistance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Support</span>
                  <span className="text-green-400 font-bold">${data.support.toFixed(2)}</span>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-400">Potential Breakout/Breakdown Levels</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Signals */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Trading Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {signals.map((signal, index) => (
              <div key={index} className={`p-4 rounded-lg ${
                signal.type === 'BUY' ? 'bg-green-900/30' :
                signal.type === 'SELL' ? 'bg-red-900/30' :
                'bg-yellow-900/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {signal.type === 'BUY' ? (
                      <ArrowUp className="h-5 w-5 text-green-400" />
                    ) : signal.type === 'SELL' ? (
                      <ArrowDown className="h-5 w-5 text-red-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    )}
                    <span className={`font-bold ${
                      signal.type === 'BUY' ? 'text-green-400' :
                      signal.type === 'SELL' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>{signal.type}</span>
                  </div>
                  <span className="text-gray-400">Strength: {signal.strength}</span>
                </div>
                <p className="text-gray-300 mt-2">{signal.reason}</p>
              </div>
            ))}
            {signals.length === 0 && (
              <div className="text-center text-gray-400">
                No significant trading signals at the moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Volume Analysis */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Volume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Volume Ratio</span>
              <span className={`font-bold ${
                data.volumes.current > data.volumes.average * 1.5 ? 'text-green-400' :
                data.volumes.current < data.volumes.average * 0.5 ? 'text-red-400' :
                'text-white'
              }`}>
                {(data.volumes.current / data.volumes.average).toFixed(2)}x
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Volume</span>
                <span className="text-white">{data.volumes.current.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Average Volume</span>
                <span className="text-white">{data.volumes.average.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};