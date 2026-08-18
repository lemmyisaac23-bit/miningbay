import { useEffect, useState } from "react";
import { COINGECKO_IDS, COIN_USD, hasCoinQuote } from "../data/rates";

export function useCoinPrice(ticker: string | undefined) {
  const fallback = hasCoinQuote(ticker) ? COIN_USD[ticker] : undefined;
  const [price, setPrice] = useState(fallback);

  useEffect(() => {
    if (!hasCoinQuote(ticker)) {
      setPrice(undefined);
      return;
    }
    setPrice(COIN_USD[ticker]);
    const id = COINGECKO_IDS[ticker];
    const ctrl = new AbortController();
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
      { signal: ctrl.signal },
    )
      .then((r) => r.json())
      .then((data: Record<string, { usd?: number }>) => {
        const next = data?.[id]?.usd;
        if (typeof next === "number" && next > 0) setPrice(next);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [ticker]);

  return price;
}
