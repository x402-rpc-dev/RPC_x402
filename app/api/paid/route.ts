// app/api/paid/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // If we reach here, the x402 payment has been validated by the middleware
  console.log('✅ x402 payment validated for /api/paid');
  
  // Simulate "premium" or sensitive data
  const secretData = {
    message: '🎉 Congratulations! You have access to premium data',
    secret: 'The answer to everything is 42',
    timestamp: new Date().toISOString(),
    network: 'Base Sepolia',
    protocol: 'x402',
    price_paid: '$0.01 USDC',
    premium_data: {
      crypto_tip: 'HODL responsibly 🚀',
      market_insight: 'Crypto micropayments will revolutionize the web',
      tech_fact: 'x402 uses EIP-3009 for transfer signatures'
    }
  };

  return NextResponse.json(secretData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Powered-By': 'x402-base-sepolia-poc',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('✅ POST payment validated for /api/paid', body);
    
    return NextResponse.json({
      message: '📝 Data received and processed successfully',
      received: body,
      timestamp: new Date().toISOString(),
      status: 'processed_with_payment'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}
