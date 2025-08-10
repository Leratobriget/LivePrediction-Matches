import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LiveMatches from './LiveMatches';
import PredictionHistory from './PredictionHistory';
import SubscriptionPanel from './SubscriptionPanel';

interface Prediction {
  id: string;
  predicted_outcome: string;
  odds: number;
  confidence_score: number;
  prediction_type: 'safe' | 'risky';
  reasoning: string;
  match: {
    home_team: string;
    away_team: string;
    sport: string;
    match_date: string;
    status: string;
  };
}

const Dashboard = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPredictions();
    
    // Real-time subscriptions will be implemented once Supabase is available
    // const subscription = supabase
    //   .channel('predictions')
    //   .on('postgres_changes', { 
    //     event: 'INSERT', 
    //     schema: 'public', 
    //     table: 'predictions' 
    //   }, () => {
    //     fetchPredictions();
    //   })
    //   .subscribe();

    // return () => {
    //   subscription.unsubscribe();
    // };
  }, []);

  const fetchPredictions = async () => {
    try {
      // Mock data for demo - will be replaced with Supabase queries
      const mockPredictions = [
        {
          id: '1',
          predicted_outcome: 'Liverpool Win',
          odds: 2.45,
          confidence_score: 85,
          prediction_type: 'safe' as const,
          reasoning: 'Liverpool has won 8 out of their last 10 home games. Strong attacking form with Salah and Mane in excellent condition.',
          match: {
            home_team: 'Liverpool',
            away_team: 'Arsenal',
            sport: 'soccer',
            match_date: new Date().toISOString(),
            status: 'upcoming'
          }
        },
        {
          id: '2',
          predicted_outcome: 'Over 2.5 Goals',
          odds: 1.85,
          confidence_score: 92,
          prediction_type: 'risky' as const,
          reasoning: 'Both teams average over 2.5 goals per game in last 5 matches. High-scoring encounter expected.',
          match: {
            home_team: 'Manchester City',
            away_team: 'Chelsea',
            sport: 'soccer',
            match_date: new Date(Date.now() + 3600000).toISOString(),
            status: 'upcoming'
          }
        }
      ];
      
      setPredictions(mockPredictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast({
        title: "Error",
        description: "Failed to load predictions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPredictionTypeColor = (type: string) => {
    return type === 'safe' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sports Prediction Dashboard</h1>
          <p className="text-muted-foreground">Live predictions and match analysis</p>
        </div>
        <SubscriptionPanel />
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Today's Predictions</TabsTrigger>
          <TabsTrigger value="live">Live Matches</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Loading predictions...</div>
            ) : predictions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No active predictions available</p>
                </CardContent>
              </Card>
            ) : (
              predictions.map((prediction) => (
                <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {prediction.match.home_team} vs {prediction.match.away_team}
                        </CardTitle>
                        <CardDescription>
                          {prediction.match.sport.toUpperCase()} • {new Date(prediction.match.match_date).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPredictionTypeColor(prediction.prediction_type)}>
                          {prediction.prediction_type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {prediction.odds.toFixed(2)} odds
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Prediction</h4>
                        <p className="text-lg">{prediction.predicted_outcome}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Confidence: </span>
                          <span className={`font-semibold ${getConfidenceColor(prediction.confidence_score)}`}>
                            {prediction.confidence_score}%
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Status: </span>
                          <Badge variant="secondary">{prediction.match.status}</Badge>
                        </div>
                      </div>

                      {prediction.reasoning && (
                        <div>
                          <h4 className="font-semibold text-sm">Analysis</h4>
                          <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          View on Betway
                        </Button>
                        <Button size="sm" variant="outline">
                          View on Hollywood
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="live">
          <LiveMatches />
        </TabsContent>

        <TabsContent value="history">
          <PredictionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;