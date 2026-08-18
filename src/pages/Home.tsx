import { Link } from "react-router-dom";
import { ArrowRight, Shield, Thermometer, Timer } from "lucide-react";
import { STATS, STEPS } from "../data/content";
import { MineEstimator } from "../components/MineEstimator";

export function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bay" />
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-volt/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-32 h-64 w-64 rounded-full bg-copper/15 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-volt">
              Hosted hashpower · industrial halls
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-6xl">
              Hashpower
              <br />
              docked.
              <br />
              <span className="text-volt">Voltage live.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-mist">
              Volt Mining Bay leases industrial ASIC and GPU lanes. You buy a
              contract. We run power, cooling, and the hall. Payouts land in
              your bay wallet every day.
            </p>
            <MineEstimator />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-3 text-sm font-semibold text-foam"
              >
                Sign in to dock <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm"
              >
                See the bay
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bay/70 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mist">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="font-display text-xs uppercase tracking-[0.28em] text-volt">
          How the bay works
        </p>
        <h2 className="mt-3 font-display text-4xl">Two steps. Then current.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-2xl border border-line bg-panel/80 p-6 backdrop-blur-md">
              <p className="font-display text-volt">{step.n}</p>
              <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-bay/70 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {[
            {
              icon: Thermometer,
              title: "Hydro halls",
              body: "Closed-loop cooling keeps S21-class units at a steady 22°C intake. Less thermal throttle, more uptime.",
            },
            {
              icon: Timer,
              title: "Daily settlement",
              body: "Output is metered per lane and credited to your wallet. This portfolio streams credits every few seconds.",
            },
            {
              icon: Shield,
              title: "All-in power",
              body: "Contract price includes electricity and ops. No surprise kilowatt invoices after you dock.",
            },
          ].map((item) => (
            <div key={item.title}>
              <item.icon className="text-volt" size={22} />
              <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl border border-volt/30 bg-panel/80 p-8 backdrop-blur-md md:p-12">
          <h2 className="font-display text-4xl md:text-5xl">
            Bring a wallet.
            <br />
            Leave the racks to us.
          </h2>
          <p className="mt-4 max-w-lg text-mist">
            Create a bay account, top up, and lock a lane in under a minute.
            This build is a full portfolio — balances and contracts live in your
            browser.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex rounded-full bg-volt px-6 py-3 text-sm font-semibold text-foam"
          >
            Open a bay account
          </Link>
        </div>
      </section>
    </main>
  );
}
