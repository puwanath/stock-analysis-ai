'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus, Target, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';

interface AIAnalysisProps {
  analysis: {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    targetPrice: number;
    stopLoss: number;
    reasoning: string;
    risks: string[];
    catalysts?: string[];
  };
}

export const AIRecommendation: React.FC<AIAnalysisProps> = ({ analysis }) => {
  const getRecommendationInfo = () => {
    switch (analysis.recommendation) {
      case 'BUY':
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          icon: <ArrowUp className="h-6 w-6" />,
          description: 'Strong buying opportunity'
        };
      case 'SELL':
        return {
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          icon: <ArrowDown className="h-6 w-6" />,
          description: 'Consider selling position'
        };
      default:
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          icon: <Minus className="h-6 w-6" />,
          description: 'Monitor current position'
        };
    }
  };

  const info = getRecommendationInfo();

  return (
    <div className="grid gap-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Trading Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg ${info.bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={info.color}>{info.icon}</div>
                  <div>
                    <h3 className={`text-2xl font-bold ${info.color}`}>
                      {analysis.recommendation}
                    </h3>
                    <p className="text-sm text-gray-400">{info.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Confidence</p>
                  <p className="text-xl font-bold text-white">
                    {(analysis.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Target Price</p>
                  <p className="text-xl font-bold text-green-400">
                    ${analysis.targetPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Stop Loss</p>
                  <p className="text-xl font-bold text-red-400">
                    ${analysis.stopLoss.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-6 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">Analysis Reasoning</h3>
            <p className="text-gray-300">{analysis.reasoning}</p>
          </div>

          <div className="mt-6 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Risk Factors
            </h3>
            <ul className="space-y-2">
              {analysis.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {analysis.catalysts && (
            <div className="mt-6 p-6 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-400" />
                Key Catalysts
              </h3>
              <ul className="space-y-2">
                {analysis.catalysts.map((catalyst, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300">{catalyst}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk/Reward Analysis */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Risk/Reward Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Potential Return</p>
              <p className="text-2xl font-bold text-green-400">
                {(((analysis.targetPrice - analysis.stopLoss) / analysis.stopLoss) * 100).toFixed(2)}%
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Risk Ratio</p>
              <p className="text-2xl font-bold text-blue-400">
                {((analysis.targetPrice - analysis.stopLoss) / (analysis.stopLoss)).toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Success Probability</p>
              <p className="text-2xl font-bold text-purple-400">
                {(analysis.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};






