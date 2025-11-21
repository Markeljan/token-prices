import { createPublicClient, http } from "viem";
import type { Chain } from "viem/chains";
import * as viemChains from "viem/chains";

export const findChainById = (chainId: number): Chain | undefined => {
  return Object.values(viemChains).find((chain) => chain.id === chainId);
};

// TODO: Add ALCHEMY / RPC MAPPINGS per chain
export const getPublicClient = (chain: Chain) =>
  createPublicClient({
    chain,
    transport: http(),
  });
