# x402 Base Sepolia POC

🚀 **Proof of Concept** of Coinbase's **x402** protocol on **Base Sepolia**

This project demonstrates the implementation of a crypto micropayment system using the x402 protocol on the Base Sepolia testnet.

## 🎯 What is x402?

x402 is a payment protocol developed by Coinbase that enables monetization of APIs and web content through USDC micropayments. The protocol uses:

- **HTTP 402** (Payment Required) to signal that payment is required
- **EIP-3009** for gasless USDC transfer signatures
- **Base Sepolia** as the test network

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client/User   │    │   Next.js App    │    │   x402.org      │
│                 │    │   + middleware   │    │   Facilitator   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. GET /api/paid      │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │ 2. HTTP 402 + Payment │                       │
         │       Requirements    │                       │
         │◀──────────────────────│                       │
         │                       │                       │
         │ 3. Sign Payment       │ 4. Verify Payment     │
         │   Authorization       │──────────────────────▶│
         │                       │                       │
         │                       │ 5. Payment Confirmed  │
         │                       │◀──────────────────────│
         │                       │                       │
         │ 6. Retry with         │                       │
         │    X-Payment header   │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │ 7. Protected Content  │                       │
         │◀──────────────────────│                       │
```

## 📋 Prerequisites

### 1. Wallet Configuration

Configure your wallet (MetaMask, Coinbase Wallet, etc.) with the **Base Sepolia** network:

- **Network Name**: Base Sepolia
- **RPC URL**: `https://sepolia.base.org`
- **Chain ID**: `84532`
- **Symbol**: `ETH`
- **Explorer**: `https://sepolia.basescan.org`

### 2. Test Funds

You need to obtain test funds:

#### bsETH (for gas fees)
- 🔗 [Base Sepolia Faucets](https://docs.base.org/tools/network-faucets)
- 🔗 [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)

#### bUSDC (for x402 payments)
- 🔗 [Circle USDC Faucet](https://faucet.circle.com) (select "Base Sepolia")

## 🚀 Installation and Configuration

### 1. Clone and install

```bash
git clone <your-repo>
cd x402
npm install
```

### 2. Environment variables configuration

```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local and replace with your address
RECEIVER_ADDRESS=0xYourWalletAddress
```

### 3. Start the development server

```bash
npm run dev
```

The server will be accessible at `http://localhost:3000`

## 🧪 Testing

### Available Protected Routes

1. **Protected Web Page**: `/paid` (cost: 0.05 USDC)
2. **Protected API**: `/api/paid` (cost: 0.01 USDC)

### Test Scenarios

#### Test 1: Protected Web Page
1. Open `http://localhost:3000/paid`
2. Your wallet should open to request a signature
3. Sign the transaction (no gas required thanks to EIP-3009)
4. The premium page displays after payment

#### Test 2: Protected API
1. From the `/paid` page, click "Test Paid API"
2. A new signature request appears
3. Sign to pay 0.01 USDC
4. The API's JSON data is displayed

#### Test 3: Direct API Test
```bash
# Test without payment (should return 402)
curl -v http://localhost:3000/api/paid

# The response will contain the payment requirements
```

## 📊 Monitoring

### Check Received Payments

You can verify payments received at your address via:
- 🔗 [Base Sepolia Explorer](https://sepolia.basescan.org)
- Search for your address and filter USDC transactions

### Server Logs

The server displays detailed logs:
```bash
✅ x402 payment validated for /api/paid
✅ POST payment validated for /api/paid
```

## ⚙️ Advanced Configuration

### Change Prices

Modify `middleware.ts`:
```typescript
'/api/paid': {
  price: '$0.02',  // New price
  network: 'base-sepolia',
  config: { description: 'Premium API' },
},
```

### Use a Custom Facilitator

```typescript
export default paymentMiddleware(
  RECEIVER_ADDRESS,
  routeConfig,
  {
    url: 'https://your-facilitator.com',  // Your facilitator
    timeout: 30000,
  }
);
```

## 🔧 Troubleshooting

### Common Issues

#### "Insufficient funds"
- Check that you have enough bUSDC in your wallet
- Use the [Circle Faucet](https://faucet.circle.com) to get more bUSDC

#### "Transaction failed"
- Check that you have enough bsETH for gas fees
- Use a [Base Sepolia faucet](https://docs.base.org/tools/network-faucets)

#### "Payment not verified"
- Check that your wallet is connected to the correct network (Base Sepolia)
- Verify that the receiver address in `.env.local` is correct

### Debug Logs

To enable detailed logs:
```bash
DEBUG=x402:* npm run dev
```

## 🌐 Moving to Production

### 1. Migrate to Base Mainnet

```typescript
// middleware.ts
export default paymentMiddleware(
  RECEIVER_ADDRESS,
  {
    '/api/paid': {
      price: '$0.01',
      network: 'base',  // Change from 'base-sepolia' to 'base'
    },
  }
);
```

### 2. Use CDP Facilitator (Recommended for production)

```typescript
export default paymentMiddleware(
  RECEIVER_ADDRESS,
  routeConfig,
  {
    url: 'https://facilitator.cdp.coinbase.com',
    apiKey: process.env.CDP_API_KEY,
  }
);
```

## 📚 Resources

### Official Documentation
- 🔗 [x402 Documentation](https://docs.cdp.coinbase.com/x402/welcome)
- 🔗 [Quickstart for Sellers](https://docs.cdp.coinbase.com/x402/quickstart-for-sellers)
- 🔗 [Quickstart for Buyers](https://docs.cdp.coinbase.com/x402/quickstart-for-buyers)

### Tools and Faucets
- 🔗 [Base Sepolia Explorer](https://sepolia.basescan.org)
- 🔗 [Circle USDC Faucet](https://faucet.circle.com)
- 🔗 [Base Sepolia Faucets](https://docs.base.org/tools/network-faucets)

### Examples and Tutorials
- 🔗 [QuickNode x402 Guide](https://www.quicknode.com/guides/infrastructure/how-to-use-x402-payment-required)
- 🔗 [x402 GitHub Repository](https://github.com/coinbase/x402)

## 🤝 Support

For questions or issues:
1. Check the [official documentation](https://docs.cdp.coinbase.com/x402/welcome)
2. Consult the [GitHub issues](https://github.com/coinbase/x402/issues)
3. Join the [Base community](https://base.org/discord)

---

**Happy Building! 🚀**
