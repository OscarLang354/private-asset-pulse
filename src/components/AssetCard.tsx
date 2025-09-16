import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Lock, TrendingUp, MapPin, DollarSign, Users, Percent } from 'lucide-react';
import { usePrivateAssetPulse } from '@/hooks/useContract';

interface Asset {
  id: string;
  name: string;
  type: 'real-estate' | 'commodity' | 'art';
  location: string;
  totalValue: number;
  availableTokens: number;
  minInvestment: number;
  yield: number;
  isEncrypted: boolean;
}

interface AssetCardProps {
  asset: Asset;
  isWalletConnected: boolean;
}

export const AssetCard = ({ asset, isWalletConnected }: AssetCardProps) => {
  const [isInvesting, setIsInvesting] = useState(false);
  const { makeInvestment, isPending, isConfirming, isConfirmed, error } = usePrivateAssetPulse();

  const handleInvest = async () => {
    if (!isWalletConnected) return;
    
    setIsInvesting(true);
    try {
      // Convert minInvestment to ETH (simplified conversion)
      const amountInEth = (asset.minInvestment / 2000).toString(); // Assuming 1 ETH = $2000
      await makeInvestment(parseInt(asset.id), amountInEth);
    } catch (err) {
      console.error('Investment failed:', err);
    } finally {
      setIsInvesting(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'real-estate':
        return <Building2 className="w-5 h-5" />;
      case 'commodity':
        return <TrendingUp className="w-5 h-5" />;
      case 'art':
        return <Users className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'real-estate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'commodity':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'art':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getButtonText = () => {
    if (isPending || isConfirming) {
      return 'Processing...';
    }
    if (isConfirmed) {
      return 'Investment Confirmed!';
    }
    if (!isWalletConnected) {
      return 'Connect Wallet';
    }
    return 'Invest Now';
  };

  const getButtonIcon = () => {
    if (isPending || isConfirming) {
      return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />;
    }
    if (isConfirmed) {
      return <TrendingUp className="w-4 h-4 mr-2" />;
    }
    if (!isWalletConnected) {
      return <Lock className="w-4 h-4 mr-2" />;
    }
    return <TrendingUp className="w-4 h-4 mr-2" />;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-trading-green/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-trading-green to-trading-blue rounded-lg flex items-center justify-center text-white">
              {getAssetIcon(asset.type)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{asset.name}</CardTitle>
              <CardDescription className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {asset.location}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${getAssetTypeColor(asset.type)} text-xs`}>
            {asset.type.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-3 h-3 mr-1" />
              Total Value
            </div>
            <div className="font-semibold">
              {isWalletConnected ? formatCurrency(asset.totalValue) : '***'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              Available
            </div>
            <div className="font-semibold">
              {isWalletConnected ? `${asset.availableTokens} tokens` : '***'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-3 h-3 mr-1" />
              Min Investment
            </div>
            <div className="font-semibold">
              {isWalletConnected ? formatCurrency(asset.minInvestment) : '***'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Percent className="w-3 h-3 mr-1" />
              Yield
            </div>
            <div className="font-semibold text-trading-green">
              {isWalletConnected ? `${asset.yield}%` : '***'}
            </div>
          </div>
        </div>

        {asset.isEncrypted && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            <Lock className="w-3 h-3" />
            <span>Pricing encrypted until wallet connection</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            Error: {error.message}
          </div>
        )}

        {isConfirmed && (
          <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
            Investment confirmed on blockchain!
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleInvest}
          disabled={!isWalletConnected || isPending || isConfirming}
          className="w-full bg-gradient-to-r from-trading-green to-trading-blue hover:opacity-90 transition-opacity"
        >
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};