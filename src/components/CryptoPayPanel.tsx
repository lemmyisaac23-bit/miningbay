import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { coin, usd } from "../lib/format";
import { hasCoinQuote, usdToCoin } from "../data/rates";
import { useCoinPrice } from "../hooks/useCoinPrice";

export function CryptoPayPanel({
  coin: coinName,
  ticker,
  address,
  payableUsd,
  onPaid,
}: {
  coin: string;
  ticker: string;
  address: string;
  payableUsd: number;
  onPaid: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const price = useCoinPrice(hasCoinQuote(ticker) ? ticker : undefined);
  const coinAmt = price ? usdToCoin(payableUsd, price) : null;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&ecc=M&margin=8&data=${encodeURIComponent(address)}`;

  function copyAddress() {
    void navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 text-center">
      <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-volt">
        {coinName} payment
      </p>
      {coinAmt != null ? (
        <>
          <p className="mt-3 font-display text-3xl font-extrabold text-ink">
            {coin(coinAmt, ticker)}
          </p>
          <p className="mt-1 text-mist">
            Send this amount ({usd(payableUsd)}) to the address below.
          </p>
        </>
      ) : (
        <p className="mt-2 text-mist">
          Send <span className="font-semibold text-ink">{usd(payableUsd)}</span> in{" "}
          {ticker} to this address.
        </p>
      )}
      <img
        src={qrSrc}
        alt={`${coinName} deposit QR code`}
        width={240}
        height={240}
        className="mx-auto mt-6 rounded-xl border border-line bg-white p-2"
      />
      <p className="mt-5 break-all font-mono text-sm leading-relaxed text-ink">
        {address}
      </p>
      <button
        type="button"
        onClick={copyAddress}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold"
      >
        {copied ? <Check size={16} className="text-[#16a34a]" /> : <Copy size={16} />}
        {copied ? "Copied" : "Copy address"}
      </button>
      <button
        type="button"
        onClick={onPaid}
        className="mt-6 w-full rounded-xl bg-[#16a34a] py-3.5 text-sm font-bold text-white"
      >
        I have made payment
      </button>
    </div>
  );
}
