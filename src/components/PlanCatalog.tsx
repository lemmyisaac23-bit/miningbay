import { useMemo, useState } from "react";
import { PLANS, type Algo } from "../data/plans";
import { PlanCard } from "./PlanCard";
import { InsufficientFunds } from "./InsufficientFunds";
import { useDockLane } from "../hooks/useDockLane";

const ALGOS: Array<Algo | "All"> = [
  "All",
  "Scrypt",
  "SHA-256",
];

export function PlanCatalog() {
  const [algo, setAlgo] = useState<Algo | "All">("All");
  const { dock, shortPlan, balanceUsd, closeShort, goDeposit, goGateway } =
    useDockLane();

  const list = useMemo(
    () => (algo === "All" ? PLANS : PLANS.filter((p) => p.algo === algo)),
    [algo],
  );

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
      <div className="flex flex-wrap justify-center gap-2">
        {ALGOS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAlgo(a)}
            className={`rounded-md px-4 py-2 text-sm font-bold ${
              algo === a
                ? "bg-volt text-white"
                : "border border-line bg-white text-mist"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onBuy={dock} />
        ))}
      </div>
    </div>
  );
}
