import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  FileStack,
  Gift,
  LogOut,
  Zap,
  Cpu,
  Layers,
  LifeBuoy,
  ClipboardList,
  Moon,
  Sun,
  Home,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAppState } from "../context/AppState";
import { useTheme } from "../context/Theme";
import { usd } from "../lib/format";

const NAV = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/app/plans", label: "Plans", icon: Layers },
  { to: "/app/portfolio", label: "Portfolio", icon: Cpu },
  { to: "/app/contracts", label: "Contracts", icon: FileStack },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/withdraw-log", label: "Withdraw Log", icon: ClipboardList },
  { to: "/app/referrals", label: "Referrals", icon: Gift },
  { to: "/app/support", label: "Support", icon: LifeBuoy },
];

export function DashboardLayout() {
  const { user, logout, balanceUsd } = useAppState();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen text-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-panel md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4 md:block">
          <NavLink to="/">
            <Logo />
          </NavLink>
          <button
            type="button"
            onClick={toggleDark}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-mist hover:text-ink md:hidden"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
        <NavLink
          to="/app/wallet"
          className="mx-3 mb-3 hidden rounded-2xl border border-line bg-white px-4 py-3 md:block"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mist">
            Balance
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-volt">
            {usd(balanceUsd)}
          </p>
        </NavLink>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-bay font-semibold text-volt" : "text-mist hover:text-ink"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-line p-4 md:block">
          <button
            type="button"
            onClick={toggleDark}
            className="mb-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-mist hover:bg-bay hover:text-ink"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-mist hover:text-ink"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <div>
        <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3 md:px-8">
          <p className="inline-flex items-center gap-2 text-sm text-mist">
            <Zap size={14} className="text-volt" />
            Hall A · hydro cooled · live
          </p>
          <p className="text-sm">
            <span className="mr-3 font-display font-bold text-volt md:hidden">
              {usd(balanceUsd)}
            </span>
            {user.name} <span className="text-mist">· {user.email}</span>
          </p>
        </div>
        <div className="px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
