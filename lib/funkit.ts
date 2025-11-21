import {
  type Erc20AssetInfo,
  type GetAssetPriceInfoResponse,
  getAllowedAssets,
  getAssetErc20ByChainAndSymbol,
  getAssetPriceInfo,
} from "@funkit/api-base";

const FUNKIT_API_KEY = process.env.FUNKIT_API_KEY;

if (!FUNKIT_API_KEY) {
  throw new Error("FUNKIT_API_KEY is not set");
}

export async function getTokenInfo(
  chainId: string,
  symbol: string,
): Promise<Erc20AssetInfo> {
  if (!FUNKIT_API_KEY) {
    throw new Error("FUNKIT_API_KEY is not set");
  }
  return getAssetErc20ByChainAndSymbol({
    chainId,
    symbol,
    apiKey: FUNKIT_API_KEY,
  });
}

export async function getTokenPrice(
  chainId: string,
  assetTokenAddress: string,
): Promise<GetAssetPriceInfoResponse> {
  if (!FUNKIT_API_KEY) {
    throw new Error("FUNKIT_API_KEY is not set");
  }
  return getAssetPriceInfo({
    chainId,
    assetTokenAddress,
    apiKey: FUNKIT_API_KEY,
  });
}

export async function getAllowedTokens(): Promise<
  Record<string, string[] | undefined>
> {
  if (!FUNKIT_API_KEY) {
    throw new Error("FUNKIT_API_KEY is not set");
  }
  return getAllowedAssets({
    apiKey: FUNKIT_API_KEY,
  });
}
