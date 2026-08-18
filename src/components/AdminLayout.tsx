import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Users, LifeBuoy, LogOut, Shield, ClipboardList, Cpu } from "lucide-react";
import { Logo } from "./Logo";
import { useAppState } from "../context/AppState";

const NAV = [
  { to: "/admin", label: "Clients", icon: Users, end: true },
  { to: "/admin/docks", label: "Docks", icon: Cpu },
  { to: "/admin/withdraw-log", label: "Withdraw Log", icon: ClipboardList },
  { to: "/admin/tickets", label: "Tickets", icon: LifeBuoy },
];

export function AdminLayout() {
  const { admin, adminLogout, clients, tickets } = useAppState();
  const navigate = useNavigate();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  const openTickets = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="relative min-h-screen text-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-white md:border-b-0 md:border-r">
        <div className="px-4 py-4">
          <NavLink to="/">
            <Logo />
          </NavLink>
          <p className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-copper">
            <Shield size={12} /> Hall ops
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-bay font-semibold text-copper" : "text-mist hover:text-ink"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
              {item.to === "/admin/tickets" && openTickets > 0 && (
                <span className="ml-auto rounded-full bg-copper px-2 text-[10px] text-ink">
                  {openTickets}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-line p-4 md:block">
          <p className="text-xs text-mist">{clients.length} clients on file</p>
          <button
            type="button"
            onClick={() => {
              adminLogout();
              navigate("/login");
            }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-mist hover:text-ink"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <div>
        <div className="border-b border-line bg-white px-4 py-3 md:px-8">
          <p className="text-sm text-mist">Volt Mining Bay · operations console</p>
        </div>
        <div className="px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
