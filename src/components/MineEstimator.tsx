import { useState } from "react";

const BTC_PER_TH_DAY = 0.00000044;
const MIN_TH = 12;
const MAX_TH = 500;

export function MineEstimator() {
  const [th, setTh] = useState(140);
  const btc = th * BTC_PER_TH_DAY;
  const pct = ((th - MIN_TH) / (MAX_TH - MIN_TH)) * 100;

  return (
    <div className="mt-8 max-w-md rounded-2xl border border-line bg-panel/80 p-5 backdrop-blur-md">
      <p className="text-sm text-mist">You could mine</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-2">
        <span className="font-display text-3xl text-volt md:text-4xl">
          {btc.toFixed(8)}
        </span>
        <span className="text-lg text-foam">BTC / Day</span>
      </p>
      <input
        type="range"
        min={MIN_TH}
        max={MAX_TH}
        step={1}
        value={th}
        onChange={(e) => setTh(Number(e.target.value))}
        className="mine-slider mt-5 w-full"
        style={{ ["--mine-pct" as string]: `${pct}%` }}
        aria-label="Hashrate in TH/s"
      />
      <p className="mt-3 text-sm text-foam">with {th} TH / s</p>
      <p className="mt-2 text-xs text-mist">Antminer S21 hydro</p>
    </div>
  );
}
