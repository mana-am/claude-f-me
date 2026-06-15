import { logErr } from "./util.js";

/**
 * Market mode data layer — "feel the market". Given a company/ticker, fetch a
 * live quote and turn it into a vibration melody: the bigger the intraday move,
 * the stronger the buzz; green (up) plays a rising arpeggio, red (down) a falling
 * one. Runs on the user's machine with global fetch — no API key:
 *   1) Yahoo Finance chart endpoint (price + previous close)
 *   2) Stooq CSV as a fallback
 *
 * Not financial advice. Possibly the only sex toy that reacts to your portfolio.
 */
export interface Quote {
  symbol: string;
  price: number;
  prevClose: number;
  changePct: number; // intraday % change
  currency: string;
}

/** A few friendly names → tickers so "apple"/"特斯拉"/"bitcoin" just work. */
const ALIASES: Record<string, string> = {
  apple: "AAPL", 苹果: "AAPL",
  tesla: "TSLA", 特斯拉: "TSLA",
  nvidia: "NVDA", 英伟达: "NVDA", 英偉達: "NVDA",
  microsoft: "MSFT", 微软: "MSFT",
  google: "GOOGL", alphabet: "GOOGL", 谷歌: "GOOGL",
  amazon: "AMZN", 亚马逊: "AMZN",
  meta: "META", facebook: "META",
  netflix: "NFLX",
  bitcoin: "BTC-USD", btc: "BTC-USD", 比特币: "BTC-USD",
  ethereum: "ETH-USD", eth: "ETH-USD", 以太坊: "ETH-USD",
  dogecoin: "DOGE-USD", doge: "DOGE-USD", 狗狗币: "DOGE-USD",
};

export function resolveSymbol(input: string): string {
  const s = input.trim();
  const key = s.toLowerCase();
  if (ALIASES[s]) return ALIASES[s];
  if (ALIASES[key]) return ALIASES[key];
  return s.toUpperCase();
}

export async function fetchQuote(input: string): Promise<Quote> {
  const symbol = resolveSymbol(input);
  try {
    return await fetchYahoo(symbol);
  } catch (e) {
    logErr(`market: yahoo failed for ${symbol} (${e}); trying stooq`);
    return await fetchStooq(symbol);
  }
}

async function fetchYahoo(symbol: string): Promise<Quote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 claude-f-me" } });
  if (!res.ok) throw new Error(`yahoo ${res.status}`);
  const data: any = await res.json();
  const r = data?.chart?.result?.[0];
  const meta = r?.meta;
  if (!meta) throw new Error("no quote");
  const price = Number(meta.regularMarketPrice);
  const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
  if (!Number.isFinite(price)) throw new Error("no price");
  return {
    symbol,
    price,
    prevClose,
    changePct: prevClose ? ((price - prevClose) / prevClose) * 100 : 0,
    currency: String(meta.currency ?? "USD"),
  };
}

async function fetchStooq(symbol: string): Promise<Quote> {
  // Stooq uses lowercase + ".us" for US equities; pass through for others.
  const sym = /^[A-Za-z.]+$/.test(symbol) && !symbol.includes(".") ? `${symbol.toLowerCase()}.us` : symbol.toLowerCase();
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(sym)}&f=sd2t2ohlc&h&e=csv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`stooq ${res.status}`);
  const text = await res.text();
  const rows = text.trim().split("\n");
  if (rows.length < 2) throw new Error("no data");
  const cols = rows[1].split(",");
  // Symbol,Date,Time,Open,High,Low,Close
  const open = Number(cols[3]);
  const close = Number(cols[6]);
  if (!Number.isFinite(close)) throw new Error("no close");
  return {
    symbol: symbol.toUpperCase(),
    price: close,
    prevClose: open,
    changePct: open ? ((close - open) / open) * 100 : 0,
    currency: "USD",
  };
}

/**
 * Turn a quote into a short melody (intensity steps). Magnitude scales with the
 * absolute % move; direction picks a rising (up) or falling (down) arpeggio.
 */
export function marketMelody(q: Quote, ceiling = 1): Array<{ intensity: number; ms: number }> {
  const m = Math.min(1, Math.abs(q.changePct) / 5); // 5% move ≈ full intensity
  const peak = Math.min(ceiling, 0.3 + 0.65 * m);
  const lo = Math.min(ceiling, 0.12 + 0.15 * m);
  const mid = (lo + peak) / 2;
  const up = q.changePct >= 0;
  const notes = up ? [lo, mid, peak, mid] : [peak, mid, lo, lo * 0.6];
  const dur = up ? 150 : 200; // gains feel snappier, losses draggier
  const steps = notes.map((intensity) => ({ intensity, ms: dur }));
  steps.push({ intensity: lo * 0.5, ms: 120 }); // settle to a low hum
  return steps;
}
