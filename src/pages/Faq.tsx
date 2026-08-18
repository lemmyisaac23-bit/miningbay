import { useState } from "react";
import { FAQS } from "../data/content";

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-volt">FAQ</p>
      <h1 className="mt-3 font-display text-5xl">Before you dock.</h1>
      <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-panel">
        {FAQS.map((item, i) => (
          <button
            key={item.q}
            type="button"
            onClick={() => setOpen(i === open ? -1 : i)}
            className="block w-full px-5 py-4 text-left"
          >
            <p className="font-display text-lg">{item.q}</p>
            {open === i && (
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.a}</p>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
