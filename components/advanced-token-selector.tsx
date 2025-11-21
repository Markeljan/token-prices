"use client";

import { useEffect, useMemo, useState } from "react";
import { useTokenPrice } from "@/hooks/use-funkit";

type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: string;
};

export const AdvancedTokenSelector = () => {
  const [chains, setChains] = useState<string[]>([]);
  const [selectedChainId, setSelectedChainId] = useState<string>("");
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loadingChains, setLoadingChains] = useState(true);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const [sourceToken, setSourceToken] = useState<TokenInfo | null>(null);
  const [targetToken, setTargetToken] = useState<TokenInfo | null>(null);
  const [usdValue, setUsdValue] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/tokens", {
          next: {
            revalidate: 60 * 60 * 24,
          },
        });
        const data = await res.json();

        if (data.chains) {
          setChains(data.chains);
        }

        if (data.chainId) {
          setSelectedChainId(data.chainId);
        }

        if (data.tokens) {
          setTokens(data.tokens);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setLoadingChains(false);
        // If we got tokens, we aren't loading them anymore
        setLoadingTokens(false);
      }
    };

    fetchInitialData();
  }, []);
  const lastFetchedChainId = useMemo(() => {
    if (tokens.length > 0) return tokens[0].chainId;
    return null;
  }, [tokens]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!selectedChainId) return;

      // If we already have tokens for this chain, don't re-fetch
      // This handles the case where the first effect sets both chain and tokens
      if (lastFetchedChainId === selectedChainId) return;

      setLoadingTokens(true);
      try {
        const res = await fetch(`/api/tokens?chainId=${selectedChainId}`);
        const data = await res.json();
        if (data.tokens) {
          setTokens(data.tokens);
          // Reset selection if needed, or keep if valid
        }
      } catch (err) {
        console.error("Failed to fetch tokens", err);
      } finally {
        setLoadingTokens(false);
      }
    };

    fetchTokens();
  }, [selectedChainId, lastFetchedChainId]);

  const sourcePrice = useTokenPrice(
    sourceToken?.chainId || null,
    sourceToken?.name || null,
  );
  const targetPrice = useTokenPrice(
    targetToken?.chainId || null,
    targetToken?.name || null,
  );

  const sourceAmount = useMemo(() => {
    if (!sourcePrice.data?.priceInfo?.unitPrice || !usdValue) {
      return null;
    }
    const usd = parseFloat(usdValue);
    if (Number.isNaN(usd) || usd <= 0) return null;
    return usd / sourcePrice.data.priceInfo.unitPrice;
  }, [sourcePrice.data, usdValue]);

  const targetAmount = useMemo(() => {
    if (!targetPrice.data?.priceInfo?.unitPrice || !usdValue) {
      return null;
    }
    const usd = parseFloat(usdValue);
    if (Number.isNaN(usd) || usd <= 0) return null;
    return usd / targetPrice.data.priceInfo.unitPrice;
  }, [targetPrice.data, usdValue]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center text-black dark:text-zinc-50">
        Token Price Explorer
      </h2>

      {/* Chain Selection */}
      <div className="flex justify-center">
        {loadingChains ? (
          <p>Loading chains...</p>
        ) : (
          <select
            value={selectedChainId}
            onChange={(e) => setSelectedChainId(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
          >
            {chains.map((chain) => (
              <option key={chain} value={chain}>
                Chain ID: {chain}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Token Selection List (Horizontally Scrollable) */}
      <div className="w-full overflow-x-auto pb-4">
        {loadingTokens ? (
          <p className="text-center">Loading tokens...</p>
        ) : (
          <div className="flex gap-3 min-w-max px-4">
            {tokens.map((token) => {
              const tokenObj = {
                name: token.symbol,
                chainId: token.chainId,
                address: token.address,
                symbol: token.symbol,
                decimals: token.decimals,
              };

              // Check matching by address and chainId to be precise
              const isSource =
                sourceToken?.address === token.address &&
                sourceToken?.chainId === token.chainId;
              const isTarget =
                targetToken?.address === token.address &&
                targetToken?.chainId === token.chainId;

              let buttonClass =
                "px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ";

              if (isSource) {
                buttonClass += "bg-blue-500 text-white shadow-md";
              } else if (isTarget) {
                buttonClass += "bg-green-500 text-white shadow-md";
              } else {
                buttonClass +=
                  "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700";
              }

              return (
                <button
                  key={`${token.chainId}-${token.address}`}
                  type="button"
                  onClick={() => {
                    if (isSource) {
                      setSourceToken(null);
                    } else if (isTarget) {
                      setTargetToken(null);
                    } else {
                      if (!sourceToken) {
                        setSourceToken(tokenObj);
                      } else {
                        setTargetToken(tokenObj);
                      }
                    }
                  }}
                  className={buttonClass}
                  aria-pressed={isSource || isTarget}
                >
                  {token.symbol}
                </button>
              );
            })}
            {tokens.length === 0 && !loadingTokens && (
              <p className="text-zinc-500">No tokens found for this chain.</p>
            )}
          </div>
        )}
      </div>

      {/* Two Column Layout with Arrow */}
      <div className="flex flex-col md:flex-row items-stretch gap-6">
        {/* Source Token Box */}
        <div
          className={`flex-1 rounded-lg border-2 bg-white dark:bg-zinc-900 p-6 min-h-[300px] flex flex-col transition-colors ${
            sourceToken
              ? "border-blue-500"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          <div className="flex-1 flex flex-col justify-center items-center space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Source Token
              </h3>
              <p className="text-2xl font-bold text-black dark:text-zinc-50">
                {sourceToken ? sourceToken.name : "Select a token"}
              </p>
            </div>

            {sourcePrice.loading && (
              <p className="text-sm text-zinc-500">Loading price...</p>
            )}
            {sourcePrice.error && (
              <p className="text-sm text-red-500">{sourcePrice.error}</p>
            )}
            {sourcePrice.data && sourceToken && (
              <div className="text-center space-y-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Price: ${sourcePrice.data.priceInfo.unitPrice.toFixed(4)}
                </p>
                {sourceAmount !== null && (
                  <p className="text-xl font-semibold text-black dark:text-zinc-50">
                    ≈ {sourceAmount.toFixed(6)} {sourceToken.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center md:flex-col">
          <svg
            className="w-8 h-8 md:w-12 md:h-12 text-zinc-400 dark:text-zinc-600 rotate-90 md:rotate-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Target Token Box */}
        <div
          className={`flex-1 rounded-lg border-2 bg-white dark:bg-zinc-900 p-6 min-h-[300px] flex flex-col transition-colors ${
            targetToken
              ? "border-green-500"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          <div className="flex-1 flex flex-col justify-center items-center space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Target Token
              </h3>
              <p className="text-2xl font-bold text-black dark:text-zinc-50">
                {targetToken ? targetToken.name : "Select a token"}
              </p>
            </div>

            {targetPrice.loading && (
              <p className="text-sm text-zinc-500">Loading price...</p>
            )}
            {targetPrice.error && (
              <p className="text-sm text-red-500">{targetPrice.error}</p>
            )}
            {targetPrice.data && targetToken && (
              <div className="text-center space-y-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Price: ${targetPrice.data.priceInfo.unitPrice.toFixed(4)}
                </p>
                {targetAmount !== null && (
                  <p className="text-xl font-semibold text-black dark:text-zinc-50">
                    ≈ {targetAmount.toFixed(6)} {targetToken.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* USD Amount Input */}
      <div className="flex justify-center max-w-xs mx-auto">
        <div className="w-full">
          <input
            id="usd-amount"
            type="number"
            step="0.01"
            min="0"
            value={usdValue}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string or positive numbers
              if (value === "" || parseFloat(value) >= 0) {
                setUsdValue(value);
              }
            }}
            onKeyDown={(e) => {
              // Prevent minus sign and 'e' (scientific notation)
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            placeholder="USD amount"
          />
        </div>
      </div>
    </div>
  );
};
