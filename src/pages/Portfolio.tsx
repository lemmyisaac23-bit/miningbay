import { BitcoinLanes } from "../components/BitcoinLanes";

export function Portfolio() {
  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.22em] text-volt">
        Portfolio
      </p>
      <h1 className="mt-2 font-display text-4xl">Your Bitcoin hashpower</h1>
      <div className="mt-8">
        <BitcoinLanes />
      </div>
    </div>
  );
}
