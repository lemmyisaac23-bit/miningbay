import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { useAppState } from "../context/AppState";

const LINKS = [
  { to: "/about", label: "The Bay" },
  { to: "/faq", label: "FAQ" },
];

export function Navbar() {
  const { user } = useAppState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-volt" : "text-mist hover:text-ink"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <button
              type="button"
              onClick={() => navigate("/app")}
              className="rounded-full bg-volt px-4 py-2 text-sm font-semibold text-white"
            >
              Open bay
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-mist hover:text-ink">
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-volt px-4 py-2 text-sm font-semibold text-white"
              >
                Dock a contract
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-semibold text-ink"
              >
                {l.label}
              </NavLink>
            ))}
            <Link to={user ? "/app" : "/register"} onClick={() => setOpen(false)}>
              {user ? "Open bay" : "Create account"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
