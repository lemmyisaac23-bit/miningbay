import { WinnerBadge } from "../components/WinnerBadge";

const TROPHIES = [
  {
    issuer: "gbm" as const,
    lines: ["BEST CLOUD MINING", "COMPANY", "UK"],
    title: "Best Cloud Mining Company UK",
    year: "2025",
    body: "Named for hosted hashpower operations serving UK clients from industrial halls.",
  },
  {
    issuer: "gbaf" as const,
    lines: ["BEST GREEN ENERGY", "RECYCLING", "COMPANY"],
    title: "Best Green Energy Recycling Company",
    year: "2026",
    body: "Recognized for hydro rail, heat recovery, and recycling waste current on campus.",
  },
  {
    issuer: "brm" as const,
    lines: ["BEST RELIABLE", "CLOUD MINING", "LEASING CO"],
    title: "Best Reliable Cloud Mining Leasing Co",
    year: "2025",
    body: "Honored for contract uptime, on-site ops, and lanes that stay docked as leased.",
  },
];

const TEAM = [
  {
    src: "/home/team-sigrid.jpg",
    name: "Sigrid Holm",
    role: "Hall director",
    body: "Runs Hall A ops, power windows, and every dock that goes live.",
  },
  {
    src: "/home/team-kwame.jpg",
    name: "Kwame Mensah",
    role: "Power and cooling lead",
    body: "Keeps the hydro rail, loops, and meters honest across the campus.",
  },
  {
    src: "/home/team-hana.jpg",
    name: "Hana Park",
    role: "Client desk",
    body: "Owns wallets, tickets, and the path from deposit to a live lane.",
  },
];

export function AppHome() {
  return (
    <div className="mx-auto max-w-4xl space-y-14">
      <section>
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
          About
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Volt Mining Bay</h1>
        <img
          src="/home/home-bay-few-miners.jpg"
          alt="Small Volt Mining Bay hall with a few ASIC docks"
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          className="mt-6 h-72 w-full rounded-2xl border border-line object-cover md:h-96"
        />
        <div className="mt-6 space-y-4 leading-relaxed text-mist">
          <p>
            Volt Mining Bay is a hosted hashpower desk. You lease industrial ASIC
            and GPU capacity. We rack the machines, buy the power, and run the
            cooling. Hashpower stays in our halls — not in a bedroom farm.
          </p>
          <p>
            The bay is built for clients who want a contract, a wallet, and daily
            payouts without owning hardware. Hall ops meter every lane. You dock,
            we keep the current live.
          </p>
        </div>
      </section>

      <section>
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
          Hosted mining
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold">
          Capacity in the hall. Payouts in your wallet.
        </h2>
        <img
          src="/home/hosted-racks.jpg"
          alt="Dense computing racks"
          width={1200}
          height={675}
          loading="lazy"
          decoding="async"
          className="mt-6 h-72 w-full rounded-2xl border border-line object-cover md:h-96"
        />
        <div className="mt-6 space-y-4 leading-relaxed text-mist">
          <p>
            Hosted hashpower means the rigs never leave the campus. You buy a
            term and a hashrate. Electricity, cooling, and maintenance sit in
            the contract price. Output is credited to your bay wallet while the
            lane is live.
          </p>
          <p>
            This is not a home miner you plug in yourself. It is industrial
            capacity on hydro rail. When a contract ends, the lane undocks. When
            hall ops stop a dock, it stops mining until they activate it again.
          </p>
        </div>
      </section>

      <section>
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
          Recognition
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {TROPHIES.map((t) => (
            <article
              key={t.title}
              className="overflow-hidden rounded-2xl border border-line bg-panel"
            >
              <WinnerBadge issuer={t.issuer} lines={t.lines} year={t.year} />
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-volt">
                  {t.year}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{t.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
          Team
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {TEAM.map((m) => (
            <article
              key={m.name}
              className="overflow-hidden rounded-2xl border border-line bg-panel"
            >
              <img
                src={m.src}
                alt={m.name}
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover object-top"
              />
              <div className="p-4">
                <h3 className="font-display text-lg font-bold">{m.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-volt">
                  {m.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mist">{m.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
          Location
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-panel p-6">
          <p className="font-display text-xl font-bold">Volt Mining Bay</p>
          <p className="mt-3 leading-relaxed text-mist">
            Moortown, Leeds LS17 6HW, UK
          </p>
          <p className="mt-4 text-sm text-mist">
            Leeds campus · 48 MW contracted rail · closed-loop cooling
          </p>
        </div>
      </section>
    </div>
  );
}
