import { FormEvent, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAppState } from "../context/AppState";
import { money } from "../data/plans";
import { usd, coin } from "../lib/format";
import { CryptoPayPanel } from "../components/CryptoPayPanel";
import { payTarget } from "../data/payments";
import { hasCoinQuote, usdToCoin } from "../data/rates";
import { useCoinPrice } from "../hooks/useCoinPrice";

const GATEWAYS = [
  { id: "btc", label: "BTC" },
  { id: "usdt", label: "USDT" },
  { id: "solana", label: "Solana" },
  { id: "eth", label: "ETH" },
  { id: "ltc", label: "LTC" },
] as const;

const USDT_NETWORKS = [
  { id: "erc20", label: "ERC-20" },
  { id: "trc20", label: "TRC-20" },
] as const;

const DEPOSIT_MIN = 150;
const DEPOSIT_MAX = 500_000;
const GATEWAY_CHARGE_RATE = 0.009;

type DepositNav = { need?: number; planId?: string };
type Step = "form" | "pay" | "pending";

export function DepositPage() {
  const { deposit } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const nav = (location.state as DepositNav | null) ?? {};
  const preset =
    nav.need && nav.need > 0 ? money(Math.max(DEPOSIT_MIN, nav.need)) : DEPOSIT_MIN;

  const [gateway, setGateway] = useState<(typeof GATEWAYS)[number]["id"]>("btc");
  const [usdtNetwork, setUsdtNetwork] =
    useState<(typeof USDT_NETWORKS)[number]["id"]>("trc20");
  const [raw, setRaw] = useState(String(preset));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");

  const amount = Number(raw);
  const valid = Number.isFinite(amount) && amount >= DEPOSIT_MIN && amount <= DEPOSIT_MAX;
  const charge = valid ? money(amount * GATEWAY_CHARGE_RATE) : 0;
  const payable = valid ? money(amount + charge) : 0;

  const selected = useMemo(() => {
    const gate = GATEWAYS.find((g) => g.id === gateway) ?? GATEWAYS[0];
    if (gate.id !== "usdt") return gate.label;
    const net = USDT_NETWORKS.find((n) => n.id === usdtNetwork) ?? USDT_NETWORKS[0];
    return `USDT ${net.label}`;
  }, [gateway, usdtNetwork]);

  const coinTicker =
    gateway === "btc"
      ? "BTC"
      : gateway === "eth"
        ? "ETH"
        : gateway === "ltc"
          ? "LTC"
          : gateway === "solana"
            ? "SOL"
            : undefined;
  const coinPrice = useCoinPrice(coinTicker);
  const payableCoin =
    coinPrice && valid && hasCoinQuote(coinTicker)
      ? usdToCoin(payable, coinPrice)
      : null;

  const chain = payTarget(
    gateway,
    gateway === "usdt" ? usdtNetwork : undefined,
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError(`Enter an amount between ${usd(DEPOSIT_MIN)} and ${usd(DEPOSIT_MAX)}.`);
      return;
    }
    setError(null);
    if (chain) {
      setStep("pay");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      deposit(money(amount));
      setBusy(false);
      navigate("/app/wallet");
    }, 700);
  }

  if (step === "pending") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-volt">
          Deposit
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">Deposit pending</h1>
        <p className="mt-3 text-mist">
          Your {chain?.ticker ?? "crypto"} payment is waiting on confirmation.
          Hall ops will credit the USD wallet once the transfer clears.
        </p>
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="mt-8 w-full rounded-xl bg-[#16a34a] py-3.5 text-sm font-bold text-white"
        >
          Return to main menu
        </button>
      </div>
    );
  }

  if (step === "pay") {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-3xl font-extrabold">
          Pay with {chain?.coin ?? "crypto"}
        </h1>
        <p className="mt-2 text-mist">Scan the QR or copy the address, then confirm.</p>
        <div className="mt-8">
          {chain && (
            <CryptoPayPanel
              coin={chain.coin}
              ticker={chain.ticker}
              address={chain.address}
              payableUsd={payable}
              onPaid={() => setStep("pending")}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">
            Deposit on Your USD Wallet
          </h1>
          <p className="mt-2 text-mist">
            Select a crypto gateway and enter the amount you want to add
          </p>
        </div>
        <p className="inline-flex shrink-0 items-center gap-2 text-sm text-copper">
          <Shield size={16} />
          SSL encrypted payment instructions
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <label className="block text-sm">
          Select Gateway <span className="text-copper">*</span>
          <select
            required
            value={gateway}
            onChange={(e) =>
              setGateway(e.target.value as (typeof GATEWAYS)[number]["id"])
            }
            className="mt-2 w-full rounded-xl border border-line bg-panel px-3 py-3"
          >
            {GATEWAYS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </label>

        {gateway === "usdt" && (
          <div>
            <p className="text-sm">
              USDT network <span className="text-copper">*</span>
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {USDT_NETWORKS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setUsdtNetwork(n.id)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    usdtNetwork === n.id
                      ? "bg-copper text-ink"
                      : "border border-line bg-panel text-mist hover:text-foam"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="block text-sm">
          Amount
          <span className="mt-2 flex overflow-hidden rounded-xl border border-line bg-panel">
            <input
              required
              type="number"
              min={DEPOSIT_MIN}
              max={DEPOSIT_MAX}
              step="0.01"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 outline-none"
            />
            <span className="grid place-items-center bg-copper px-4 text-sm font-semibold text-ink">
              USD
            </span>
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-raised/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-mist">Limit</p>
            <p className="mt-2 font-display text-lg">
              {usd(DEPOSIT_MIN)} - {usd(DEPOSIT_MAX)}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-raised/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-mist">Charge</p>
            <p className="mt-2 font-display text-lg">{usd(charge)}</p>
          </div>
          <div className="rounded-xl border border-line bg-raised/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-mist">Payable</p>
            <p className="mt-2 font-display text-lg text-copper">{usd(payable)}</p>
            {payableCoin != null && coinTicker && (
              <p className="mt-1 font-mono text-sm text-ink">
                {coin(payableCoin, coinTicker)}
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-copper/40 bg-copper/10 px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-copper py-3.5 text-sm font-semibold text-ink disabled:opacity-60"
        >
          {busy ? `Clearing ${selected}…` : "Submit"}
        </button>
      </form>
    </div>
  );
}
