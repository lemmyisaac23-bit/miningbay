import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppStateProvider } from "./context/AppState";
import { ThemeProvider } from "./context/Theme";
import { BayBackdrop } from "./components/BayBackdrop";
import { Layout } from "./components/Layout";
import { DashboardLayout } from "./components/DashboardLayout";
import { Home } from "./pages/Home";
import { Plans } from "./pages/Plans";
import { About } from "./pages/About";
import { Faq } from "./pages/Faq";
import { Terms } from "./pages/Terms";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { AppHome } from "./pages/AppHome";
import { Portfolio } from "./pages/Portfolio";
import { Contracts } from "./pages/Contracts";
import { WalletPage } from "./pages/Wallet";
import { DepositPage } from "./pages/Deposit";
import { WithdrawPage } from "./pages/Withdraw";
import { WithdrawLogPage } from "./pages/WithdrawLog";
import { PayPage } from "./pages/Pay";
import { Referrals } from "./pages/Referrals";
import { Support } from "./pages/Support";
import { AdminLayout } from "./components/AdminLayout";
import { AdminClients } from "./pages/AdminClients";
import { AdminDocks } from "./pages/AdminDocks";
import { AdminTickets } from "./pages/AdminTickets";

export default function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
      <BrowserRouter>
        <BayBackdrop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/plans" element={<Navigate to="/app/plans" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          </Route>
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<AppHome />} />
            <Route path="home" element={<Navigate to="/app" replace />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="plans" element={<Plans />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="lanes" element={<Navigate to="/app/portfolio" replace />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="deposit" element={<DepositPage />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="withdraw-log" element={<WithdrawLogPage />} />
            <Route path="pay" element={<PayPage />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminClients />} />
            <Route path="docks" element={<AdminDocks />} />
            <Route path="balances" element={<Navigate to="/admin/docks" replace />} />
            <Route path="withdraw-log" element={<WithdrawLogPage />} />
            <Route path="tickets" element={<AdminTickets />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  );
}
