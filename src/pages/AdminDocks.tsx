import { FormEvent, useState } from "react";
import { useAppState } from "../context/AppState";
import { PLANS } from "../data/plans";
import { daysLeft, usd } from "../lib/format";

export function AdminDocks() {
  const { clients, setDockPaused, setClientBalance } = useAppState();
  const [email, setEmail] = useState(clients[0]?.email ?? "");
  const [amount, setAmount] = useState(clients[0]?.balanceUsd.toFixed(2) ?? "0");
  const [msg, setMsg] = useState<string | null>(null);

  const selected = clients.find((c) => c.email === email);
  const docks = clients.flatMap((client) =>
    client.contracts.map((dock) => ({ client, dock })),
  );

  function pick(nextEmail: string) {
    const client = clients.find((c) => c.email === nextEmail);
    setEmail(nextEmail);
    setAmount(client ? client.balanceUsd.toFixed(2) : "0");
    setMsg(null);
  }

  function onSaveBalance(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!email || Number.isNaN(value) || value < 0) {
      setMsg("Enter a valid credit amount.");
      return;
    }
    setClientBalance(email, value);
    setMsg(`Updated ${email} to ${usd(value)}.`);
  }

  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
        Docks
      </p>
      <h1 className="mt-2 font-display text-4xl">Stop, activate, and credit</h1>
      <p className="mt-3 text-mist">
        A stopped lane earns nothing until hall ops activate it. Edit a client
        wallet from the same console.
      </p>

      <form
        onSubmit={onSaveBalance}
        className="mt-8 max-w-lg space-y-4 rounded-2xl border border-line bg-panel/80 p-6"
      >
        <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-mist">
          Balance
        </p>
        <label className="block text-sm">
          Client
          <select
            value={email}
            onChange={(e) => pick(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.email}>
                {c.name} · {c.email}
              </option>
            ))}
          </select>
        </label>
        {selected && (
          <p className="text-sm text-mist">
            Current: {usd(selected.balanceUsd)}
          </p>
        )}
        <label className="block text-sm">
          New balance
          <input
            type="number"
            min={0}
            step={0.01}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-copper px-5 py-2 text-sm font-semibold text-ink"
        >
          Save balance
        </button>
        {msg && <p className="text-sm text-volt">{msg}</p>}
      </form>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-panel/80">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-bay text-mist">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Balance</th>
              <th className="px-4 py-3 font-medium">Lane</th>
              <th className="px-4 py-3 font-medium">Term left</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {docks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-mist">
                  No docks on file.
                </td>
              </tr>
            )}
            {docks.map(({ client, dock }) => {
              const plan = PLANS.find((p) => p.id === dock.planId);
              const stopped = Boolean(dock.active && dock.paused);
              const live = Boolean(dock.active && !dock.paused);
              return (
                <tr key={`${client.email}-${dock.id}`} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p className="font-display">{client.name}</p>
                    <p className="text-xs text-mist">{client.email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-volt">
                    {usd(client.balanceUsd)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-display">{plan?.name ?? dock.planId}</p>
                    <p className="text-xs text-mist">
                      {plan ? `${plan.hashrate} ${plan.unit}` : dock.id}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-mist">{daysLeft(dock.endsAt)}d</td>
                  <td className="px-4 py-3">
                    {live && <span className="font-semibold text-volt">Live</span>}
                    {stopped && (
                      <span className="font-semibold text-amber-600">Stopped</span>
                    )}
                    {!dock.active && <span className="text-mist">Ended</span>}
                  </td>
                  <td className="px-4 py-3">
                    {dock.active ? (
                      <button
                        type="button"
                        onClick={() =>
                          setDockPaused(client.email, dock.id, !stopped)
                        }
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                          stopped
                            ? "bg-[#16a34a] text-white"
                            : "border border-line bg-white"
                        }`}
                      >
                        {stopped ? "Activate" : "Stop"}
                      </button>
                    ) : (
                      <span className="text-mist">—</span>
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
