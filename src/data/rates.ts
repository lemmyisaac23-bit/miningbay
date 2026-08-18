export const COIN_USD: Record<string, number> = {
  BTC: 63500,
  ETH: 1900,
  LTC: 85,
  SOL: 76,
};

export const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LTC: "litecoin",
  SOL: "solana",
};

export function hasCoinQuote(ticker: string | undefined): ticker is string {
  return Boolean(ticker && ticker in COIN_USD);
}

export function usdToCoin(usdAmount: number, priceUsd: number) {
  if (!priceUsd) return 0;
  return usdAmount / priceUsd;
}
