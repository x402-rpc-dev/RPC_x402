export const metadata = {
  title: 'x402 Base - Crypto Micropayments',
  description: 'x402 protocol implementation on Base - Monetize APIs with USDC micropayments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
