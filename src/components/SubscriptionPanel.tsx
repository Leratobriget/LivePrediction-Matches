import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  subscription_status: 'active' | 'inactive' | 'cancelled';
  subscription_expires_at: string | null;
}

const SubscriptionPanel = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Mock profile data
      const mockProfile = {
        id: '1',
        subscription_status: 'inactive' as const,
        subscription_expires_at: null
      };
      
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubscribe = async (plan: string) => {
    toast({
      title: "Subscription",
      description: `${plan} subscription feature coming soon!`,
    });
  };

  if (loading) {
    return (
      <Card className="w-80">
        <CardContent className="py-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Subscription Status</CardTitle>
        {profile && (
          <Badge className={getStatusColor(profile.subscription_status)}>
            {profile.subscription_status.toUpperCase()}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {profile?.subscription_status === 'active' ? (
          <div>
            <p className="text-sm text-muted-foreground">
              Premium access until:
            </p>
            <p className="font-semibold">
              {profile.subscription_expires_at 
                ? new Date(profile.subscription_expires_at).toLocaleDateString()
                : 'Unlimited'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upgrade for premium predictions
            </p>
            <div className="space-y-2">
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => handleSubscribe('Premium')}
              >
                Premium - $29/month
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleSubscribe('VIP')}
              >
                VIP - $79/month
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPanel;