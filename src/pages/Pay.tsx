import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bitcoin, Coins, CreditCard, Hexagon, Sun, Wallet } from "lucide-react";
import { useAppState } from "../context/AppState";
import { PLANS, planDockTotal, planProfit, planProfitBtc, planShortfall } from "../data/plans";
import { btc, coin, usd } from "../lib/format";
import { Logo } from "../components/Logo";
import { CryptoPayPanel } from "../components/CryptoPayPanel";
import { payTarget } from "../data/payments";
import { hasCoinQuote, usdToCoin } from "../data/rates";
import { useCoinPrice } from "../hooks/useCoinPrice";

const METHODS = [
  { id: "btc", label: "Bitcoin", icon: Bitcoin },
  { id: "eth", label: "Ethereum", icon: Hexagon },
  { id: "solana", label: "Solana", icon: Sun },
  { id: "ltc", label: "Litecoin", icon: Coins },
  { id: "usdt", label: "USDT", icon: Wallet },
  { id: "card", label: "Card", icon: CreditCard },
] as const;

const USDT_NETWORKS = [
  { id: "erc20", label: "ERC-20" },
  { id: "trc20", label: "TRC-20" },
] as const;

export function PayPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { balanceUsd, payForPlan } = useAppState();
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("btc");
  const [usdtNetwork, setUsdtNetwork] =
    useState<(typeof USDT_NETWORKS)[number]["id"]>("trc20");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "pay" | "pending">("form");

  const plan = useMemo(
    () => PLANS.find((p) => p.id === params.get("plan")) ?? null,
    [params],
  );

  const chain = payTarget(
    method,
    method === "usdt" ? usdtNetwork : undefined,
  );
  const coinTicker = hasCoinQuote(chain?.ticker) ? chain.ticker : undefined;
  const coinPrice = useCoinPrice(coinTicker);

  if (!plan) {
    return (
      <div>
        <p className="font-display text-xs uppercase tracking-[0.22em] text-volt">
          Payment gateway
        </p>
        <h1 className="mt-2 font-display text-4xl">No lane selected.</h1>
        <p className="mt-3 max-w-md text-mist">
          Pick a contract first, then the hall will route the remaining balance
          through the gateway.
        </p>
        <button
          type="button"
          onClick={() => navigate("/app/plans")}
          className="mt-6 rounded-full bg-volt px-5 py-2.5 text-sm font-semibold text-foam"
        >
          Back to plans
        </button>
      </div>
    );
  }

  const selected = plan;
  const total = planDockTotal(selected);
  const due = planShortfall(selected, balanceUsd);
  const profitUsd = planProfit(selected);
  const profitBtc = planProfitBtc(selected);

  const dueCoin =
    coinPrice && coinTicker ? usdToCoin(due, coinPrice) : null;

  function pay() {
    if (chain) {
      setStep("pay");
      return;
    }
    setBusy(true);
    setErr(null);
    window.setTimeout(() => {
      const res = payForPlan(selected);
      setBusy(false);
      if (!res.ok) {
        setErr(res.error || "Could not dock this lane.");
        return;
      }
      navigate("/app/contracts");
    }, 700);
  }

  if (step === "pending") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-volt">
          Payment
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">Deposit pending</h1>
        <p className="mt-3 text-mist">
          Your {chain?.ticker ?? "crypto"} payment is waiting on confirmation.
          The lane docks after hall ops credit the wallet.
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
        <p className="mt-2 text-mist">
          {selected.name} · send{" "}
          {dueCoin != null && coinTicker
            ? `${coin(dueCoin, coinTicker)} (${usd(due)})`
            : `${usd(due)} in ${chain?.ticker ?? "crypto"}`}
        </p>
        <div className="mt-8">
          {chain && (
            <CryptoPayPanel
              coin={chain.coin}
              ticker={chain.ticker}
              address={chain.address}
              payableUsd={due}
              onPaid={() => setStep("pending")}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="font-display text-xs uppercase tracking-[0.22em] text-volt">
        Payment gateway
      </p>
      <h1 className="mt-2 font-display text-4xl">Clear the lane. Dock it.</h1>
      <p className="mt-3 text-mist">
        {selected.name} · {selected.hashrate} {selected.unit} · {selected.days}{" "}
        days
      </p>

      <div className="glow-volt mt-8 rounded-2xl border border-volt/50 bg-panel/85 p-6 backdrop-blur-md sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <span className="rounded-full bg-raised px-3 py-1 font-display text-[10px] uppercase tracking-[0.18em] text-mist">
            {selected.algo}
          </span>
        </div>

        <div className="mt-8">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-mist">
            Amount due
          </p>
          <p className="mt-1 font-display text-5xl text-volt">{usd(due)}</p>
          {dueCoin != null && coinTicker && (
            <p className="mt-1 font-display text-xl text-ink">
              {coin(dueCoin, coinTicker)}
            </p>
          )}
          <p className="mt-2 text-sm text-mist">{selected.tagline}</p>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-raised p-3">
            <dt className="text-xs uppercase tracking-[0.14em] text-mist">
              Wallet
            </dt>
            <dd className="mt-1 font-display text-lg">{usd(balanceUsd)}</dd>
          </div>
          <div className="rounded-xl bg-raised p-3">
            <dt className="text-xs uppercase tracking-[0.14em] text-mist">
              Plan
            </dt>
            <dd className="mt-1 font-display text-lg">{usd(total)}</dd>
          </div>
          <div className="rounded-xl bg-raised p-3">
            <dt className="text-xs uppercase tracking-[0.14em] text-mist">
              Profit
            </dt>
            <dd className="mt-1 font-display text-lg leading-snug text-copper">
              {btc(profitBtc)}{" "}
              <span className="text-sm text-mist">({usd(profitUsd, 0)})</span>
            </dd>
          </div>
        </dl>

        <p className="mt-8 font-display text-xs uppercase tracking-[0.16em] text-mist">
          Method
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm ${
                method === m.id
                  ? "bg-volt text-foam"
                  : "border border-line text-mist hover:text-foam"
              }`}
            >
              <m.icon size={15} />
              {m.label}
            </button>
          ))}
        </div>
        {method === "usdt" && (
          <div className="mt-3 flex gap-2">
            {USDT_NETWORKS.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setUsdtNetwork(n.id)}
                className={`rounded-full px-4 py-2 text-sm ${
                  usdtNetwork === n.id
                    ? "bg-volt text-foam"
                    : "border border-line text-mist hover:text-foam"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}

        {err && (
          <p className="mt-5 rounded-xl border border-copper/40 bg-copper/10 px-4 py-3 text-sm">
            {err}
          </p>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={pay}
          className="mt-8 w-full rounded-full bg-volt py-3 text-sm font-semibold text-foam disabled:opacity-60"
        >
          {busy ? "Clearing the hall…" : `Pay ${usd(due)} and dock`}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-3 w-full rounded-full border border-line py-3 text-sm text-foam"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
