import { type NextRequest, NextResponse } from "next/server";
import { erc20Abi } from "viem";
import { getAllowedTokens } from "@/lib/funkit";
import { findChainById, getPublicClient } from "@/lib/viem";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const chainIdParam = searchParams.get("chainId");

    const allowedTokensMap = await getAllowedTokens();
    let chainId: number;
    let chains: string[] | undefined;

    if (!chainIdParam) {
      chains = Object.keys(allowedTokensMap);
      if (chains.length === 0) {
        return NextResponse.json({ chains: [], tokens: [] });
      }
      // Default to the first chain
      chainId = parseInt(chains[0], 10);
    } else {
      chainId = parseInt(chainIdParam, 10);
    }

    const addresses = allowedTokensMap[chainId] as `0x${string}`[];

    if (!addresses || addresses.length === 0) {
      return NextResponse.json({
        chains,
        tokens: [],
        chainId: chains ? chainId.toString() : undefined,
      });
    }

    const chain = findChainById(chainId);

    if (!chain) {
      console.warn(`Chain ${chainId} not found in viem/chains`);
      return NextResponse.json({
        chains,
        tokens: [],
        chainId: chains ? chainId.toString() : undefined,
      });
    }

    // not very efficient, but placeholder for what would be a cached token details source
    const results = await getPublicClient(chain).multicall({
      contracts: addresses.flatMap((address) => [
        {
          address,
          abi: erc20Abi,
          functionName: "name",
        },
        {
          address,
          abi: erc20Abi,
          functionName: "symbol",
        },
        {
          address,
          abi: erc20Abi,
          functionName: "decimals",
        },
      ]),
      allowFailure: true,
    });

    const tokens = [];
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      const nameResult = results[i * 3];
      const symbolResult = results[i * 3 + 1];
      const decimalsResult = results[i * 3 + 2];

      if (
        nameResult.status === "success" &&
        symbolResult.status === "success"
      ) {
        tokens.push({
          address,
          name: nameResult.result,
          symbol: symbolResult.result,
          decimals:
            decimalsResult.status === "success" ? decimalsResult.result : 18,
          chainId: chainId.toString(),
        });
      }
    }

    return NextResponse.json({
      chains,
      tokens,
      chainId: chains ? chainId.toString() : undefined,
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 },
    );
  }
}
