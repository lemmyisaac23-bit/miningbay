import { Link } from "react-router-dom";
import { type Plan, planProfit, planProfitBtc } from "../data/plans";
import { btc, usd } from "../lib/format";

export function PlanCard({
  plan,
  onBuy,
}: {
  plan: Plan;
  onBuy?: (plan: Plan) => void;
}) {
  const profitUsd = planProfit(plan);
  const profitBtc = planProfitBtc(plan);

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-xl bg-white ${
        plan.featured
          ? "border-2 border-volt shadow-[0_12px_32px_rgba(52,120,248,0.16)]"
          : "border border-line"
      }`}
    >
      {plan.featured ? (
        <p className="bg-volt py-2 text-center font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          Best value
        </p>
      ) : (
        <div className="h-9" />
      )}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">
          {plan.algo}
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-1 text-sm text-mist">{plan.tagline}</p>
        <p className="mt-6 font-display text-5xl font-extrabold tracking-tight">
          {usd(plan.priceUsd, 0)}
        </p>
        <p className="mt-1 text-sm text-mist">
          {plan.hashrate} {plan.unit} · {plan.days} days
        </p>
        <dl className="mt-5 space-y-2 text-left text-sm">
          <div className="rounded-lg bg-[#f4f8ff] px-3 py-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-mist">Term</dt>
            <dd className="font-display text-lg">{plan.days} days</dd>
          </div>
          <div className="rounded-lg bg-[#f4f8ff] px-3 py-2">
            <dt className="text-xs uppercase tracking-[0.14em] text-mist">Profit</dt>
            <dd className="font-display text-lg leading-snug text-volt">
              {btc(profitBtc)}{" "}
              <span className="text-sm font-semibold text-mist">
                ({usd(profitUsd, 0)})
              </span>
            </dd>
          </div>
        </dl>
        {onBuy ? (
          <button
            type="button"
            onClick={() => onBuy(plan)}
            className="mt-6 w-full rounded-xl bg-[#16a34a] py-3.5 text-center text-sm font-bold text-white"
          >
            Dock this lane
          </button>
        ) : (
          <Link
            to="/login"
            className="mt-6 w-full rounded-xl bg-[#16a34a] py-3.5 text-center text-sm font-bold text-white"
          >
            Sign in to dock
          </Link>
        )}
      </div>
    </article>
  );
}
