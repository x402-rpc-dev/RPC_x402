# x402 Protocol Implementation on Base

🚀 **Production-ready** implementation of Coinbase's **x402** micropayment protocol for monetizing APIs and web content with USDC on Base.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![Base](https://img.shields.io/badge/Base-Mainnet-blue)](https://base.org/)

---

## 📑 Table of Contents

- [What is x402?](#-what-is-x402)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Configuration Guide](#-configuration-guide)
- [Protected Routes & Pricing](#-protected-routes--pricing)
- [Testing](#-testing)
- [Network Configuration](#-network-configuration)
- [Payment Flow](#-payment-flow)
- [Monitoring & Analytics](#-monitoring--analytics)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)
- [API Reference](#-api-reference)
- [Resources](#-resources)

---

## 🎯 What is x402?

x402 is a **payment protocol** developed by Coinbase that enables **pay-per-request monetization** of APIs and web content using USDC micropayments.

### Core Concepts

- **HTTP 402 Status Code**: "Payment Required" - A previously unused HTTP status code now used for micropayments
- **EIP-3009**: `transferWithAuthorization` - Enables gasless USDC transfers via signatures
- **On-chain Verification**: Payments verified on Base blockchain via Coinbase CDP
- **Facilitator**: Intermediary service that verifies payments (x402.org or Coinbase CDP)

### Why x402?

✅ **Granular Monetization**: Pay per request, not monthly subscriptions  
✅ **Developer-Friendly**: Works with existing clients (viem, ethers, web3.py)  
✅ **Low Cost**: Micropayments from $0.0001 to $1.00  
✅ **Gasless for Users**: EIP-3009 signatures require no ETH  
✅ **Instant**: No waiting for confirmations  
✅ **Secure**: Anti-replay, rate limiting, on-chain verification  

---

## ✨ Features

This implementation includes:

- ✅ **Next.js 15** application with App Router
- ✅ **x402-next middleware** for automatic payment handling
- ✅ **Protected routes** with configurable pricing
- ✅ **EIP-3009 integration** for gasless payments
- ✅ **Base network support** (Mainnet and Sepolia)
- ✅ **React UI** with wallet connection
- ✅ **TypeScript** for type safety
- ✅ **Flexible configuration** via environment variables

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client/User   │    │   Next.js App    │    │   Facilitator   │
│   (Browser)     │    │   + x402 MW      │    │   (x402.org)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. GET /paid          │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │ 2. HTTP 402           │                       │
         │    + Challenge        │                       │
         │◀──────────────────────│                       │
         │                       │                       │
         │ 3. Sign Payment       │                       │
         │    (EIP-3009)         │                       │
         │                       │                       │
         │ 4. Retry + X-Payment  │ 5. Verify Payment     │
         │──────────────────────▶│──────────────────────▶│
         │                       │                       │
         │                       │ 6. isValid: true      │
         │                       │◀──────────────────────│
         │                       │                       │
         │ 7. HTTP 200           │                       │
         │    + Content          │                       │
         │◀──────────────────────│                       │
```

### Components

1. **Next.js Application** - Your web app serving protected content
2. **x402 Middleware** - Intercepts requests, enforces payments
3. **Facilitator** - Verifies payments on-chain (x402.org or Coinbase CDP)
4. **Base Blockchain** - Where USDC payments are verified
5. **User's Wallet** - Signs payment authorizations (MetaMask, Coinbase Wallet, etc.)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Wallet with Base network configured
- USDC on Base (for testing payments)
- ETH on Base (small amount for any potential gas)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd x402

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local

# Edit .env.local with your receiver address
# RECEIVER_ADDRESS=0xYourAddressHere
```

### Running the App

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit `http://localhost:3000` to see the app.

---

## ⚙️ Configuration Guide

### Environment Variables

Create `.env.local` from `env.example`:

```bash
# Required: Address that receives USDC payments
RECEIVER_ADDRESS=0x742d35Cc6634C0532925a3b8D0c8f5F4d4fD8000

# Network: 'base' for mainnet, 'base-sepolia' for testnet
NETWORK=base

# Optional: Override default prices
API_PRICE=$0.01
PAGE_PRICE=$0.05

# Optional: Custom facilitator
FACILITATOR_URL=https://x402.org/facilitator

# Next.js public variables
NEXT_PUBLIC_NETWORK=base
NEXT_PUBLIC_CHAIN_ID=8453
```

### Middleware Configuration

Edit `middleware.ts` to configure protected routes:

```typescript
import { paymentMiddleware } from 'x402-next';

const RECEIVER_ADDRESS = process.env.RECEIVER_ADDRESS || '0xYourAddress';

export const config = {
  matcher: ['/api/paid/:path*', '/paid/:path*'],  // Routes to protect
};

export default paymentMiddleware(
  RECEIVER_ADDRESS,  // Your wallet address
  {
    // Configure each protected route
    '/api/paid': {
      price: '$0.01',           // Price in USD
      network: 'base',          // 'base' or 'base-sepolia'
      config: { 
        description: 'Paid API access',
        title: 'x402 Premium API'
      },
    },
    '/paid': {
      price: '$0.05',
      network: 'base',
      config: { 
        description: 'x402 protected page',
        title: 'Premium Content'
      },
    },
  },
  {
    // Facilitator configuration
    url: 'https://x402.org/facilitator',  // Public facilitator
    timeout: 30000,  // 30 seconds
  }
);
```

---

## 💰 Protected Routes & Pricing

This implementation includes **2 protected routes** with different pricing models:

### 1. Protected Web Page (`/paid`)

**Route**: `/paid`  
**Method**: `GET`  
**Price**: **$0.05 USDC**  
**Network**: Base Mainnet  
**Description**: Premium content page  

**What it does**:
- Displays premium content after payment
- Shows technical information about x402
- Includes interactive API testing interface
- Demonstrates complete payment flow

**Use case**: Monetize articles, tutorials, premium content

---

### 2. Protected API Endpoint (`/api/paid`)

**Route**: `/api/paid`  
**Methods**: `GET`, `POST`  
**Price**: **$0.01 USDC**  
**Network**: Base Mainnet  
**Description**: Paid API access  

**GET Response** (after payment):
```json
{
  "message": "🎉 Congratulations! You have access to premium data",
  "secret": "The answer to everything is 42",
  "timestamp": "2025-10-15T10:30:00.000Z",
  "network": "Base Sepolia",
  "protocol": "x402",
  "price_paid": "$0.01 USDC",
  "premium_data": {
    "crypto_tip": "HODL responsibly 🚀",
    "market_insight": "Crypto micropayments will revolutionize the web",
    "tech_fact": "x402 uses EIP-3009 for transfer signatures"
  }
}
```

**POST Endpoint** (after payment):
```json
{
  "message": "📝 Data received and processed successfully",
  "received": { /* your posted data */ },
  "timestamp": "2025-10-15T10:30:00.000Z",
  "status": "processed_with_payment"
}
```

**Use case**: Monetize API calls, AI inference, data processing, premium features

---

## 🔧 Customizing Routes & Pricing

### Add a New Protected Route

```typescript
// In middleware.ts, add to the routes object:
'/api/premium-feature': {
  price: '$0.25',              // Price per request
  network: 'base',             // Network
  config: { 
    description: 'Premium AI feature',
    title: 'AI Analysis API'
  },
},
```

Then create the handler:

```typescript
// app/api/premium-feature/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Your premium logic here
  const result = await performExpensiveOperation(body);
  
  return NextResponse.json({ result });
}
```

### Pricing Tiers

Recommended pricing based on resource cost:

| Resource Type | Suggested Price | Example Use Case |
|--------------|-----------------|------------------|
| Simple query | $0.001 - $0.01 | Database lookup, simple API call |
| Medium computation | $0.01 - $0.10 | Data processing, analytics |
| Heavy computation | $0.10 - $1.00 | AI inference, complex analysis |
| Content access | $0.05 - $0.50 | Articles, videos, premium content |
| File download | $0.50 - $5.00 | Reports, datasets, media files |

### Dynamic Pricing

You can implement dynamic pricing based on request parameters:

```typescript
// Note: x402-next doesn't support dynamic pricing natively yet
// You'll need to implement custom logic or use multiple routes

// Example: Different prices for different tiers
'/api/tier1': { price: '$0.01', ... },
'/api/tier2': { price: '$0.05', ... },
'/api/tier3': { price: '$0.25', ... },
```

---

## 🧪 Testing

### Prerequisites for Testing

**Option A: Mainnet (Real Money)**
- ETH on Base (for gas) - Get via [Base Bridge](https://bridge.base.org)
- USDC on Base (for payments) - Get via [Bridge](https://bridge.base.org) or [Coinbase](https://www.coinbase.com)
- Set `network: 'base'` in `middleware.ts`

**Option B: Testnet (Free)**
- Test ETH on Base Sepolia - Get from [faucets](https://docs.base.org/tools/network-faucets)
- Test USDC on Base Sepolia - Get from [Circle Faucet](https://faucet.circle.com)
- Set `network: 'base-sepolia'` in `middleware.ts`

### Test Scenario 1: Protected Web Page

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Navigate to protected page**
   ```
   http://localhost:3000/paid
   ```

3. **Expected behavior**:
   - Page loads, triggers x402 middleware
   - HTTP 402 response with payment challenge
   - Wallet opens automatically (MetaMask/Coinbase Wallet)
   - Sign the payment authorization (no gas needed)
   - Payment verified on-chain
   - Page content displays

4. **What to verify**:
   - ✅ Wallet signature popup appears
   - ✅ Payment amount shows 0.05 USDC
   - ✅ Network is Base Mainnet (or Sepolia if testing)
   - ✅ After signing, content appears
   - ✅ Check your receiver address got the USDC

### Test Scenario 2: Protected API Endpoint

1. **From the `/paid` page, click "Test Paid API"**

2. **Expected behavior**:
   - Fetch request to `/api/paid`
   - HTTP 402 challenge
   - Wallet signature for 0.01 USDC
   - API responds with JSON data

3. **Verify the response**:
   ```json
   {
     "message": "🎉 Congratulations! You have access to premium data",
     "secret": "The answer to everything is 42",
     "premium_data": { ... }
   }
   ```

### Test Scenario 3: Direct API Call

Test the API without the UI:

```bash
# Without payment (should return 402)
curl -v http://localhost:3000/api/paid
```

**Expected response**:
```
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "x402Version": 1,
  "error": "X-PAYMENT header is required",
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "maxAmountRequired": "10000",
      "resource": "http://localhost:3000/api/paid",
      "description": "Paid API access",
      "mimeType": "application/json",
      "payTo": "0x742D35cc6634C0532925A3B8d0c8f5f4d4FD8000",
      "maxTimeoutSeconds": 300,
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "outputSchema": {
        "input": {
          "type": "http",
          "method": "GET",
          "discoverable": true
        }
      },
      "extra": {
        "name": "USDC",
        "version": "2"
      }
    }
  ]
}
```

### Test Scenario 4: POST Request

```bash
# POST to protected API
curl -X POST http://localhost:3000/api/paid \
  -H 'Content-Type: application/json' \
  -d '{"test": "data"}'
```

**Expected**: HTTP 402, then after payment:
```json
{
  "message": "📝 Data received and processed successfully",
  "received": { "test": "data" },
  "timestamp": "2025-10-15T...",
  "status": "processed_with_payment"
}
```

---

## 🌐 Network Configuration

### Mainnet Configuration (Production)

**Use this for production with real money**

#### middleware.ts
```typescript
network: 'base',  // Base Mainnet
```

#### app/page.tsx (Wallet connection)
```typescript
chainId: '0x2105',  // 8453 in hex
chainName: 'Base Mainnet',
rpcUrls: ['https://mainnet.base.org'],
blockExplorerUrls: ['https://basescan.org'],
```

#### Network Details
- **Chain ID**: 8453 (0x2105 in hex)
- **RPC**: https://mainnet.base.org
- **Explorer**: https://basescan.org
- **USDC Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Currency**: Real ETH and USDC

### Testnet Configuration (Development)

**Use this for testing with free funds**

#### middleware.ts
```typescript
network: 'base-sepolia',  // Base Sepolia Testnet
```

#### app/page.tsx (Wallet connection)
```typescript
chainId: '0x14a34',  // 84532 in hex
chainName: 'Base Sepolia',
rpcUrls: ['https://sepolia.base.org'],
blockExplorerUrls: ['https://sepolia.basescan.org'],
```

#### Network Details
- **Chain ID**: 84532 (0x14a34 in hex)
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **USDC Contract**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Currency**: Test ETH and USDC (free from faucets)

#### Getting Test Funds

1. **Test ETH (for gas)**:
   - [Base Sepolia Faucet](https://docs.base.org/tools/network-faucets)
   - [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)

2. **Test USDC (for payments)**:
   - [Circle USDC Faucet](https://faucet.circle.com) - Select "Base Sepolia"

---

## 💳 Payment Flow Explained

### Step-by-Step Flow

1. **User requests protected content**
   ```
   GET /paid
   ```

2. **Middleware detects no payment**
   - Checks for `X-Payment` header
   - Not found → Generate payment challenge

3. **Server returns HTTP 402**
   ```json
   {
     "x402Version": 1,
     "amount": "0.05",
     "network": "base",
     "token": "USDC",
     "requestHash": "abc123...",
     "accepts": [{ ... }]
   }
   ```

4. **Client signs payment**
   - User's wallet opens
   - EIP-3009 `transferWithAuthorization` signature
   - No gas required (signature only)

5. **Client retries with payment**
   ```
   GET /paid
   X-Payment: <base64-encoded-payment-data>
   ```

6. **Middleware verifies payment**
   - Sends payment to facilitator
   - Facilitator checks on-chain
   - Returns `isValid: true/false`

7. **Content delivered**
   - If valid: HTTP 200 + protected content
   - If invalid: HTTP 400 + error message

### Payment Challenge Fields

| Field | Type | Description |
|-------|------|-------------|
| `x402Version` | number | Protocol version (currently 1) |
| `payment` | string | Payment type ("x402") |
| `scheme` | string | Payment scheme ("onchain") |
| `network` | string | Blockchain network ("base", "base-sepolia") |
| `token` | string | Payment token ("USDC") |
| `amount` | string | Required amount in USDC ("0.05") |
| `description` | string | What the payment is for |
| `requestHash` | string | Unique hash tying payment to this request |
| `ttl` | number | Time to live in seconds (300) |
| `accepts` | array | Payment options with details |

### Payment Headers

**Request Headers (Client → Server)**:
- `X-Payment: <base64>` - Payment authorization data
- Alternative: `X-402-Receipt: <base64>` or `Authorization: X402 <base64>`

**Response Headers (Server → Client)**:
- `X-Payment-Response: <base64>` - Payment verification details
- Includes: payer address, amount, timestamp

---

## 📊 Monitoring & Analytics

### Server Logs

The application logs payment events:

```bash
✅ x402 payment validated for /api/paid
✅ POST payment validated for /api/paid
```

### Monitoring Payments

#### On Mainnet
1. Visit [BaseScan](https://basescan.org)
2. Search for your `RECEIVER_ADDRESS`
3. Filter for USDC transfers
4. Each payment will show:
   - Payer address
   - Amount (0.01 or 0.05 USDC)
   - Timestamp
   - Transaction hash

#### On Testnet
Same process on [Base Sepolia Explorer](https://sepolia.basescan.org)

### Analytics Ideas

Track in your application:
- Total payments received
- Most popular endpoints
- Payment success/failure rates
- Average revenue per user
- Geographic distribution (via IP)

---

## 🔐 Production Deployment

### Deployment Checklist

- [ ] **Environment Setup**
  - [ ] Set `RECEIVER_ADDRESS` to your production wallet
  - [ ] Configure `network: 'base'` for mainnet
  - [ ] Set production facilitator (optional: CDP)
  - [ ] Never commit `.env.local`

- [ ] **Security**
  - [ ] Enable HTTPS/TLS
  - [ ] Implement rate limiting
  - [ ] Set up CORS properly
  - [ ] Monitor for abuse patterns
  - [ ] Backup payment logs

- [ ] **Testing**
  - [ ] Test on Base Sepolia first
  - [ ] Test with small mainnet amounts
  - [ ] Verify payment reception
  - [ ] Test all protected routes
  - [ ] Load testing

- [ ] **Monitoring**
  - [ ] Set up error tracking (Sentry, etc.)
  - [ ] Monitor payment failures
  - [ ] Track revenue metrics
  - [ ] Alert on downtime

### Recommended Stack

**Hosting**:
- [Vercel](https://vercel.com) - Optimal for Next.js
- [Railway](https://railway.app) - Simple deployment
- [Fly.io](https://fly.io) - Global edge deployment

**Domain & SSL**:
- Custom domain with HTTPS
- Vercel provides automatic SSL

**Monitoring**:
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Axiom](https://axiom.co) - Log management

### Using Coinbase CDP Facilitator (Recommended)

For production with compliance features (KYT/OFAC):

1. **Get CDP API Keys**:
   - Sign up at [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
   - Create a new project
   - Generate API keys

2. **Update middleware.ts**:
   ```typescript
   export default paymentMiddleware(
     RECEIVER_ADDRESS,
     routeConfig,
     {
       url: 'https://facilitator.cdp.coinbase.com',
       apiKey: process.env.CDP_API_KEY,
       apiSecret: process.env.CDP_API_SECRET,
     }
   );
   ```

3. **Add to .env.local**:
   ```bash
   CDP_API_KEY=your-api-key
   CDP_API_SECRET=your-api-secret
   ```

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### "Insufficient funds"

**Symptom**: Payment fails with insufficient balance error

**Solutions**:
- **Mainnet**: Ensure you have USDC on Base
  - Check balance: [BaseScan](https://basescan.org)
  - Bridge more: [Base Bridge](https://bridge.base.org)
  
- **Testnet**: Get test USDC
  - [Circle Faucet](https://faucet.circle.com) (select Base Sepolia)

#### "Transaction failed" or "Gas estimation failed"

**Symptom**: Transaction fails during signing

**Solutions**:
- Ensure you have ETH on Base for gas (even though EIP-3009 is gasless, some wallets may check)
- Switch to correct network (Base Mainnet vs Sepolia)
- Try again after a few seconds

#### "Payment not verified"

**Symptom**: Payment signed but content not unlocked

**Solutions**:
- Check middleware logs for errors
- Verify `RECEIVER_ADDRESS` is correct
- Ensure facilitator is responding (check `/_health`)
- Verify wallet is on correct network
- Check USDC contract address matches network

#### "Wrong network"

**Symptom**: Wallet on different chain than configured

**Solutions**:
- Click "Connect Wallet" on home page to auto-switch
- Manually switch in wallet to Base Mainnet (Chain ID: 8453)
- Or Base Sepolia (Chain ID: 84532) for testing

#### "Module not found: x402-next"

**Symptom**: Build fails with missing module

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Ensure Next.js 15+
npm list next
```

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment variable
DEBUG=x402:* npm run dev

# Or in .env.local
DEBUG=x402:*
```

This will show:
- Payment challenge generation
- Payment verification requests
- Facilitator responses
- Middleware decisions

---

## 📖 API Reference

### Payment Middleware

```typescript
paymentMiddleware(
  receiverAddress: string,
  routes: RouteConfig,
  options?: FacilitatorOptions
)
```

**Parameters**:

#### `receiverAddress` (required)
- Type: `string`
- Your Ethereum address that receives USDC
- Example: `'0x742d35Cc6634C0532925a3b8D0c8f5F4d4fD8000'`

#### `routes` (required)
- Type: `Record<string, RouteConfig>`
- Object mapping route paths to payment configurations

**RouteConfig**:
```typescript
{
  price: string,           // Price in USD: '$0.01', '$1.00', etc.
  network: string,         // 'base' | 'base-sepolia'
  config: {
    description: string,   // What this payment is for
    title: string,         // Display title
  }
}
```

#### `options` (optional)
- Type: `FacilitatorOptions`

```typescript
{
  url: string,             // Facilitator URL
  timeout?: number,        // Request timeout (ms)
  apiKey?: string,         // CDP API key (if using CDP facilitator)
  apiSecret?: string,      // CDP API secret
}
```

### Matcher Configuration

```typescript
export const config = {
  matcher: [
    '/api/paid/:path*',    // Protects /api/paid and all sub-paths
    '/paid/:path*',        // Protects /paid and all sub-paths
  ],
};
```

**Matcher patterns**:
- `/exact` - Exact path only
- `/path/:param` - With parameter
- `/path*` - Path and everything after
- `/path/:param*` - Parameter and sub-paths

### Response Types

#### Successful Payment (HTTP 200)
```typescript
{
  // Your API response
}
```

#### Payment Required (HTTP 402)
```typescript
{
  x402Version: 1,
  payment: "x402",
  scheme: "onchain",
  network: "base" | "base-sepolia",
  token: "USDC",
  amount: string,
  description: string,
  requestHash: string,
  ttl: number,
  accepts: Array<AcceptOption>
}
```

#### Payment Invalid (HTTP 400)
```typescript
{
  error: "invalid_payment",
  message: string
}
```

---

## 💡 Use Cases & Examples

### Use Case 1: AI API Monetization

```typescript
'/api/ai/generate': {
  price: '$0.10',
  network: 'base',
  config: { 
    description: 'AI text generation',
    title: 'GPT-4 API Access'
  },
},
```

### Use Case 2: Premium Content

```typescript
'/articles/premium/:id': {
  price: '$0.25',
  network: 'base',
  config: { 
    description: 'Premium article access',
    title: 'Premium Content'
  },
},
```

### Use Case 3: Data Analytics

```typescript
'/api/analytics/report': {
  price: '$0.50',
  network: 'base',
  config: { 
    description: 'Analytics report generation',
    title: 'Analytics API'
  },
},
```

### Use Case 4: File Downloads

```typescript
'/api/download/:fileId': {
  price: '$1.00',
  network: 'base',
  config: { 
    description: 'File download access',
    title: 'File Access'
  },
},
```

---

## 🔒 Security Considerations

### Anti-Replay Protection

The x402 middleware includes built-in anti-replay:
- Each payment is tied to a unique `requestHash`
- Payments can only be used once
- TTL limits payment validity window

### Rate Limiting

Consider adding rate limiting:

```typescript
// Example with next-rate-limit
import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function GET(request: Request) {
  await limiter.check(request, 10, 'CACHE_TOKEN');
  // Your handler...
}
```

### CORS Configuration

Already included in `next.config.js`:

```javascript
async headers() {
  return [{
    source: '/api/(.*)',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type, X-Payment' },
    ],
  }];
}
```

For production, restrict origins:
```javascript
{ key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' }
```

---

## 📚 Resources

### Official Documentation
- 📖 [x402 Protocol Documentation](https://docs.cdp.coinbase.com/x402/welcome)
- 📖 [x402 Quickstart for Sellers](https://docs.cdp.coinbase.com/x402/quickstart-for-sellers)
- 📖 [x402 Quickstart for Buyers](https://docs.cdp.coinbase.com/x402/quickstart-for-buyers)
- 📖 [Network & Token Support](https://docs.cdp.coinbase.com/x402/network-support)
- 📖 [How x402 Works](https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works)

### NPM Packages
- 📦 [x402-next](https://www.npmjs.com/package/x402-next) - Next.js middleware
- 📦 [x402-express](https://www.npmjs.com/package/x402-express) - Express middleware
- 📦 [x402-fetch](https://www.npmjs.com/package/x402-fetch) - Client-side wrapper

### Base Network
- 🔗 [Base Official Site](https://base.org)
- 🔗 [Base Documentation](https://docs.base.org)
- 🔗 [Base Bridge](https://bridge.base.org)
- 🔗 [BaseScan Explorer](https://basescan.org)
- 🔗 [Base Sepolia Explorer](https://sepolia.basescan.org)

### Faucets (Testnet Only)
- 💧 [Base Sepolia Faucet](https://docs.base.org/tools/network-faucets)
- 💧 [Alchemy Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
- 💧 [Circle USDC Faucet](https://faucet.circle.com)

### Code Examples
- 💻 [x402 GitHub Repository](https://github.com/coinbase/x402)
- 💻 [QuickNode x402 Tutorial](https://www.quicknode.com/guides/infrastructure/how-to-use-x402-payment-required)
- 💻 [x402 AI Starter Template](https://vercel.com/new/templates/ai/x402-ai-starter)

### Community
- 💬 [Base Discord](https://base.org/discord)
- 💬 [Coinbase Developer Forum](https://forums.coinbase.com)
- 🐦 [Base Twitter](https://twitter.com/base)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- [Coinbase](https://www.coinbase.com) for the x402 protocol
- [Base](https://base.org) for the L2 network
- [Next.js](https://nextjs.org) team
- The Web3 community

---

**Built with ❤️ using x402 Protocol**

Version: 0.1.0  
Network: Base (Mainnet & Sepolia supported)  
Status: Production Ready ✅

For questions: Open an issue on GitHub
