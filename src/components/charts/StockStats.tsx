'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface StockStatsProps {
  data: {
    currentPrice: number;
    change: number;
    percentChange: number;
    volume: number;
  };
}

export const StockStats: React.FC<StockStatsProps> = ({ data }) => {
  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Current Price</p>
              <p className="text-2xl font-bold text-white">
                ${data.currentPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {data.change >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-400" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-400" />
            )}
            <div>
              <p className="text-sm text-gray-400">Change</p>
              <div className="flex items-center space-x-2">
                <p className={`text-2xl font-bold ${
                  data.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {data.change >= 0 ? '+' : ''}{data.percentChange.toFixed(2)}%
                </p>
                <p className="text-gray-400">
                  ({data.change >= 0 ? '+' : ''}{data.change.toFixed(2)})
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Volume</p>
              <p className="text-2xl font-bold text-white">
                {data.volume.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};