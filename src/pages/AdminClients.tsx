import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useAppState } from "../context/AppState";
import { usd } from "../lib/format";

export function AdminClients() {
  const { clients, setClientBalance } = useAppState();
  const newest = [...clients].sort((a, b) => b.joinedAt - a.joinedAt);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function saveBalance(email: string, clientId: string) {
    const raw = drafts[clientId];
    const value = Number(raw);
    if (raw == null || Number.isNaN(value) || value < 0) {
      setMsg("Enter a valid credit amount.");
      return;
    }
    setSaving(clientId);
    const res = await setClientBalance(email, value);
    setSaving(null);
    if (!res.ok) {
      setMsg(res.error || "Could not save this balance.");
      return;
    }
    setMsg(`Updated ${email} to ${usd(value)}.`);
  }

  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
        Clients
      </p>
      <h1 className="mt-2 font-display text-4xl">New and existing bay accounts</h1>
      <p className="mt-3 text-mist">
        Latest sign-ups sit at the top. Edit a wallet here, or open Docks to
        pause a lane.
      </p>
      {msg && <p className="mt-4 text-sm text-volt">{msg}</p>}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-panel/80">
        <table className="w-full min-w-[720px] text-left text-sm">
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
                <td className="px-4 py-3">
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(e: FormEvent) => {
                      e.preventDefault();
                      void saveBalance(c.email, c.id);
                    }}
                  >
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={drafts[c.id] ?? c.balanceUsd.toFixed(2)}
                      onChange={(e) =>
                        setDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))
                      }
                      className="w-28 rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
                      aria-label={`Balance for ${c.name}`}
                    />
                    <button
                      type="submit"
                      disabled={saving === c.id}
                      className="rounded-full bg-copper px-3 py-1 text-xs font-semibold text-ink disabled:opacity-60"
                    >
                      {saving === c.id ? "Saving" : "Save"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">{c.contracts.filter((x) => x.active).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
