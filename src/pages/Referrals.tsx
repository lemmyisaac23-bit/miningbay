import { useState } from "react";
import { useAppState } from "../context/AppState";

export function Referrals() {
  const { referralCode } = useAppState();
  const [copied, setCopied] = useState(false);
  const link = `https://voltminebay.portfolio/register?ref=${referralCode}`;

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Referrals</h1>
      <p className="mt-3 max-w-xl text-mist">
        Share your bay code. In this portfolio the code is yours to copy — a live
        hall would credit 3% of a referred miner&apos;s first contract.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-mist">Your code</p>
        <p className="mt-2 font-display text-3xl text-volt">{referralCode}</p>
        <p className="mt-4 break-all text-sm text-mist">{link}</p>
        <button
          type="button"
          onClick={copy}
          className="mt-5 rounded-full bg-volt px-5 py-2 text-sm font-semibold text-foam"
        >
          {copied ? "Copied" : "Copy invite"}
        </button>
      </div>
    </div>
  );
}
