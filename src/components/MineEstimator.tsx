import { useState } from "react";

const BTC_PER_DAY = 0.616;
const MIN_TH = 12;
const MAX_TH = 500;

export function MineEstimator() {
  const [th, setTh] = useState(140);
  const pct = ((th - MIN_TH) / (MAX_TH - MIN_TH)) * 100;

  return (
    <div className="mt-8 max-w-md rounded-2xl border border-line bg-panel/80 p-5 backdrop-blur-md">
      <p className="text-sm text-mist">You can mine</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-2">
        <span className="font-display text-3xl text-volt md:text-4xl">
          {BTC_PER_DAY.toFixed(4)}
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
