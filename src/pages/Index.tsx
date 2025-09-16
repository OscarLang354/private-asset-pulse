import { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { AssetCard } from '@/components/AssetCard';
import { TradingDashboard } from '@/components/TradingDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Lock, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/trading-hero.jpg';

const mockAssets = [
  {
    id: '1',
    name: 'Manhattan Office Tower',
    type: 'real-estate' as const,
    location: 'New York, NY',
    totalValue: 2500000,
    availableTokens: 1000,
    minInvestment: 5000,
    yield: 8.2,
    isEncrypted: true
  },
  {
    id: '2',
    name: 'Gold Bullion Reserve',
    type: 'commodity' as const,
    location: 'London, UK',
    totalValue: 1800000,
    availableTokens: 500,
    minInvestment: 10000,
    yield: 6.5,
    isEncrypted: true
  },
  {
    id: '3',
    name: 'Miami Residential Complex',
    type: 'real-estate' as const,
    location: 'Miami, FL',
    totalValue: 3200000,
    availableTokens: 1600,
    minInvestment: 2500,
    yield: 9.1,
    isEncrypted: true
  },
  {
    id: '4',
    name: 'Swiss Art Collection',
    type: 'art' as const,
    location: 'Zurich, CH',
    totalValue: 950000,
    availableTokens: 200,
    minInvestment: 15000,
    yield: 12.4,
    isEncrypted: true
  }
];

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-trading-green to-trading-blue rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">RWA Exchange</h1>
                <p className="text-sm text-muted-foreground">Real World Assets, Private Deals</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-trading-green/30 text-trading-green">
                <Lock className="w-3 h-3 mr-1" />
                Confidential Trading
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-trading-green to-trading-blue bg-clip-text text-transparent">
              Real World Assets, Private Deals
            </h2>
            <p className="text-lg text-muted-foreground">
              Trade tokenized real estate, commodities, and collectibles with encrypted pricing 
              until settlement. Professional-grade platform for institutional and accredited investors.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-trading-green rounded-full animate-pulse" />
                <span>$2.4B+ Volume</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-trading-blue rounded-full animate-pulse" />
                <span>1,247+ Assets</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-trading-gold rounded-full animate-pulse" />
                <span>8.4% Avg Yield</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Wallet Connection */}
        <div className="max-w-md mx-auto">
          <WalletConnection 
            onConnect={setIsWalletConnected} 
            isConnected={isWalletConnected} 
          />
        </div>

        {/* Trading Dashboard */}
        {isWalletConnected && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-trading-green" />
                Market Overview
              </h3>
            </div>
            <TradingDashboard />
          </div>
        )}

        {/* Available Assets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Available Assets</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Pricing encrypted until wallet connection</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockAssets.map((asset) => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                isWalletConnected={isWalletConnected}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {!isWalletConnected && (
          <div className="text-center py-12 space-y-4">
            <h3 className="text-xl font-semibold">Ready to Start Trading?</h3>
            <p className="text-muted-foreground">
              Connect your wallet to access encrypted pricing and start trading tokenized real-world assets.
            </p>
            <Button 
              onClick={() => setIsWalletConnected(true)}
              className="bg-gradient-to-r from-trading-green to-trading-blue hover:opacity-90 transition-opacity"
            >
              Connect Wallet Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
