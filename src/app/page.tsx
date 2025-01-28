'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceChart } from '@/components/charts/PriceChart';
import { TechnicalIndicators } from '@/components/analysis/TechnicalIndicators';
import { AIRecommendation } from '@/components/analysis/AIRecommendation';
import { StockStats } from '@/components/charts/StockStats';
import { toast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';

export default function StockAnalyzer() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleAnalyze = async () => {
    if (!symbol) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/stock?symbol=${symbol.toUpperCase()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const stockData = await response.json();
      setData(stockData);
      
      // Get AI analysis after fetching stock data
      await getAIAnalysis(stockData);
      
      toast({
        title: "Success",
        description: "Stock analysis completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch stock data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const getAIAnalysis = async (stockData: any) => {
    setLoading(true);
    setRetryCount(0);

    const tryAnalysis = async (): Promise<any> => {
      try {
        const response = await fetch('/api/analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol,
            stockData
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 401) {
            throw new Error('API key is invalid or expired');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please try again later');
          } else if (errorData.error) {
            throw new Error(errorData.error);
          } else {
            throw new Error('Failed to generate analysis');
          }
        }

        const analysis = await response.json();
        setAiAnalysis(analysis);
        toast({
          title: "Success",
          description: "AI analysis completed successfully",
        });
        return analysis;

      } catch (error) {
        if (retryCount < maxRetries && 
            (error.message.includes('timed out') || error.message.includes('failed to generate'))) {
          setRetryCount(prev => prev + 1);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return tryAnalysis();
        }
        throw error;
      }
    };

    try {
      await tryAnalysis();
    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate analysis",
        variant: "destructive",
      });
      setAiAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI-Powered Stock Analysis
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Get comprehensive stock analysis with AI-driven insights, technical indicators.
            <br />
            <span className="text-blue-500">Powered by Dev.Pooh</span>
          </p>
        </div>

        {/* Search Section */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Loading...' : 'Analyze'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {data && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StockStats data={data.basicInfo} />
            </div>

            <Tabs defaultValue="price" className="space-y-4">
              <TabsList className="bg-gray-800/50 border-gray-700 text-white">
                <TabsTrigger value="price">Price Chart</TabsTrigger>
                <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
                <TabsTrigger value="ai">AI Analysis</TabsTrigger>
              </TabsList>

              {/* <TabsContent value="price">
                <PriceChart data={data.historical} />
              </TabsContent> */}
              <TabsContent value="price">
                <PriceChart symbol={symbol} />
              </TabsContent>

              {/* <TabsContent value="technical">
                <TechnicalIndicators data={data.technical} />
              </TabsContent> */}
              <TabsContent value="technical">
                {data ? (
                  <TechnicalIndicators data={data.technical} />
                ) : (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="text-center text-gray-400">
                        No technical data available
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* <TabsContent value="ai">
                <AIRecommendation analysis={data.aiAnalysis} />
              </TabsContent> */}
              <TabsContent value="ai">
                {loading ? (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        <p className="text-gray-400">Generating AI analysis... {retryCount > 0 ? `(Attempt ${retryCount})` : ''}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : aiAnalysis ? (
                  <AIRecommendation analysis={aiAnalysis} />
                ) : (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="text-center text-gray-400">
                        <p className="text-lg font-medium mb-2">Unable to generate AI analysis</p>
                        <p className="text-sm">Please try again or check if the stock symbol is correct.</p>
                        <Button
                          onClick={() => getAIAnalysis(data)}
                          className="mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                          Retry Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}