import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Match {
  id: string;
  sport: string;
  home_team: string;
  away_team: string;
  league: string;
  match_date: string;
  status: string;
  home_score: number;
  away_score: number;
  home_corners: number;
  away_corners: number;
  home_bookings: number;
  away_bookings: number;
}

const LiveMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLiveMatches();
    
    // Update every 30 seconds
    const interval = setInterval(fetchLiveMatches, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchLiveMatches = async () => {
    try {
      // Mock live matches data
      const mockMatches = [
        {
          id: '1',
          sport: 'soccer',
          home_team: 'Real Madrid',
          away_team: 'Barcelona',
          league: 'La Liga',
          match_date: new Date().toISOString(),
          status: 'live',
          home_score: 2,
          away_score: 1,
          home_corners: 6,
          away_corners: 4,
          home_bookings: 2,
          away_bookings: 3
        },
        {
          id: '2',
          sport: 'basketball',
          home_team: 'Lakers',
          away_team: 'Warriors',
          league: 'NBA',
          match_date: new Date().toISOString(),
          status: 'live',
          home_score: 89,
          away_score: 76,
          home_corners: 0,
          away_corners: 0,
          home_bookings: 4,
          away_bookings: 2
        }
      ];
      
      setMatches(mockMatches);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      toast({
        title: "Error",
        description: "Failed to load live matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSportIcon = (sport: string) => {
    const icons = {
      soccer: '⚽',
      basketball: '🏀',
      baseball: '⚾',
      cricket: '🏏'
    };
    return icons[sport as keyof typeof icons] || '🏆';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'finished': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading live matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No live matches at the moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {matches.map((match) => (
        <Card key={match.id} className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-red-500"></div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSportIcon(match.sport)}</span>
                <div>
                  <CardTitle className="text-lg">
                    {match.home_team} vs {match.away_team}
                  </CardTitle>
                  <CardDescription>
                    {match.league} • {match.sport.toUpperCase()}
                  </CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(match.status)}>
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {match.home_score} - {match.away_score}
                </div>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {match.home_corners} - {match.away_corners}
                </div>
                <p className="text-sm text-muted-foreground">Corners</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">
                  {match.home_bookings} - {match.away_bookings}
                </div>
                <p className="text-sm text-muted-foreground">Bookings</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Started: {new Date(match.match_date).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveMatches;