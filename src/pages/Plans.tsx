import { FeatureStrip } from "../components/FeatureStrip";
import { PlanCatalog } from "../components/PlanCatalog";

export function Plans() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
          Plans
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Pick a lane. Dock it.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-mist">
          Lease hosted hashpower by the lane. Power, cooling, and ops stay in
          the hall.
        </p>
      </div>
      <div className="mt-8">
        <FeatureStrip />
      </div>
      <div className="mt-10">
        <PlanCatalog />
      </div>
    </div>
  );
}
