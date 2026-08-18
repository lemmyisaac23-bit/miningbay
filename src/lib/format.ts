export function usd(n: number, digits = 2) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function btc(n: number) {
  return `${n.toFixed(8)} BTC`;
}

export function coin(n: number, ticker: string) {
  const digits = ticker === "SOL" ? 4 : ticker === "ETH" ? 6 : 8;
  return `${n.toFixed(digits)} ${ticker}`;
}

export function daysLeft(endsAt: number) {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 86_400_000));
}
