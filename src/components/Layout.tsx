import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="relative min-h-screen text-ink">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
