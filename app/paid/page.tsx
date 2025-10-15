// app/paid/page.tsx
'use client';

import { useState } from 'react';

export default function PaidPage() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPaidAPI = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/paid');
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
      } else {
        setError(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(`Network Error: ${err}`);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
        }
        .hero {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }
        .card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
        }
        .button:hover {
          background: #0051a5;
        }
        .button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .success {
          color: #28a745;
        }
        .error {
          color: #dc3545;
        }
        .code {
          background: #f4f4f4;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 14px;
        }
        .badge {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }
        .info-item {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
      `}</style>

      <div className="hero">
        <h1>🎉 Premium x402 Page</h1>
        <p>Congratulations! You paid 0.05 USDC to access this page</p>
        <span className="badge">Base Sepolia</span>
      </div>

      <div className="card">
        <h2>✅ Access Unlocked</h2>
        <p>
          This page is protected by the <strong>x402</strong> protocol on <strong>Base Sepolia</strong>.
          The fact that you can see this content means your payment of <strong>0.05 USDC</strong> has been validated!
        </p>

        <div className="info-grid">
          <div className="info-item">
            <h4>🔗 Network</h4>
            <p>Base Sepolia (Testnet)</p>
          </div>
          <div className="info-item">
            <h4>💰 Price</h4>
            <p>0.05 USDC</p>
          </div>
          <div className="info-item">
            <h4>🛡️ Protocol</h4>
            <p>x402 + EIP-3009</p>
          </div>
          <div className="info-item">
            <h4>🏗️ Facilitator</h4>
            <p>x402.org (Public)</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>🔬 Test Protected API</h2>
        <p>Also test the protected API endpoint (<code>/api/paid</code>) which costs 0.01 USDC:</p>
        
        <button 
          className="button" 
          onClick={fetchPaidAPI}
          disabled={loading}
        >
          {loading ? '⏳ Loading...' : '🚀 Test Paid API'}
        </button>

        {error && (
          <div className="error" style={{marginTop: '1rem'}}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {apiData && (
          <div style={{marginTop: '2rem'}}>
            <h3 className="success">✅ API Response:</h3>
            <div className="code">
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>📚 Technical Information</h2>
        <ul>
          <li><strong>Middleware:</strong> x402-next configured for Base Sepolia</li>
          <li><strong>Token:</strong> USDC (EIP-3009 compatible)</li>
          <li><strong>Facilitator:</strong> https://x402.org/facilitator</li>
          <li><strong>Flow:</strong> HTTP 402 → Wallet Signature → Payment → Content</li>
        </ul>
        
        <h3>🔗 Useful Links</h3>
        <ul>
          <li><a href="https://docs.cdp.coinbase.com/x402/welcome" target="_blank">x402 Documentation</a></li>
          <li><a href="https://docs.base.org/tools/network-faucets" target="_blank">Base Sepolia Faucets</a></li>
          <li><a href="https://faucet.circle.com" target="_blank">USDC Testnet Faucet</a></li>
        </ul>
      </div>
    </div>
  );
}
