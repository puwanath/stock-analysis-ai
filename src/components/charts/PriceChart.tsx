'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceChartProps {
  symbol: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
  const [timeframe, setTimeframe] = useState('D');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            container_id: "tradingview_chart",
            symbol: symbol,
            interval: timeframe,
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            backgroundColor: "rgb(17, 24, 39)",
            gridColor: "rgba(55, 65, 81, 0.5)",
            width: "100%",
            height: 600,
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [symbol, timeframe, isClient]);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Price Chart ({symbol})</CardTitle>
          <div className="flex gap-1">
            {[
              { label: '1m', value: '1' },
              { label: '5m', value: '5' },
              { label: '15m', value: '15' },
              { label: '30m', value: '30' },
              { label: '1H', value: '60' },
              { label: '4H', value: '240' },
              { label: '1D', value: 'D' },
              { label: '1W', value: 'W' },
              { label: '1M', value: 'M' },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeframe(value)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                  timeframe === value 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div id="tradingview_chart" className="h-[600px]" />
      </CardContent>
    </Card>
  );
};

// Add TradingView types
declare global {
  interface Window {
    TradingView: {
      widget: new (config: any) => any;
    };
  }
}