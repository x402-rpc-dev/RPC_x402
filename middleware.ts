// middleware.ts
import { paymentMiddleware } from 'x402-next';

export const config = {
  // Will protect /api/paid and /paid routes
  matcher: ['/api/paid/:path*', '/paid/:path*'],
};

// Address that receives USDC payments from x402 requests
const RECEIVER_ADDRESS = '0xa51cA7B57F3b4eFDB2e72A738cda1688cf9cbA2D';

export default paymentMiddleware(
  RECEIVER_ADDRESS,                  
  {
    '/api/paid': {
      price: '$0.01',                  
      network: 'base-sepolia',
      config: { 
        description: 'Paid API access (Base Sepolia test)',
        title: 'x402 Premium API'
      },
    },
    '/paid': {
      price: '$0.05',                  
      network: 'base-sepolia',
      config: { 
        description: 'x402 protected page (Base Sepolia test)',
        title: 'Premium Content'
      },
    },
  },
  {
    // Test facilitator (public) for Base Sepolia
    url: 'https://x402.org/facilitator',
    // Optional: timeout and other options
    timeout: 30000,
  }
);
