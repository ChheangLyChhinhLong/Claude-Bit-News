import { NextResponse } from "next/server";
import { getDividends } from "@/lib/market/dividends";

export const revalidate = 900;

export async function GET(request: Request) {
  const ticker = new URL(request.url).searchParams.get("ticker") || undefined;
  try {
    const dividends = await getDividends(ticker);
    return NextResponse.json({ results: dividends, count: dividends.length });
  } catch {
    return NextResponse.json({ error: "Unable to retrieve dividend data." }, { status: 502 });
  }
}