export type Algo = "SHA-256" | "Scrypt" | "RandomX";

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  algo: Algo;
  coin: string;
  coinTicker: string;
  hashrate: number;
  unit: string;
  days: number;
  priceUsd: number;
  dailyUsd: number;
  featured?: boolean;
  hardware: string;
  profitMult?: number;
};

export const BTC_USD = 118400;
export const DEPOSIT_CHARGE_RATE = 0.015;

export function money(n: number) {
  return Math.round(n * 100) / 100;
}

export function planDepositCharge(plan: Plan) {
  return money(plan.priceUsd * DEPOSIT_CHARGE_RATE);
}

export function planDockTotal(plan: Plan) {
  return money(plan.priceUsd + planDepositCharge(plan));
}

export function planShortfall(plan: Plan, balanceUsd: number) {
  return money(Math.max(0, planDockTotal(plan) - balanceUsd));
}

export function shaDailyUsd(priceUsd: number, days: number, profitMult: number) {
  return (priceUsd * (1 + profitMult)) / days;
}

export function planProfit(plan: Plan) {
  if (plan.profitMult) return plan.priceUsd * plan.profitMult;
  return plan.dailyUsd * plan.days - plan.priceUsd;
}

export function planProfitBtc(plan: Plan) {
  return planProfit(plan) / BTC_USD;
}

export const PLANS: Plan[] = [
  {
    id: "scrypt-dock",
    name: "Scrypt Dock",
    tagline: "One-day Litecoin + Dogecoin merge path.",
    algo: "Scrypt",
    coin: "Litecoin",
    coinTicker: "LTC",
    hashrate: 500,
    unit: "MH/s",
    days: 1,
    priceUsd: 189,
    profitMult: 1.2,
    dailyUsd: shaDailyUsd(189, 1, 1.2),
    hardware: "L7 / L9 mixed bay",
  },
  {
    id: "spark",
    name: "Spark",
    tagline: "Two-day SHA-256 starter lane.",
    algo: "SHA-256",
    coin: "Bitcoin",
    coinTicker: "BTC",
    hashrate: 25,
    unit: "TH/s",
    days: 2,
    priceUsd: 150,
    profitMult: 2.5,
    dailyUsd: shaDailyUsd(150, 2, 2.5),
    hardware: "Antminer S21 hydro slice",
  },
  {
    id: "harbor",
    name: "Harbor",
    tagline: "The bay's working two-day contract.",
    algo: "SHA-256",
    coin: "Bitcoin",
    coinTicker: "BTC",
    hashrate: 70,
    unit: "TH/s",
    days: 2,
    priceUsd: 400,
    profitMult: 2.5,
    dailyUsd: shaDailyUsd(400, 2, 2.5),
    featured: true,
    hardware: "S21 cluster, shared rack",
  },
  {
    id: "bay",
    name: "Bay",
    tagline: "One-week SHA-256 on cooled rails.",
    algo: "SHA-256",
    coin: "Bitcoin",
    coinTicker: "BTC",
    hashrate: 110,
    unit: "TH/s",
    days: 7,
    priceUsd: 600,
    profitMult: 4,
    dailyUsd: shaDailyUsd(600, 7, 4),
    hardware: "S21 Pro, dedicated tray",
  },
  {
    id: "volt",
    name: "Volt",
    tagline: "High-current one-week SHA lane.",
    algo: "SHA-256",
    coin: "Bitcoin",
    coinTicker: "BTC",
    hashrate: 180,
    unit: "TH/s",
    days: 7,
    priceUsd: 1000,
    profitMult: 4,
    dailyUsd: shaDailyUsd(1000, 7, 4),
    hardware: "Private hydro tray",
  },
  {
    id: "surge",
    name: "Surge",
    tagline: "Hall-scale twelve-day burst.",
    algo: "SHA-256",
    coin: "Bitcoin",
    coinTicker: "BTC",
    hashrate: 420,
    unit: "TH/s",
    days: 12,
    priceUsd: 2500,
    profitMult: 6,
    dailyUsd: shaDailyUsd(2500, 12, 6),
    hardware: "Hydro hall row",
  },
  {
    id: "titan",
    name: "Titan",
    tagline: "Top SHA-256 dock. Twelve days of peak current.",
    algo: "SHA-256",
    coin: "Bitcoin",
    coinTicker: "BTC",
    hashrate: 700,
    unit: "TH/s",
    days: 12,
    priceUsd: 4000,
    profitMult: 6,
    dailyUsd: shaDailyUsd(4000, 12, 6),
    hardware: "Private hydro hall",
  },
];
