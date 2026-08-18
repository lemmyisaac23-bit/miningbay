import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";

export function WalletPage() {
  const { balanceUsd, txs } = useAppState();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="font-display text-4xl">Wallet</h1>
      <p className="mt-2 text-mist">
        Portfolio ledger. Deposits credit instantly. Mining payouts stream in while
        contracts are live.
      </p>
      <div className="mt-6 rounded-2xl border border-line bg-panel p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-mist">Available</p>
        <p className="font-display text-5xl text-volt">
          {balanceUsd.toFixed(2)} credits
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/app/deposit")}
            className="rounded-full bg-volt px-5 py-2 text-sm font-semibold text-foam"
          >
            Deposit
          </button>
          <button
            type="button"
            onClick={() => navigate("/app/withdraw")}
            className="rounded-full border border-line px-5 py-2 text-sm"
          >
            Withdraw
          </button>
        </div>
      </div>
      <h2 className="mt-10 font-display text-2xl">Ledger</h2>
      <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
        {txs.length === 0 && (
          <li className="px-4 py-6 text-sm text-mist">No movements yet.</li>
        )}
        {txs.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p>{tx.label}</p>
              <p className="text-xs text-mist">
                {new Date(tx.at).toLocaleString()}
              </p>
            </div>
            <p className={tx.amountUsd >= 0 ? "text-volt" : "text-foam"}>
              {tx.amountUsd >= 0 ? "+" : ""}
              {tx.amountUsd.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
