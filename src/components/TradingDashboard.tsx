import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export const TradingDashboard = () => {
  const marketStats = [
    {
      title: 'Total RWA Volume',
      value: '$2.4B',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      title: 'Active Assets',
      value: '1,247',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Activity
    },
    {
      title: 'Avg. Yield',
      value: '8.4%',
      change: '+0.3%',
      trend: 'up' as const,
      icon: TrendingUp
    },
    {
      title: '24h Trades',
      value: '891',
      change: '-2.1%',
      trend: 'down' as const,
      icon: TrendingDown
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketStats.map((stat) => (
          <Card key={stat.title} className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-xs flex items-center ${
                  stat.trend === 'up' ? 'text-trading-green' : 'text-trading-red'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-accent" />
              Recent Trading Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { asset: 'Manhattan Office Tower', type: 'Real Estate', amount: '$250K', status: 'Completed' },
                { asset: 'Gold Bullion Reserve', type: 'Commodity', amount: '$180K', status: 'Pending' },
                { asset: 'Miami Residential Complex', type: 'Real Estate', amount: '$420K', status: 'Completed' },
                { asset: 'Platinum Futures', type: 'Commodity', amount: '$95K', status: 'Processing' }
              ].map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{trade.asset}</p>
                    <p className="text-xs text-muted-foreground">{trade.type}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium text-sm">{trade.amount}</p>
                    <p className={`text-xs ${
                      trade.status === 'Completed' ? 'text-trading-green' : 
                      trade.status === 'Pending' ? 'text-trading-gold' : 'text-accent'
                    }`}>
                      {trade.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-trading-green" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'NYC Commercial', yield: '12.4%', change: '+2.1%' },
                { name: 'London Properties', yield: '9.8%', change: '+1.5%' },
                { name: 'Silicon Valley Tech', yield: '15.2%', change: '+3.2%' },
                { name: 'Dubai Real Estate', yield: '8.9%', change: '+0.8%' }
              ].map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">Annual Yield: {performer.yield}</p>
                  </div>
                  <div className="text-trading-green text-xs font-medium">
                    {performer.change}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};