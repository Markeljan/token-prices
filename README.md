# Token Price Explorer

A React application for exploring crypto token prices and calculating equivalent token amounts based on USD values.

## 🚀 Live Demo

[View Live Application](https://token-prices.vercel.app)

## ✨ Features

- **Simple Mode**: Quick selection from popular tokens (USDC, USDT, ETH, WBTC)
- **Advanced Mode**: Browse all available tokens across multiple blockchain networks
Ï
## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API**: @funkit/api-base
- **Blockchain**: Viem
- **Linting**: Biome

## 📦 Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd token-prices
   bun install
   # or use npm, yarn, pnpm
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Funkit API key to `.env.local`:
   ```
   FUNKIT_API_KEY="your-api-key-here"
   ```

3. **Run development server**
   ```bash
   bun run dev
   # or use npm, yarn, pnpm
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
token-prices/
├── app/
│   ├── api/              # API routes (token-price, tokens)
│   └── page.tsx          # Home page
├── components/           # React components
├── hooks/                # Custom hooks (useTokenPrice)
└── lib/                  # Utilities (funkit, viem, constants)
```

## 🔌 API Integration

Uses Funkit API for token data:

```typescript
// Get token info
const tokenInfo = await getAssetErc20ByChainAndSymbol({
  chainId: '1',
  symbol: 'USDC',
  apiKey: process.env.FUNKIT_API_KEY
});

// Get token price
const priceInfo = await getAssetPriceInfo({
  chainId: '1',
  assetTokenAddress: '0x...',
  apiKey: process.env.FUNKIT_API_KEY
});
```

## 🎨 Design Decisions

### Architecture

- **Server-side API routes** keep the Funkit API key secure, caching configurable from each fetch() request
- **Custom React hooks** for reusable token fetching logic
- **Viem multicall** batch token metadata requests

## 📝 Assumptions

- Users primarily use simple mode for common tokens
- Token prices fetched on-demand (no pre-caching)
- Focus on price exploration, not actual swapping
- Dark mode as default

## 🚢 Deployment

Deploy to Vercel:

```bash
vercel --prod
```

**Important**: Add `FUNKIT_API_KEY` environment variable in Vercel project settings.

## Limitations

- using public RPC's for blockchain data (some chains may not work without a private RPC, or may not support multicall)
- loading UI not optimised or implemented, just added placeholder loading text
- error handling minimal and not descriptive or user-friendly