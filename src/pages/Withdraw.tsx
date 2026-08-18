import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { money } from "../data/plans";
import { usd } from "../lib/format";

const WITHDRAW_MIN = 20;

export function WithdrawPage() {
  const { balanceUsd, withdraw } = useAppState();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const amount = Number(raw);
  const validAmount =
    Number.isFinite(amount) && amount >= WITHDRAW_MIN && amount <= balanceUsd;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const wallet = address.trim();
    if (wallet.length < 8) {
      setError("Enter a valid wallet address.");
      return;
    }
    if (!validAmount) {
      setError(
        `Enter an amount between ${usd(WITHDRAW_MIN)} and your balance of ${usd(balanceUsd)}.`,
      );
      return;
    }
    const ok = withdraw(money(amount), wallet);
    if (!ok) {
      setError(
        `Enter an amount between ${usd(WITHDRAW_MIN)} and your balance of ${usd(balanceUsd)}.`,
      );
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-volt">
          Withdraw
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">
          Withdrawal submitted
        </h1>
        <p className="mt-3 text-mist">
          Hall ops will send the funds to your wallet after review.
        </p>
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="mt-8 w-full rounded-xl bg-[#16a34a] py-3.5 text-sm font-bold text-white"
        >
          Return
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
        Withdraw
      </h1>
      <p className="mt-2 text-mist">
        Enter the wallet address and amount. Available{" "}
        <span className="font-semibold text-ink">{usd(balanceUsd)}</span>
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <label className="block text-sm">
          Wallet address <span className="text-copper">*</span>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Paste your wallet address"
            className="mt-2 w-full rounded-xl border border-line bg-panel px-3 py-3 outline-none"
          />
        </label>

        <label className="block text-sm">
          Amount
          <span className="mt-2 flex overflow-hidden rounded-xl border border-line bg-panel">
            <input
              required
              type="number"
              min={WITHDRAW_MIN}
              max={balanceUsd}
              step="0.01"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 outline-none"
            />
            <span className="grid place-items-center bg-copper px-4 text-sm font-semibold text-ink">
              USD
            </span>
          </span>
        </label>

        {error && (
          <p className="rounded-xl border border-copper/40 bg-copper/10 px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-copper py-3.5 text-sm font-semibold text-ink"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
