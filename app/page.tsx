'use client';

import { useState } from 'react';

export default function HomePage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try:
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        
        // Check network
        const chainId = await (window as any).ethereum.request({
          method: 'eth_chainId',
        });
        
        if (chainId !== '0x14a34') { // 84532 in hex = Base Sepolia
          try {
            await (window as any).ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x14a34' }],
            });
          } catch (switchError: any) {
            // If network doesn't exist, add it
            if (switchError.code === 4902) {
              await (window as any).ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x14a34',
                  chainName: 'Base Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia.base.org'],
                  blockExplorerUrls: ['https://sepolia.basescan.org'],
                }],
              });
            }
          }
        }
      } catch (error) {
        console.error('Wallet connection error:', error);
      }
    }
  };

  return (
    <div className="container">
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
        }
        .hero {
          text-align: center;
          margin-bottom: 4rem;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #0070f3 0%, #0051a5 100%);
          color: white;
          border-radius: 16px;
        }
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }
        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          margin: 1rem 0;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }
        .card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        }
        .card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        .button {
          display: inline-block;
          background: #0070f3;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }
        .button:hover {
          background: #0051a5;
        }
        .button.secondary {
          background: #f4f4f4;
          color: #333;
        }
        .button.secondary:hover {
          background: #e0e0e0;
        }
        .wallet-section {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          margin: 2rem 0;
          text-align: center;
        }
        .wallet-connected {
          background: #d4edda;
          border: 1px solid #c3e6cb;
        }
        .status-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .status-connected {
          background: #28a745;
        }
        .status-disconnected {
          background: #dc3545;
        }
        .requirements {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 1.5rem;
          border-radius: 12px;
          margin: 2rem 0;
        }
        .requirements h4 {
          color: #856404;
          margin-bottom: 1rem;
        }
        .requirements ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        .requirements li {
          margin-bottom: 0.5rem;
          color: #856404;
        }
        .requirements a {
          color: #0070f3;
          text-decoration: none;
        }
        .requirements a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="hero">
        <h1>🚀 x402 Base Sepolia POC</h1>
        <p>
          Test the x402 crypto micropayment protocol from Coinbase on Base Sepolia.
          Discover how to monetize your APIs and content with instant USDC payments.
        </p>
        <div className="badge">Base Sepolia Testnet</div>
      </div>

      <div className="wallet-section">
        <h3>
          <span className={`status-indicator ${walletConnected ? 'status-connected' : 'status-disconnected'}`}></span>
          Wallet Status
        </h3>
        {walletConnected ? (
          <div className="wallet-connected">
            <p>✅ Wallet connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            <p>Network: Base Sepolia (Chain ID: 84532)</p>
          </div>
        ) : (
          <div>
            <p>🔗 Connect your wallet to start testing</p>
            <button className="button" onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>

      <div className="requirements">
        <h4>📋 Testing Prerequisites</h4>
        <ul>
          <li>
            <strong>bsETH</strong> (gas fees): 
            <a href="https://docs.base.org/tools/network-faucets" target="_blank" rel="noopener"> Base Sepolia Faucets</a>
          </li>
          <li>
            <strong>bUSDC</strong> (x402 payments): 
            <a href="https://faucet.circle.com" target="_blank" rel="noopener"> Circle USDC Faucet</a>
          </li>
          <li>
            <strong>Wallet</strong> configured on Base Sepolia (Chain ID: 84532)
          </li>
        </ul>
      </div>

      <div className="cards-grid">
        <div className="card">
          <h3>🎯 Protected Web Page</h3>
          <p>
            Test a web page protected by x402. Cost: <strong>0.05 USDC</strong>
          </p>
          <p>
            This page demonstrates how to protect premium content with micropayments.
            After payment, you'll have access to exclusive content.
          </p>
          <a href="/paid" className="button">
            Test Paid Page (0.05 USDC)
          </a>
        </div>

        <div className="card">
          <h3>🔌 Protected API</h3>
          <p>
            Test an API endpoint protected by x402. Cost: <strong>0.01 USDC</strong>
          </p>
          <p>
            Perfect for monetizing your APIs. The endpoint returns JSON data
            after payment validation.
          </p>
          <a href="/api/paid" className="button secondary">
            Test API Directly
          </a>
        </div>

        <div className="card">
          <h3>📊 How It Works</h3>
          <p>
            The x402 protocol uses HTTP 402 (Payment Required) and EIP-3009
            for gasless USDC payments.
          </p>
          <ul style={{textAlign: 'left', margin: '1rem 0'}}>
            <li>Client makes a request</li>
            <li>Server returns HTTP 402</li>
            <li>Wallet signs payment</li>
            <li>Content unlocked</li>
          </ul>
          <a 
            href="https://docs.cdp.coinbase.com/x402/welcome" 
            target="_blank" 
            rel="noopener"
            className="button secondary"
          >
            x402 Documentation
          </a>
        </div>

        <div className="card">
          <h3>🛠️ Configuration</h3>
          <p>
            Receiver address configured in middleware:
          </p>
          <code style={{
            display: 'block',
            background: '#f4f4f4',
            padding: '0.5rem',
            borderRadius: '4px',
            fontSize: '12px',
            wordBreak: 'break-all',
            margin: '1rem 0'
          }}>
            0x742d35Cc6634C0532925a3b8D0c8f5F4d4fD8000
          </code>
          <p style={{fontSize: '14px', color: '#666'}}>
            Payments will be sent to this address.
            Modify it in <code>middleware.ts</code> to use your own address.
          </p>
        </div>
      </div>

      <div className="card" style={{textAlign: 'center', marginTop: '3rem'}}>
        <h3>🎉 Ready to Test?</h3>
        <p>
          Start with the protected page to see the complete x402 payment flow in action!
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="/paid" className="button">
            🚀 Start Testing
          </a>
          <a 
            href="https://github.com/coinbase/x402" 
            target="_blank" 
            rel="noopener"
            className="button secondary"
          >
            📚 View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
