import { PLANS } from "../data/plans";
import { PlanCard } from "./PlanCard";
import { InsufficientFunds } from "./InsufficientFunds";
import { useDockLane } from "../hooks/useDockLane";

export const BTC_PLANS = PLANS.filter((p) => p.coinTicker === "BTC");

export function BitcoinLanes() {
  const { dock, shortPlan, balanceUsd, closeShort, goDeposit, goGateway } =
    useDockLane();

  return (
    <div>
      {shortPlan && (
        <InsufficientFunds
          plan={shortPlan}
          balanceUsd={balanceUsd}
          onClose={closeShort}
          onDeposit={goDeposit}
          onGateway={goGateway}
        />
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {BTC_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onBuy={dock} />
        ))}
      </div>
    </div>
  );
}
