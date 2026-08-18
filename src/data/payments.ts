export const BTC_PAY_ADDRESS =
  "bc1pltxr90n0syjngtrj3vhxu3avwpmt84vwm92end2ufm084y57s7cspfnchp";

export const ETH_PAY_ADDRESS =
  "0xEd33E2E6b87bAc284F1D603c7078BEA3d1C4e57B";

export const TRC20_PAY_ADDRESS =
  "TXbRJeZZwYceFYFxmpN5B9eUwKuJ22NQxY";

export const SOLANA_ERC20_PAY_ADDRESS =
  "3C9WfgEKPnBtCpAXSasjxRMMdigB3EDkfJDp6Lvfggxy";

export const LTC_PAY_ADDRESS =
  "ltc1qq26pw7ugtpr9efypdh9pelu0xx6cza787pe6wz";

export type PayTarget = {
  coin: string;
  ticker: string;
  address: string;
};

export function payTarget(
  gateway: string,
  usdtNetwork?: string,
): PayTarget | null {
  if (gateway === "btc") {
    return { coin: "Bitcoin", ticker: "BTC", address: BTC_PAY_ADDRESS };
  }
  if (gateway === "eth") {
    return { coin: "Ethereum", ticker: "ETH", address: ETH_PAY_ADDRESS };
  }
  if (gateway === "solana") {
    return { coin: "Solana", ticker: "SOL", address: SOLANA_ERC20_PAY_ADDRESS };
  }
  if (gateway === "ltc") {
    return { coin: "Litecoin", ticker: "LTC", address: LTC_PAY_ADDRESS };
  }
  if (gateway === "usdt" && usdtNetwork === "trc20") {
    return { coin: "USDT TRC-20", ticker: "USDT", address: TRC20_PAY_ADDRESS };
  }
  if (gateway === "usdt" && usdtNetwork === "erc20") {
    return {
      coin: "USDT ERC-20",
      ticker: "USDT",
      address: SOLANA_ERC20_PAY_ADDRESS,
    };
  }
  return null;
}

