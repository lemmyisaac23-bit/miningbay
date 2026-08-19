import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useAppState } from "../context/AppState";

export function AdminClients() {
  const { clients } = useAppState();
  const newest = [...clients].sort((a, b) => b.joinedAt - a.joinedAt);

  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
        Clients
      </p>
      <h1 className="mt-2 font-display text-4xl">New and existing bay accounts</h1>
      <p className="mt-3 text-mist">
        Latest sign-ups sit at the top. Open Docks to edit a wallet or pause a lane.
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-panel/80">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bay text-mist">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Credits</th>
              <th className="px-4 py-3 font-medium">Lanes</th>
            </tr>
          </thead>
          <tbody>
            {newest.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <p className="font-display">{c.name}</p>
                  {c.profileVerified ? (
                    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                      <Check size={12} strokeWidth={3} />
                      Verified
                    </p>
                  ) : (
                    <Link
                      to={`/admin/clients/${c.id}/address`}
                      className="mt-1 inline-flex rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Complete profile
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3 text-mist">{c.phone ?? "—"}</td>
                <td className="px-4 py-3 text-mist">{c.country ?? "—"}</td>
                <td className="px-4 py-3 text-mist">
                  {new Date(c.joinedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-volt">{c.balanceUsd.toFixed(2)}</td>
                <td className="px-4 py-3">{c.contracts.filter((x) => x.active).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
