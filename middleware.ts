// middleware.ts
import { paymentMiddleware } from 'x402-next';

export const config = {
  // Will protect /api/paid and /paid routes
  matcher: ['/api/paid/:path*', '/paid/:path*'],
};

// REPLACE this address with YOUR address that will receive USDC
const RECEIVER_ADDRESS = '0x742d35Cc6634C0532925a3b8D0c8f5F4d4fD8000'; // CHANGE THIS ADDRESS!

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
