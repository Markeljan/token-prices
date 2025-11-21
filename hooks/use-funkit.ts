import type {
  Erc20AssetInfo,
  GetAssetPriceInfoResponse,
} from "@funkit/api-base";
import { useEffect, useState } from "react";

type TokenPriceData = {
  tokenInfo: Erc20AssetInfo;
  priceInfo: GetAssetPriceInfoResponse;
};

type UseTokenPriceResult = {
  data: TokenPriceData | null;
  loading: boolean;
  error: string | null;
};

export const useTokenPrice = (
  chainId: string | null,
  symbol: string | null,
): UseTokenPriceResult => {
  const [data, setData] = useState<TokenPriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chainId || !symbol) {
      setData(null);
      setError(null);
      return;
    }

    const fetchTokenPrice = async () => {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/token-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chainId, symbol }),
      });

      if (!res.ok) {
        setError("Failed to fetch token price");
        setLoading(false);
        return;
      }

      const result = await res.json();
      setData(result);
      setLoading(false);
    };

    fetchTokenPrice();
  }, [chainId, symbol]);

  return { data, loading, error };
};
