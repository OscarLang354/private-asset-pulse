import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, CheckCircle, Link } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletConnectionProps {
  onConnect: (connected: boolean) => void;
  isConnected: boolean;
}

export const WalletConnection = ({ onConnect, isConnected }: WalletConnectionProps) => {
  const { address, isConnected: walletConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Update parent component when wallet connection changes
  React.useEffect(() => {
    onConnect(walletConnected);
  }, [walletConnected, onConnect]);

  if (walletConnected && address) {
    return (
      <Card className="p-4 bg-gradient-to-r from-trading-green/10 to-trading-blue/10 border-trading-green/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-trading-green/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-trading-green" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-trading-green">Wallet Connected</p>
            <p className="text-xs text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => disconnect()}
            className="border-trading-green/30 text-trading-green hover:bg-trading-green/10"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-dashed border-muted-foreground/30">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <Wallet className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Connect Wallet to Trade</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Access encrypted pricing and confidential trading features
          </p>
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        className="bg-gradient-to-r from-trading-green to-trading-blue hover:opacity-90 transition-opacity"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button
                        onClick={openChainModal}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={openChainModal}
                        variant="outline"
                        size="sm"
                        className="border-trading-green/30 text-trading-green hover:bg-trading-green/10"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>

                      <Button
                        onClick={openAccountModal}
                        variant="outline"
                        size="sm"
                        className="border-trading-green/30 text-trading-green hover:bg-trading-green/10"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </Card>
  );
};