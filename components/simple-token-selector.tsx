"use client";

import { useMemo, useState } from "react";
import { useTokenPrice } from "@/hooks/use-funkit";
import { TOKENS_ARRAY, type Token } from "@/lib/constants";

export const SimpleTokenSelector = () => {
  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [targetToken, setTargetToken] = useState<Token | null>(null);
  const [usdValue, setUsdValue] = useState<string>("");

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

      {/* Token Selection List (Horizontally Scrollable) */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max px-4 justify-center">
          {TOKENS_ARRAY.map((token) => {
            // Check matching by name and chainId
            const isSource =
              sourceToken?.name === token.name &&
              sourceToken?.chainId === token.chainId;
            const isTarget =
              targetToken?.name === token.name &&
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
                key={`${token.chainId}-${token.name}`}
                type="button"
                onClick={() => {
                  if (isSource) {
                    setSourceToken(null);
                  } else if (isTarget) {
                    setTargetToken(null);
                  } else {
                    if (!sourceToken) {
                      setSourceToken(token);
                    } else {
                      setTargetToken(token);
                    }
                  }
                }}
                className={buttonClass}
                aria-pressed={isSource || isTarget}
              >
                {token.name}
              </button>
            );
          })}
        </div>
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

      <div className="flex justify-center max-w-xs mx-auto">
        <div className="w-full">
          <label
            htmlFor="usd-amount"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 text-center"
          >
            USD Amount
          </label>
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
