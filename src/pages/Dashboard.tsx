import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppState } from "../context/AppState";
import { usd } from "../lib/format";
import { PlanCatalog } from "../components/PlanCatalog";
import { FeatureStrip } from "../components/FeatureStrip";
import { useLiveHashrate } from "../hooks/useLiveHashrate";

export function Dashboard() {
  const { user, contracts, balanceUsd, pausedDockIds } = useAppState();
  const { value: liveHashrate, history } = useLiveHashrate();
  const active = contracts.filter(
    (c) => c.active && !c.paused && !(pausedDockIds ?? []).includes(c.id),
  );

  const chart = history;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mist">
            Balance
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-volt">
            {usd(balanceUsd)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/app/deposit"
            className="rounded-full bg-volt px-5 py-2.5 text-sm font-semibold text-foam"
          >
            Deposit
          </Link>
          <Link
            to="/app/withdraw"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold"
          >
            Withdraw
          </Link>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
          Overview
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          {user?.name}, the hall is live.
        </h1>
      </div>

      <div className="mt-8">
        <FeatureStrip />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ["Live hashrate", `${liveHashrate.toFixed(1)} TH/s`],
          ["Active lanes", String(active.length)],
        ].map(([k, v]) => (
          <div
            key={k}
            className="rounded-2xl bg-[#0b1b3a] px-6 py-6 text-white shadow-[0_12px_32px_rgba(11,27,58,0.18)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ec2ff]">
              {k}
            </p>
            <p className="mt-3 font-display text-4xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-[#0b1b3a] p-6 text-white shadow-[0_12px_32px_rgba(11,27,58,0.18)]">
        <p className="text-sm text-[#9ec2ff]">Live SHA-256</p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6b97ff" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#3478f8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" stroke="#9ec2ff" fontSize={12} />
              <YAxis stroke="#9ec2ff" fontSize={12} domain={[12, 23]} />
              <Tooltip
                contentStyle={{
                  background: "#0b1b3a",
                  border: "1px solid #3478f8",
                  color: "#ffffff",
                }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="#7eb6ff"
                strokeWidth={2}
                fill="url(#g)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
              Plans
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">
              Pick a lane. Dock it.
            </h2>
          </div>
          <Link to="/app/plans" className="text-sm font-bold text-volt">
            All plans →
          </Link>
        </div>
        <PlanCatalog />
      </div>
    </div>
  );
}
