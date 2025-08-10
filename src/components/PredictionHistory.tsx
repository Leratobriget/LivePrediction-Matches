import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PredictionResult {
  id: string;
  actual_outcome: string;
  is_correct: boolean;
  profit_loss: number;
  created_at: string;
  prediction: {
    predicted_outcome: string;
    odds: number;
    confidence_score: number;
    prediction_type: 'safe' | 'risky';
    match: {
      home_team: string;
      away_team: string;
      sport: string;
      home_score: number;
      away_score: number;
    };
  };
}

const PredictionHistory = () => {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    correctPredictions: 0,
    totalProfit: 0,
    winRate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPredictionHistory();
  }, []);

  const fetchPredictionHistory = async () => {
    try {
      // Mock prediction results data
      const mockResults = [
        {
          id: '1',
          actual_outcome: 'Liverpool Win',
          is_correct: true,
          profit_loss: 145.50,
          created_at: new Date().toISOString(),
          prediction: {
            predicted_outcome: 'Liverpool Win',
            odds: 2.45,
            confidence_score: 85,
            prediction_type: 'safe' as const,
            match: {
              home_team: 'Liverpool',
              away_team: 'Arsenal',
              sport: 'soccer',
              home_score: 3,
              away_score: 1
            }
          }
        },
        {
          id: '2',
          actual_outcome: 'Under 2.5 Goals',
          is_correct: false,
          profit_loss: -100.00,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          prediction: {
            predicted_outcome: 'Over 2.5 Goals',
            odds: 1.85,
            confidence_score: 75,
            prediction_type: 'risky' as const,
            match: {
              home_team: 'Manchester City',
              away_team: 'Chelsea',
              sport: 'soccer',
              home_score: 1,
              away_score: 0
            }
          }
        }
      ];
      
      setResults(mockResults);
      
      // Calculate stats
      const totalPredictions = mockResults.length;
      const correctPredictions = mockResults.filter(r => r.is_correct).length;
      const totalProfit = mockResults.reduce((sum, r) => sum + r.profit_loss, 0);
      const winRate = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
      
      setStats({
        totalPredictions,
        correctPredictions,
        totalProfit,
        winRate
      });
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      toast({
        title: "Error",
        description: "Failed to load prediction history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (isCorrect: boolean) => {
    return isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading prediction history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.totalPredictions}</div>
            <p className="text-sm text-muted-foreground">Total Predictions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.correctPredictions}</div>
            <p className="text-sm text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getProfitColor(stats.totalProfit)}`}>
              ${stats.totalProfit.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">Total P&L</p>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Results */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No prediction results available</p>
            </CardContent>
          </Card>
        ) : (
          results.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {result.prediction.match.home_team} vs {result.prediction.match.away_team}
                    </CardTitle>
                    <CardDescription>
                      {result.prediction.match.sport.toUpperCase()} • Final: {result.prediction.match.home_score}-{result.prediction.match.away_score}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getResultColor(result.is_correct)}>
                      {result.is_correct ? 'WIN' : 'LOSS'}
                    </Badge>
                    <Badge variant="outline">
                      {result.prediction.odds.toFixed(2)} odds
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Predicted</h4>
                    <p>{result.prediction.predicted_outcome}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Actual</h4>
                    <p>{result.actual_outcome}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Profit/Loss</h4>
                    <p className={`font-semibold ${getProfitColor(result.profit_loss)}`}>
                      ${result.profit_loss.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Completed: {new Date(result.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PredictionHistory;