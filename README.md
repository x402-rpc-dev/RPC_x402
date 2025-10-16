# x402 Protocol on Base

🚀 **x402 micropayment protocol** - Monetize APIs with USDC on Base

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base](https://img.shields.io/badge/Base-Mainnet-blue)](https://base.org/)
[![x402](https://img.shields.io/badge/x402-v1-purple)](https://docs.cdp.coinbase.com/x402/welcome)

---

## 📑 Table of Contents

### Part 1: x402 RPC Endpoint (Production Service)
- [What is x402?](#-what-is-x402)
- [x402 RPC Endpoint](#-x402-rpc-endpoint---production-service)
- [Endpoints](#-available-endpoints)
- [Free RPC Methods](#-free-methods-21-methods)
- [Paid RPC Methods](#-paid-methods-25-methods)
- [Integration Examples](#-client-integration)
- [RPC Pricing Details](#-pricing-details)

### Part 2: Starter Kit (This Repository)
- [About This Repository](#-about-this-repository-starter-kit)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Protected Routes](#-protected-routes-in-this-repo)
- [Testing](#-testing)
- [Deployment](#-deployment)

### General
- [Resources](#-resources)

---

# Part 1: x402 RPC Endpoint - Production Service

## 🎯 What is x402?

x402 is a **payment protocol** developed by Coinbase that enables **pay-per-request monetization** using USDC micropayments.

### Key Features

✅ **Granular Monetization**: Pay per request, not subscriptions  
✅ **Gasless Payments**: EIP-3009 signatures, no ETH needed  
✅ **Developer-Friendly**: Works with viem, ethers, web3.py  
✅ **Low Cost**: Micropayments from $0.0001 to $1.00  
✅ **Instant**: No waiting for confirmations  
✅ **Secure**: Anti-replay, on-chain verification  

---

## 🌐 x402 RPC Endpoint - Production Service

We operate a **production x402 JSON-RPC endpoint** on **Base Mainnet** with pay-per-request pricing.

### 🔗 Available Endpoints

| Endpoint | Description | Public |
|----------|-------------|--------|
| **`https://rpc.x402.vip/rpc`** | Main JSON-RPC endpoint | ✅ |
| **`https://rpc.x402.vip/_health`** | Health check | ✅ |
| **`https://rpc.x402.vip/_pricing`** | Full pricing list | ✅ |
| **`https://rpc.x402.vip/metrics`** | Prometheus metrics | ✅ |

### ⚡ Quick Test

```bash
# Health check
curl -s https://rpc.x402.vip/_health | jq '.'

# Free request (no payment)
python3 -c "
import json, urllib.request
req = urllib.request.Request(
    'https://rpc.x402.vip/rpc',
    data=json.dumps({'jsonrpc':'2.0','id':1,'method':'eth_blockNumber','params':[]}).encode(),
    headers={'content-type':'application/json'}
)
with urllib.request.urlopen(req) as r:
    print(json.loads(r.read().decode()))
"

# Paid request (will return HTTP 402)
python3 -c "
import json, urllib.request, urllib.error
req = urllib.request.Request(
    'https://rpc.x402.vip/rpc',
    data=json.dumps({'jsonrpc':'2.0','id':2,'method':'eth_getLogs','params':[{'address':'0x0000000000000000000000000000000000000000','fromBlock':'latest','toBlock':'latest'}]}).encode(),
    headers={'content-type':'application/json'}
)
try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print(f'HTTP {e.code}')
    print(json.loads(e.read().decode()))
"
```

---

## 🆓 Free Methods (21 methods)

The following methods are **FREE** when querying the latest state:

### Network Information
- `web3_clientVersion`
- `net_version`
- `net_listening`
- `eth_chainId`
- `eth_syncing`

### Block Information
- `eth_blockNumber`
- `eth_getBlockByNumber(latest, false)` - Latest block only, without full transactions
- `eth_getBlockByHash(hash, false)` - Block by hash, without full transactions

### Gas & Fees
- `eth_gasPrice`
- `eth_maxPriorityFeePerGas`
- `eth_feeHistory` - Limited to ≤ 20 blocks
- `eth_estimateGas`

### Account State (latest only)
- `eth_getBalance(address, "latest")`
- `eth_getCode(address, "latest")`
- `eth_getStorageAt(address, position, "latest")`
- `eth_getTransactionCount(address, "latest")`
- `eth_call(params, "latest")`

### Transactions
- `eth_getTransactionByHash`
- `eth_getTransactionReceipt`
- `eth_getTransactionByBlockNumberAndIndex`
- `eth_getTransactionByBlockHashAndIndex`

> **Note**: `"latest"` block tag is free. Historical queries (specific block numbers) are paid.

---

## 💰 Paid Methods (25+ methods)

### Standard Paid Methods

| Method | Price (USDC) | TTL | Description |
|--------|--------------|-----|-------------|
| **`eth_getLogs`** | **$0.005** | 60s | Event logs (requires `address` param, max 5000 blocks window) |
| **`trace_block`** | **$0.020** | 300s | Full block trace |
| **`trace_transaction`** | **$0.010** | 300s | Transaction trace |
| **`trace_call`** | **$0.006** | 300s | Call trace |
| **`eth_sendRawTransaction`** | **$0.0010** | 60s | Submit transaction |

### Conditional Pricing (Historical Queries)

These methods are **FREE for `"latest"`**, but **PAID for historical blocks**:

| Method | Historical Price | Description |
|--------|------------------|-------------|
| `eth_getBalance(address, blockNumber)` | **$0.0010** | Balance at specific block |
| `eth_getCode(address, blockNumber)` | **$0.0010** | Contract code at block |
| `eth_getStorageAt(address, pos, block)` | **$0.0010** | Storage at block |
| `eth_getTransactionCount(address, block)` | **$0.0010** | Nonce at block |
| `eth_call(params, blockNumber)` | **$0.0010** | Call at specific block |

### Full Transaction Data

| Method | Price | Description |
|--------|-------|-------------|
| `eth_getBlockByNumber(num, true)` | **$0.0008** | Block with full transaction objects |
| `eth_getBlockByHash(hash, true)` | **$0.0008** | Block with full transactions |

> **Note**: Setting the second parameter to `false` (only transaction hashes) is free for latest block.

### Filters & Subscriptions

| Method | Initial Price | Recurring Cost | Description |
|--------|---------------|----------------|-------------|
| **`eth_newFilter`** | **$0.002** | **+$0.001/day** | Create new filter |
| **`eth_getFilterChanges`** | **$0.0005** | per call | Get filter updates |
| **`eth_getFilterLogs`** | **$0.001** | per call | Get all filter logs |
| **`eth_subscribe`** | **$0.005** | **+$0.005/hour** | WebSocket subscription |
| `eth_uninstallFilter` | **FREE** | - | Remove filter |
| `eth_unsubscribe` | **FREE** | - | Unsubscribe |

---

## 🔌 Client Integration

### Option 1: viem (Recommended)

```javascript
import { createPublicClient, http, createWalletClient } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment } from "x402-fetch";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const walletClient = createWalletClient({ 
  account, 
  chain: base, 
  transport: http() 
});

// Wrap fetch to handle 402 payments automatically
const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient, { 
  maxValue: "0.05"  // Max USDC per request
});

const client = createPublicClient({
  chain: base,
  transport: http("https://rpc.x402.vip/rpc", { fetch: fetchWithPayment }),
});

// Free method
const blockNumber = await client.getBlockNumber();
console.log("Current block:", blockNumber);

// Paid method (will automatically pay if needed)
const logs = await client.getLogs({
  address: "0xYourContractAddress",
  fromBlock: "latest",
  toBlock: "latest"
});
console.log("Logs:", logs);  // Automatically paid $0.005
```

### Option 2: ethers.js v6

```javascript
import { JsonRpcProvider } from "ethers";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment } from "x402-fetch";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const walletClient = createWalletClient({ 
  account, 
  chain: base, 
  transport: http() 
});

// Override global fetch BEFORE creating provider
globalThis.fetch = wrapFetchWithPayment(fetch, walletClient, { 
  maxValue: "0.05" 
});

const provider = new JsonRpcProvider("https://rpc.x402.vip/rpc", 8453);

// Free
console.log(await provider.getBlockNumber());

// Paid (automatically handled)
console.log(await provider.getLogs({
  address: "0xYourContract",
  fromBlock: "latest",
  toBlock: "latest"
}));
```

### Option 3: Direct HTTP (Python)

```python
import json
import urllib.request
import urllib.error

url = "https://rpc.x402.vip/rpc"

# Free method
data = {"jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": []}
req = urllib.request.Request(url, 
    data=json.dumps(data).encode(),
    headers={'content-type': 'application/json'})
    
with urllib.request.urlopen(req) as response:
    result = json.loads(response.read().decode())
    print(result)  # {"jsonrpc":"2.0","id":1,"result":"0x..."}

# Paid method (will get HTTP 402)
data = {"jsonrpc": "2.0", "id": 2, "method": "eth_getLogs", 
        "params": [{"address": "0x...", "fromBlock": "latest", "toBlock": "latest"}]}
        
try:
    req = urllib.request.Request(url, 
        data=json.dumps(data).encode(),
        headers={'content-type': 'application/json'})
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    if e.code == 402:
        challenge = json.loads(e.read().decode())
        print(f"Payment required: {challenge['amount']} USDC")
        print(f"Pay to: {challenge['accepts'][0]['payto']}")
        # Implement payment logic here
```

---

## 📊 Pricing Details

### Price Structure

- **Free tier**: Basic read operations on latest state
- **Micro tier**: $0.0005 - $0.002 per call (simple queries)
- **Standard tier**: $0.005 - $0.010 per call (logs, traces)
- **Premium tier**: $0.010 - $0.020 per call (complex traces)
- **Subscriptions**: Initial fee + hourly/daily recurring

### Cost Examples

**Typical usage** (1000 requests/day):
- 900 free requests (eth_blockNumber, etc.) = **$0**
- 100 eth_getLogs calls = **$0.50**
- **Total**: **$0.50/day** = **~$15/month**

**Heavy usage** (10,000 requests/day):
- 5,000 free requests = **$0**
- 3,000 eth_getLogs = **$15**
- 2,000 historical queries = **$2**
- **Total**: **$17/day** = **~$510/month**

Compare to traditional RPC providers:
- Alchemy: ~$50-200/month (subscription)
- Infura: ~$50-200/month (subscription)
- **x402 RPC**: Pay only what you use

---

## 🛡️ RPC Features

### Security & Reliability

- ✅ **Rate Limiting**: 25 requests/second per API key
- ✅ **Anti-Replay**: LRU cache prevents duplicate payments
- ✅ **Guardrails**: `eth_getLogs` requires `address`, max 5000 blocks
- ✅ **Body Limits**: Max 2 MiB per request, max 10 batch requests
- ✅ **TLS/HTTPS**: Caddy with Let's Encrypt
- ✅ **Uptime**: 99.9% SLA target

### Observability

- **Metrics**: Prometheus at `/metrics`
- **Logs**: Structured JSON logging (Pino)
- **Health**: Real-time status at `/_health`

### Response Headers

Every response includes:
```
ratelimit-policy: 25;w=1
ratelimit-limit: 25
ratelimit-remaining: 24
ratelimit-reset: 60
x-payment-response: <base64>  # If payment was made
```

---

## 🔍 RPC Method Details

### eth_getLogs (Paid: $0.005)

**Requirements**:
- ✅ `address` parameter is **required**
- ✅ Block window ≤ 5000 blocks
- ❌ Returns `400 address_required` if address missing
- ❌ Returns `400 window_too_large` if window > 5000

**Example**:
```javascript
await client.getLogs({
  address: "0xContractAddress",  // Required
  fromBlock: 1000000n,
  toBlock: 1001000n,  // Max 5000 blocks from fromBlock
  topics: [...]
});
// Cost: $0.005 USDC
```

### trace_block (Paid: $0.020)

Full trace of all transactions in a block.

```javascript
// Using web3.py or direct HTTP
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "trace_block",
  "params": ["0x1234"]  // Block number in hex
}
// Cost: $0.020 USDC
```

### trace_transaction (Paid: $0.010)

Trace a specific transaction.

```javascript
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "trace_transaction",
  "params": ["0xTransactionHash"]
}
// Cost: $0.010 USDC
```

### Historical Queries (Paid: $0.0010 each)

When using specific block numbers instead of `"latest"`:

```javascript
// Free
await client.getBalance({ 
  address: "0x...", 
  blockTag: "latest" 
});

// Paid $0.0010
await client.getBalance({ 
  address: "0x...", 
  blockNumber: 1000000n 
});
```

---

## 📖 Complete Method List

### Free Methods (21)

```
web3_clientVersion
net_version
net_listening
eth_chainId
eth_blockNumber
eth_gasPrice
eth_maxPriorityFeePerGas
eth_feeHistory (≤20 blocks)
eth_syncing
eth_estimateGas
eth_getBalance (latest only)
eth_getCode (latest only)
eth_getStorageAt (latest only)
eth_getTransactionCount (latest only)
eth_call (latest only)
eth_getBlockByNumber (latest, false)
eth_getBlockByHash (tip, false)
eth_getTransactionByHash
eth_getTransactionReceipt
eth_getTransactionByBlockNumberAndIndex
eth_getTransactionByBlockHashAndIndex
```

### Paid Methods (25+)

| Method | Price | Notes |
|--------|-------|-------|
| `eth_getLogs` | $0.005 | Requires address, ≤5000 blocks |
| `trace_block` | $0.020 | Full block trace |
| `trace_transaction` | $0.010 | Transaction trace |
| `trace_call` | $0.006 | Call trace |
| `eth_sendRawTransaction` | $0.0010 | Submit transaction |
| `eth_getBalance (historical)` | $0.0010 | Specific block number |
| `eth_getCode (historical)` | $0.0010 | Code at block |
| `eth_getStorageAt (historical)` | $0.0010 | Storage at block |
| `eth_getTransactionCount (historical)` | $0.0010 | Nonce at block |
| `eth_call (historical)` | $0.0010 | Call at specific block |
| `eth_getBlockByNumber (full tx)` | $0.0008 | Full transaction objects |
| `eth_getBlockByHash (full tx)` | $0.0008 | Full transactions |
| `eth_newFilter` | $0.002 + $0.001/day | Create filter |
| `eth_getFilterChanges` | $0.0005 | Poll filter |
| `eth_getFilterLogs` | $0.001 | Get all logs |
| `eth_subscribe` | $0.005 + $0.005/hour | WebSocket subscription |
| `eth_uninstallFilter` | FREE | Remove filter |
| `eth_unsubscribe` | FREE | Unsubscribe |

---

## 🚨 Error Codes

| HTTP Code | Error Key | Description |
|-----------|-----------|-------------|
| 400 | `invalid_request` | Invalid JSON or missing method |
| 400 | `address_required` | `eth_getLogs` without address |
| 400 | `window_too_large` | `eth_getLogs` window > 5000 blocks |
| 401 | `invalid_api_key` | API key missing/invalid (if enabled) |
| 402 | *(challenge)* | Payment required |
| 400 | `invalid_payment` | Payment verification failed |
| 409 | `receipt_already_used` | Payment already consumed (anti-replay) |
| 413 | `batch_too_large` | Batch > 10 requests |
| 403 | `method_not_allowed` | Method explicitly disabled |
| 500 | `internal_error` | Server error |

---

## 🔐 RPC Security

### Rate Limiting
- **25 requests/second** per API key (or IP if no key)
- Exposed via headers: `ratelimit-*`

### Anti-Replay
- Each payment has unique `requestHash`
- LRU cache (1 hour TTL) prevents reuse
- Returns `409 receipt_already_used` on duplicate

### Guardrails
- Request body ≤ 2 MiB
- Batch requests ≤ 10 items
- `eth_getLogs` requires `address` parameter
- `eth_getLogs` block window ≤ 5000

---

# Part 2: About This Repository (Starter Kit)

## 📦 What is This Repo?

This is a **starter template** showing how to build your own x402-powered application. It's the same architecture we use for our production RPC endpoint.

### What You Get

- ✅ Working Next.js 15 application
- ✅ Pre-configured x402 middleware
- ✅ Example protected routes (page + API)
- ✅ Wallet integration
- ✅ Ready to deploy

### What It's NOT

- ❌ Not a full RPC endpoint (that's our production service above)
- ❌ Not a complete app (it's a template/starter)
- ❌ Not production-ready without customization

**Use this repo to**: Learn x402, build your own paid API, create paid content sites

---

## 🚀 Installation

```bash
# Clone
git clone <your-repo-url>
cd x402

# Install dependencies
npm install

# Configure
cp env.example .env.local
# Edit .env.local with your address
```

## ⚙️ Configuration

### 1. Set Your Receiver Address

Edit `middleware.ts`:
```typescript
const RECEIVER_ADDRESS = '0xYourWalletAddress';
```

### 2. Choose Network

**For Testing (Recommended First)**:
```typescript
network: 'base-sepolia',  // Free test funds
```

**For Production**:
```typescript
network: 'base',  // Real USDC
```

### 3. Configure Wallet Connection

Edit `app/page.tsx` to match your network:

**Mainnet**:
```typescript
chainId: '0x2105',  // 8453
chainName: 'Base Mainnet',
```

**Testnet**:
```typescript
chainId: '0x14a34',  // 84532
chainName: 'Base Sepolia',
```

---

## 💎 Protected Routes in This Repo

This starter includes **2 example routes**:

### Route 1: `/paid` (Web Page)
- **Price**: $0.05 USDC
- **Type**: HTML page
- **Use case**: Premium articles, content, tutorials

### Route 2: `/api/paid` (API)
- **Price**: $0.01 USDC
- **Methods**: GET, POST
- **Use case**: Paid API endpoints

**Customize these** or add your own in `middleware.ts`!

---

## 🧪 Testing

### Quick Test (Browser)

1. **Start server**: `npm run dev`
2. **Visit**: `http://localhost:3000/paid`
3. **Connect wallet** when prompted
4. **Sign payment** (0.05 USDC)
5. **See content** after payment

### API Test (Terminal)

```bash
# Should return 402
curl -v http://localhost:3000/api/paid
```

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# RECEIVER_ADDRESS=0xYourAddress
```

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g railway

# Login and deploy
railway login
railway init
railway up
```

### Environment Variables (Production)

Set these in your hosting provider:

```bash
RECEIVER_ADDRESS=0xYourProductionAddress
NETWORK=base  # For mainnet
NEXT_PUBLIC_NETWORK=base
NEXT_PUBLIC_CHAIN_ID=8453
```

---

## 🔧 Customization Guide

### Add Your Own Protected Route

1. **Add to `middleware.ts`**:
```typescript
'/api/my-feature': {
  price: '$0.25',
  network: 'base',
  config: { 
    description: 'My premium feature',
    title: 'Custom API'
  },
},
```

2. **Create handler** `app/api/my-feature/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // Your logic here
  return NextResponse.json({ 
    data: "Premium content" 
  });
}
```

3. **Update matcher** in `middleware.ts`:
```typescript
export const config = {
  matcher: [
    '/api/paid/:path*',
    '/paid/:path*',
    '/api/my-feature/:path*',  // Add your route
  ],
};
```

---

## 📚 Resources

### Official x402 Documentation
- 📖 [x402 Protocol Docs](https://docs.cdp.coinbase.com/x402/welcome)
- 📖 [Quickstart for Sellers](https://docs.cdp.coinbase.com/x402/quickstart-for-sellers)
- 📖 [Quickstart for Buyers](https://docs.cdp.coinbase.com/x402/quickstart-for-buyers)
- 📖 [Network Support](https://docs.cdp.coinbase.com/x402/network-support)

### NPM Packages
- 📦 [x402-next](https://www.npmjs.com/package/x402-next) - Next.js middleware
- 📦 [x402-express](https://www.npmjs.com/package/x402-express) - Express middleware
- 📦 [x402-fetch](https://www.npmjs.com/package/x402-fetch) - Client wrapper

### Base Network
- 🔗 [Base Official Site](https://base.org)
- 🔗 [Base Docs](https://docs.base.org)
- 🔗 [Base Bridge](https://bridge.base.org)
- 🔗 [BaseScan](https://basescan.org)

### Community
- 💬 [Base Discord](https://base.org/discord)
- 💬 [Coinbase Dev Forum](https://forums.coinbase.com)
- 🐦 [Base Twitter](https://twitter.com/base)

---

## 📄 License

MIT License

---

## 🙏 Credits

- [Coinbase](https://www.coinbase.com) - x402 protocol
- [Base](https://base.org) - L2 blockchain
- [Next.js](https://nextjs.org) - React framework

---

**Part 1**: Production RPC → Use our endpoint  
**Part 2**: Starter Kit → Build your own

Questions? Open an issue on GitHub

**Version**: 0.1.0 | **Status**: Production Ready ✅
