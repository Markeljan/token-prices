export type Token = {
  name: string;
  chainId: string;
};

export const DEFAULT_TOKENS_MAP: Record<string, Token> = {
  USDC: {
    name: "USDC",
    chainId: "1",
  },
  USDT: {
    name: "USDT",
    chainId: "137",
  },
  ETH: {
    name: "ETH",
    chainId: "8453",
  },
  WBTC: {
    name: "WBTC",
    chainId: "1",
  },
};

export const TOKENS_ARRAY: Token[] = Object.values(DEFAULT_TOKENS_MAP);
