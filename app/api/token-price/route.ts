import { type NextRequest, NextResponse } from "next/server";
import { getTokenInfo, getTokenPrice } from "@/lib/funkit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chainId, symbol } = body;

    if (!chainId || !symbol) {
      return NextResponse.json(
        { error: "chainId and symbol are required" },
        { status: 400 },
      );
    }

    const tokenInfo = await getTokenInfo(chainId, symbol);
    const priceInfo = await getTokenPrice(chainId, tokenInfo.address);

    return NextResponse.json({
      tokenInfo,
      priceInfo,
    });
  } catch (error) {
    console.error("Error fetching token price:", error);
    return NextResponse.json(
      { error: "Failed to fetch token price" },
      { status: 500 },
    );
  }
}
