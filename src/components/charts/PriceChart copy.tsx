'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Rectangle
} from 'recharts';

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceChartProps {
  data: CandlestickData[];
}

const CandlestickBar = (props: any) => {
  const { x, y, width, height, open, close } = props;
  const isGreen = close >= open;

  return (
    <g>
      {/* Candlestick wick */}
      <line
        x1={x + width / 2}
        y1={props.low}
        x2={x + width / 2}
        y2={props.high}
        stroke={isGreen ? '#22c55e' : '#ef4444'}
        strokeWidth={1}
      />
      {/* Candlestick body */}
      <rect
        x={x}
        y={isGreen ? close : open}
        width={width}
        height={Math.max(1, Math.abs(open - close))}
        fill={isGreen ? '#22c55e' : '#ef4444'}
        stroke={isGreen ? '#22c55e' : '#ef4444'}
      />
    </g>
  );
};

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState('1M');

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatVolume = (value: number) => `${(value / 1000000).toFixed(1)}M`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  // Calculate price range for better Y-axis scaling
  const minLow = Math.min(...data.map(d => d.low));
  const maxHigh = Math.max(...data.map(d => d.high));
  const priceRange = maxHigh - minLow;
  const yDomain = [minLow - priceRange * 0.05, maxHigh + priceRange * 0.05];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Price Chart</CardTitle>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === tf 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                tickFormatter={formatDate}
              />
              <YAxis 
                yAxisId="price"
                stroke="#9ca3af"
                domain={yDomain}
                tickFormatter={formatPrice}
              />
              <YAxis 
                yAxisId="volume"
                orientation="right"
                stroke="#9ca3af"
                tickFormatter={formatVolume}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelFormatter={formatDate}
                formatter={(value: any, name: string) => {
                  if (name === 'volume') return [formatVolume(value), 'Volume'];
                  return [formatPrice(value), name];
                }}
              />
              <Legend />
              <Bar
                dataKey="volume"
                yAxisId="volume"
                fill="#3b82f6"
                opacity={0.3}
                name="Volume"
              />
              <Bar
                name="Price"
                yAxisId="price"
                dataKey="open"
                shape={<CandlestickBar />}
                high={data.map(d => d.high)}
                low={data.map(d => d.low)}
                close={data.map(d => d.close)}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};