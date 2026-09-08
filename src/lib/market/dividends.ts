import { env } from "@/lib/env";

export interface Dividend {
  ticker: string;
  cashAmount: number | null;
  declarationDate: string | null;
  exDividendDate: string | null;
  recordDate: string | null;
  payDate: string | null;
  frequency: number | null;
  dividendType: string | null;
}

type MassiveDividend = {
  ticker?: string;
  cash_amount?: number;
  declaration_date?: string;
  ex_dividend_date?: string;
  record_date?: string;
  pay_date?: string;
  frequency?: number;
  dividend_type?: string;
};

export async function getDividends(ticker?: string): Promise<Dividend[]> {
  if (!env.MASSIVE_API_KEY) return [];
  const params = new URLSearchParams({ apiKey: env.MASSIVE_API_KEY, limit: "50", order: "desc", sort: "ex_dividend_date" });
  if (ticker) params.set("ticker", ticker.toUpperCase());
  const response = await fetch(`https://api.massive.com/v3/reference/dividends?${params.toString()}`, { next: { revalidate: 900 } });
  if (!response.ok) throw new Error(`Massive dividends returned ${response.status}`);
  const data = (await response.json()) as { results?: MassiveDividend[] };
  return (data.results || []).filter((item): item is MassiveDividend & { ticker: string } => Boolean(item.ticker)).map((item) => ({ ticker: item.ticker, cashAmount: item.cash_amount ?? null, declarationDate: item.declaration_date ?? null, exDividendDate: item.ex_dividend_date ?? null, recordDate: item.record_date ?? null, payDate: item.pay_date ?? null, frequency: item.frequency ?? null, dividendType: item.dividend_type ?? null }));
}