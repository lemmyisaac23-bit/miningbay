import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { usd } from "../lib/format";

export function WithdrawLogPage() {
  const { user, withdrawals } = useAppState();
  const { pathname } = useLocation();
  const hallOps = pathname.startsWith("/admin");

  const rows = useMemo(() => {
    const list = hallOps
      ? withdrawals
      : withdrawals.filter((w) => w.email === user?.email);
    return [...list].sort((a, b) => b.at - a.at);
  }, [hallOps, withdrawals, user?.email]);

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold">Withdraw Log</h1>
      <div className="mt-6 overflow-hidden rounded-2xl bg-[#0b1b3a] text-white shadow-[0_12px_32px_rgba(11,27,58,0.18)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white">
                <th className="px-5 py-4 font-semibold">Time</th>
                <th className="px-5 py-4 font-semibold">Transaction ID</th>
                <th className="px-5 py-4 font-semibold">Wallet</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-24 text-center text-[#9aa8bd]">
                    No Data Found!
                  </td>
                </tr>
              ) : (
                rows.map((w) => (
                  <tr key={w.id} className="border-t border-white/10">
                    <td className="whitespace-nowrap px-5 py-4 text-[#d7e4ff]">
                      {new Date(w.at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#d7e4ff]">
                      {w.id}
                    </td>
                    <td className="max-w-[220px] truncate px-5 py-4 font-mono text-xs text-[#d7e4ff]">
                      {w.wallet}
                    </td>
                    <td className="px-5 py-4 text-[#d7e4ff]">{usd(w.amountUsd)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
