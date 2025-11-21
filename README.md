# Token Price Explorer

A React application for exploring crypto token prices and calculating equivalent token amounts based on USD values.

## 🚀 Live Demo

[View Live Application](https://your-deployment-url.vercel.app) <!-- Update with deployment URL -->

## ✨ Features

- **Simple Mode**: Quick selection from popular tokens (USDC, USDT, ETH, WBTC)
- **Advanced Mode**: Browse all available tokens across multiple blockchain networks
- **Real-time Pricing**: Live token prices via Funkit API
- **Multi-chain Support**: Ethereum, Polygon, and Base networks
- **Responsive Design**: Mobile-friendly with dark mode
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
- **Server-side API routes** keep the API key secure
- **Custom React hooks** for reusable data fetching logic
- **Viem multicall** for efficient batch token metadata requests

### UX
- **Progressive disclosure**: Simple mode by default, advanced mode when needed
- **Visual feedback**: Color-coded selection (blue = source, green = target)
- **Responsive layout**: Horizontal scrolling on mobile, grid on desktop

### Libraries
- **Next.js**: Server-side API routes, excellent DX, production optimizations
- **Tailwind CSS v4**: Rapid UI development
- **Viem**: Type-safe, lighter than ethers.js
- **Biome**: Faster than ESLint/Prettier

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

## 📄 License

Created as part of a coding assessment.
