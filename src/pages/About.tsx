export function About() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-volt">
        The bay
      </p>
      <h1 className="mt-3 font-display text-5xl">A harbor for hash, not a bedroom farm.</h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-mist">
        <p>
          Volt Mining Bay is built as a hosted hashpower desk: you lease capacity,
          we host the machines. The public site and dashboard in this repo are a
          complete product portfolio — accounts, balances, and contracts persist in
          your browser.
        </p>
        <p>
          The design language is industrial voltage: lime current on oil-black
          panels, hall telemetry, and lanes you can actually buy in the portfolio
          wallet.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          ["Location (portfolio)", "Moortown, Leeds LS17 6HW, UK"],
          ["Power", "48 MW contracted rail"],
          ["Cooling", "Closed-loop hydro + dry coolers"],
          ["Fleet", "S21, L9, EPYC"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-mist">{k}</p>
            <p className="mt-2 font-display text-xl">{v}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
