import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
            Industrial hashpower, leased by the lane. Volt Mining Bay hosts ASIC,
            GPU, and CPU halls so you can mine without racking a single unit.
          </p>
        </div>
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-mist">
            Bay
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/about">Facilities</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-mist">
            Account
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/app">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-mist md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Volt Mining Bay. Portfolio platform.</span>
          <span>Estimates move with difficulty and coin price. Not financial advice.</span>
        </div>
      </div>
    </footer>
  );
}
