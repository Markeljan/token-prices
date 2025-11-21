"use client";

import { useState } from "react";
import { AdvancedTokenSelector } from "@/components/advanced-token-selector";
import { SimpleTokenSelector } from "@/components/simple-token-selector";

export const TokenPriceExplorer = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex items-center justify-end w-full max-w-4xl px-6">
        <label className="flex items-center cursor-pointer space-x-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Advanced Mode
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isAdvanced}
              onChange={() => setIsAdvanced(!isAdvanced)}
            />
            <div
              className={`block w-10 h-6 rounded-full transition-colors ${
                isAdvanced ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                isAdvanced ? "transform translate-x-4" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>

      {isAdvanced ? <AdvancedTokenSelector /> : <SimpleTokenSelector />}
    </div>
  );
};
