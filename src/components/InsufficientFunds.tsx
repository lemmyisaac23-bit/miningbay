import { X } from "lucide-react";
import { useEffect } from "react";
import { type Plan, planDockTotal, planShortfall } from "../data/plans";
import { usd } from "../lib/format";

export function InsufficientFunds({
  plan,
  balanceUsd,
  onClose,
  onDeposit,
  onGateway,
}: {
  plan: Plan;
  balanceUsd: number;
  onClose: () => void;
  onDeposit: () => void;
  onGateway: () => void;
}) {
  const total = planDockTotal(plan);
  const shortfall = planShortfall(plan, balanceUsd);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="insufficient-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-[0_24px_80px_rgba(18,20,26,0.18)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="insufficient-title"
            className="font-display text-2xl text-ink sm:text-3xl"
          >
            Insufficient Funds
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foam text-danger"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-ink sm:text-base">
          <p>
            You need{" "}
            <span className="font-semibold text-copper">{usd(total)}</span> to
            purchase this plan.
          </p>
          <p>
            Your current balance:{" "}
            <span className="font-semibold">{usd(balanceUsd)}</span>
          </p>
          <p>
            You need{" "}
            <span className="font-semibold text-copper">{usd(shortfall)}</span>{" "}
            or more.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onDeposit}
            className="rounded-xl bg-copper py-3 text-sm font-semibold text-ink"
          >
            Go to Deposit Page
          </button>
          <button
            type="button"
            onClick={onGateway}
            className="rounded-xl border border-copper py-3 text-sm font-semibold text-copper"
          >
            Continue with Payment Gateway
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line py-3 text-sm font-semibold text-ink"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
