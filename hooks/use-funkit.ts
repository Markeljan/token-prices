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

    setLoading(true);
    setError(null);

    fetch("/api/token-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chainId, symbol }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch token price");
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch token price");
        setLoading(false);
      });
  }, [chainId, symbol]);

  return { data, loading, error };
};
