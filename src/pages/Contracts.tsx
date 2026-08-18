import { Link } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { PLANS } from "../data/plans";
import { daysLeft } from "../lib/format";

export function Contracts() {
  const { contracts } = useAppState();

  if (contracts.length === 0) {
    return (
      <div>
        <h1 className="font-display text-4xl">Contracts</h1>
        <p className="mt-3 text-mist">Nothing docked. Lease a lane to start current.</p>
        <Link
          to="/app/portfolio"
          className="mt-6 inline-block rounded-full bg-volt px-4 py-2 text-sm font-semibold text-foam"
        >
          View plans
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Contracts</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bay text-mist">
            <tr>
              <th className="px-4 py-3 font-medium">Lane</th>
              <th className="px-4 py-3 font-medium">Hashrate</th>
              <th className="px-4 py-3 font-medium">Term left</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => {
              const plan = PLANS.find((p) => p.id === c.planId);
              return (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p className="font-display">{plan?.name ?? c.planId}</p>
                    <p className="text-xs text-mist">{c.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    {plan ? `${plan.hashrate} ${plan.unit}` : "—"}
                  </td>
                  <td className="px-4 py-3">{daysLeft(c.endsAt)}d</td>
                  <td className="px-4 py-3">
                    {!c.active ? (
                      <span className="text-mist">Ended</span>
                    ) : c.paused ? (
                      <span className="font-semibold text-amber-600">Stopped</span>
                    ) : (
                      <span className="text-volt">Live</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
