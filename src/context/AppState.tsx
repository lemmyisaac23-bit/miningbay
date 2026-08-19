import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PLANS, planDockTotal, planShortfall, type Plan } from "../data/plans";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../data/admin";

const STORAGE_KEY = "vmb-state-v2";

export type User = {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
};

export type Profile = {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
};

export type Contract = {
  id: string;
  planId: string;
  startedAt: number;
  endsAt: number;
  earnedUsd: number;
  active: boolean;
  paused?: boolean;
  lastMinedAt?: number;
};

export type Tx = {
  id: string;
  type: "deposit" | "withdraw" | "contract" | "payout" | "adjust" | "fee";
  label: string;
  amountUsd: number;
  at: number;
};

export type Withdrawal = {
  id: string;
  email: string;
  wallet: string;
  amountUsd: number;
  at: number;
  status: "pending";
};

export type ClientAddress = {
  line: string;
  city: string;
  state: string;
  zip: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  address?: ClientAddress;
  profileVerified?: boolean;
  balanceUsd: number;
  contracts: Contract[];
  txs: Tx[];
  referralCode: string;
  joinedAt: number;
};

export type TicketReply = {
  from: "client" | "admin";
  text: string;
  at: number;
};

export type Ticket = {
  id: string;
  email: string;
  name: string;
  subject: string;
  body: string;
  status: "open" | "closed";
  createdAt: number;
  replies: TicketReply[];
};

type State = {
  user: User | null;
  admin: boolean;
  balanceUsd: number;
  contracts: Contract[];
  txs: Tx[];
  referralCode: string;
  clients: Client[];
  tickets: Ticket[];
  withdrawals: Withdrawal[];
  pausedDockIds: string[];
};

type Ctx = State & {
  login: (
    email: string,
    name?: string,
    profile?: Profile,
  ) => { ok: boolean; error?: string };
  logout: () => void;
  adminLogin: (email: string, password: string) => { ok: boolean; error?: string };
  adminLogout: () => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number, address?: string) => boolean;
  buyPlan: (plan: Plan) => { ok: boolean; error?: string };
  payForPlan: (plan: Plan) => { ok: boolean; error?: string };
  setClientBalance: (email: string, balanceUsd: number) => void;
  setClientAddress: (clientId: string, address: ClientAddress) => void;
  setDockPaused: (email: string, contractId: string, paused: boolean) => void;
  openTicket: (subject: string, body: string) => { ok: boolean; error?: string };
  replyTicket: (id: string, text: string, from: "client" | "admin") => void;
  setTicketStatus: (id: string, status: Ticket["status"]) => void;
};

const AppStateContext = createContext<Ctx | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

function makeTx(type: Tx["type"], label: string, amountUsd: number): Tx {
  return { id: uid("tx"), type, label, amountUsd, at: Date.now() };
}

function seedClients(): Client[] {
  const now = Date.now();
  return [
    {
      id: "cli-ada",
      name: "Ada Harbor",
      email: "ada@bay.io",
      firstName: "Ada",
      lastName: "Harbor",
      phone: "+47 555 01 01",
      country: "Norway",
      balanceUsd: 180,
      contracts: [],
      txs: [makeTx("deposit", "Welcome credit", 180)],
      referralCode: "VOLT-ADA-1",
      joinedAt: now - 86_400_000 * 2,
    },
    {
      id: "cli-ken",
      name: "Ken Rails",
      email: "ken@volt.mail",
      firstName: "Ken",
      lastName: "Rails",
      phone: "+1 555 0142",
      country: "United States",
      balanceUsd: 40,
      contracts: [],
      txs: [makeTx("deposit", "Welcome credit", 40)],
      referralCode: "VOLT-KEN-4",
      joinedAt: now - 36_000_000,
    },
    {
      id: "cli-mira",
      name: "Mira Dock",
      email: "mira@hash.bay",
      firstName: "Mira",
      lastName: "Dock",
      phone: "+971 50 555 0190",
      country: "United Arab Emirates",
      balanceUsd: 620,
      contracts: [],
      txs: [makeTx("deposit", "Welcome credit", 620)],
      referralCode: "VOLT-MIRA-9",
      joinedAt: now - 86_400_000 * 6,
    },
  ];
}

function seedTickets(): Ticket[] {
  const now = Date.now();
  return [
    {
      id: "tkt-harbor",
      email: "ada@bay.io",
      name: "Ada Harbor",
      subject: "Harbor lane payout timing",
      body: "My Harbor contract is live but the first credit looks late. Can hall ops check Hall A metering?",
      status: "open",
      createdAt: now - 14_400_000,
      replies: [],
    },
    {
      id: "tkt-scrypt",
      email: "ken@volt.mail",
      name: "Ken Rails",
      subject: "Help docking Scrypt",
      body: "I want a Scrypt Dock lane but the wallet will not clear the contract. Balance shows 40 credits.",
      status: "open",
      createdAt: now - 7_200_000,
      replies: [],
    },
  ];
}

function isDockPaused(c: Contract, pausedDockIds: string[]) {
  return Boolean(c.paused) || pausedDockIds.includes(c.id);
}

function collectPausedIds(clients: Client[], extra: string[] = []) {
  const ids = new Set(extra);
  for (const client of clients) {
    for (const dock of client.contracts) {
      if (dock.paused) ids.add(dock.id);
    }
  }
  return [...ids];
}

function settleContract(
  c: Contract,
  now: number,
  pausedDockIds: string[],
): { contract: Contract; payout: number } {
  if (!c.active) return { contract: c, payout: 0 };

  const paused = isDockPaused(c, pausedDockIds);
  const ended = now >= c.endsAt;

  if (paused) {
    if (ended) {
      return {
        contract: { ...c, active: false, paused: true, lastMinedAt: c.endsAt },
        payout: 0,
      };
    }
    if (c.paused) return { contract: c, payout: 0 };
    return { contract: { ...c, paused: true }, payout: 0 };
  }

  const last = c.lastMinedAt ?? c.startedAt;
  const until = Math.min(now, c.endsAt);
  const plan = PLANS.find((p) => p.id === c.planId);
  const elapsed = Math.max(0, (until - last) / 1000);
  const payout = plan && elapsed > 0 ? (plan.dailyUsd / 86_400) * elapsed : 0;
  const next: Contract = {
    ...c,
    paused: false,
    earnedUsd: c.earnedUsd + payout,
    lastMinedAt: until,
    active: ended ? false : c.active,
  };
  if (payout <= 0 && next.active === c.active && next.lastMinedAt === c.lastMinedAt) {
    return { contract: c, payout: 0 };
  }
  return { contract: next, payout };
}

function settleClients(
  list: Client[],
  now: number,
  pausedDockIds: string[],
) {
  let changed = false;
  const clients = list.map((client) => {
    let payout = 0;
    let dockChanged = false;
    const contracts = client.contracts.map((c) => {
      const res = settleContract(c, now, pausedDockIds);
      payout += res.payout;
      if (res.contract !== c) dockChanged = true;
      return res.contract;
    });
    const mining = contracts.some(
      (c) => c.active && !isDockPaused(c, pausedDockIds) && now < c.endsAt,
    );
    if (!mining) payout = 0;
    if (!dockChanged && payout <= 0) return client;
    changed = true;
    return {
      ...client,
      contracts,
      balanceUsd: mining ? client.balanceUsd + payout : client.balanceUsd,
    };
  });
  return { clients, changed };
}

function applySettled(prev: State, clients: Client[]): State {
  const live = prev.user
    ? clients.find((c) => c.email === prev.user!.email)
    : undefined;
  return {
    ...prev,
    clients,
    pausedDockIds: collectPausedIds(clients, prev.pausedDockIds),
    contracts: live?.contracts ?? prev.contracts,
    balanceUsd: live?.balanceUsd ?? prev.balanceUsd,
  };
}

function emptySession() {
  return {
    user: null as User | null,
    balanceUsd: 0,
    contracts: [] as Contract[],
    txs: [] as Tx[],
    referralCode: "VOLT-BAY-7K2",
  };
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      const clients = parsed.clients ?? [];
      return {
        ...parsed,
        withdrawals: parsed.withdrawals ?? [],
        pausedDockIds: collectPausedIds(clients, parsed.pausedDockIds ?? []),
      };
    }
  } catch {
    /* ignore */
  }
  return {
    ...emptySession(),
    admin: false,
    clients: seedClients(),
    tickets: seedTickets(),
    withdrawals: [],
    pausedDockIds: [],
  };
}

function snapshotClient(state: State): Client[] {
  if (!state.user) return state.clients;
  const existing = state.clients.find((c) => c.email === state.user!.email);
  const paused = new Set(state.pausedDockIds ?? []);
  const contracts = state.contracts.map((dock) => {
    const prior = existing?.contracts.find((x) => x.id === dock.id);
    return {
      ...dock,
      paused: Boolean(dock.paused || prior?.paused || paused.has(dock.id)),
    };
  });
  const snap: Client = {
    id: existing?.id || uid("cli"),
    name: state.user.name,
    email: state.user.email,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    phone: state.user.phone,
    country: state.user.country,
    address: existing?.address,
    profileVerified: existing?.profileVerified,
    balanceUsd: state.balanceUsd,
    contracts,
    txs: state.txs,
    referralCode: state.referralCode,
    joinedAt: existing?.joinedAt || Date.now(),
  };
  const exists = state.clients.some((c) => c.email === snap.email);
  return exists
    ? state.clients.map((c) => (c.email === snap.email ? snap : c))
    : [snap, ...state.clients];
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() =>
    typeof window === "undefined" ? load() : load(),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const tick = () => {
      setState((prev) => {
        const pausedDockIds = collectPausedIds(prev.clients, prev.pausedDockIds ?? []);
        const { clients, changed } = settleClients(
          prev.clients,
          Date.now(),
          pausedDockIds,
        );
        if (!changed) {
          if (pausedDockIds.length === (prev.pausedDockIds ?? []).length) return prev;
          return { ...prev, pausedDockIds };
        }
        return applySettled({ ...prev, pausedDockIds }, clients);
      });
    };
    tick();
    const id = window.setInterval(tick, 2000);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as State;
        setState({
          ...parsed,
          withdrawals: parsed.withdrawals ?? [],
          pausedDockIds: collectPausedIds(
            parsed.clients ?? [],
            parsed.pausedDockIds ?? [],
          ),
        });
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = useCallback((email: string, name?: string, profile?: Profile) => {
    const normalized = email.trim().toLowerCase();
    if (normalized === ADMIN_EMAIL) {
      return { ok: false, error: "Hall ops use the admin door." };
    }
    setState((prev) => {
      const snapped = snapshotClient(prev);
      const { clients: saved } = settleClients(
        snapped,
        Date.now(),
        collectPausedIds(snapped, prev.pausedDockIds ?? []),
      );
      const existing = saved.find((c) => c.email.toLowerCase() === normalized);
      if (existing) {
        return {
          ...prev,
          clients: saved,
          pausedDockIds: collectPausedIds(saved, prev.pausedDockIds ?? []),
          user: {
            name: existing.name,
            email: existing.email,
            firstName: existing.firstName,
            lastName: existing.lastName,
            phone: existing.phone,
            country: existing.country,
          },
          balanceUsd: existing.balanceUsd,
          contracts: existing.contracts,
          txs: existing.txs,
          referralCode: existing.referralCode,
        };
      }
      const fresh: Client = {
        id: uid("cli"),
        name: name || normalized.split("@")[0],
        email: normalized,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        phone: profile?.phone,
        country: profile?.country,
        balanceUsd: 0,
        contracts: [],
        txs: [],
        referralCode: `VOLT-${normalized.slice(0, 3).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
        joinedAt: Date.now(),
      };
      return {
        ...prev,
        clients: [fresh, ...saved],
        user: {
          name: fresh.name,
          email: fresh.email,
          firstName: fresh.firstName,
          lastName: fresh.lastName,
          phone: fresh.phone,
          country: fresh.country,
        },
        balanceUsd: 0,
        contracts: [],
        txs: [],
        referralCode: fresh.referralCode,
      };
    });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setState((prev) => {
      const snapped = snapshotClient(prev);
      const { clients } = settleClients(
        snapped,
        Date.now(),
        collectPausedIds(snapped, prev.pausedDockIds ?? []),
      );
      return { ...prev, ...emptySession(), clients };
    });
  }, []);

  const adminLogin = useCallback((email: string, password: string) => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      setState((prev) => ({ ...prev, admin: true }));
      return { ok: true };
    }
    return { ok: false, error: "Hall ops credentials were rejected." };
  }, []);

  const adminLogout = useCallback(() => {
    setState((prev) => ({ ...prev, admin: false }));
  }, []);

  const deposit = useCallback((amount: number) => {
    setState((prev) => {
      const next = {
        ...prev,
        balanceUsd: prev.balanceUsd + amount,
        txs: [makeTx("deposit", "Bay wallet top-up", amount), ...prev.txs].slice(
          0,
          40,
        ),
      };
      return { ...next, clients: snapshotClient(next) };
    });
  }, []);

  const withdraw = useCallback((amount: number, address?: string) => {
    let ok = false;
    setState((prev) => {
      if (amount < 20 || amount > prev.balanceUsd) return prev;
      ok = true;
      const dest = address?.trim();
      const label = dest
        ? `Withdraw to ${dest}`
        : "Withdraw to external wallet";
      const request: Withdrawal = {
        id: uid("wth"),
        email: prev.user?.email ?? "",
        wallet: dest || "—",
        amountUsd: amount,
        at: Date.now(),
        status: "pending",
      };
      const next = {
        ...prev,
        balanceUsd: prev.balanceUsd - amount,
        txs: [makeTx("withdraw", label, -amount), ...prev.txs].slice(0, 40),
        withdrawals: [request, ...(prev.withdrawals ?? [])].slice(0, 100),
      };
      return { ...next, clients: snapshotClient(next) };
    });
    return ok;
  }, []);

  const buyPlan = useCallback((plan: Plan) => {
    let result: { ok: boolean; error?: string } = { ok: false, error: "Unknown" };
    setState((prev) => {
      if (!prev.user) {
        result = { ok: false, error: "Sign in to dock a contract." };
        return prev;
      }
      const total = planDockTotal(plan);
      if (prev.balanceUsd < total) {
        result = { ok: false, error: "Insufficient bay balance. Top up the wallet first." };
        return prev;
      }
      const now = Date.now();
      result = { ok: true };
      const next = {
        ...prev,
        balanceUsd: prev.balanceUsd - total,
        contracts: [
          {
            id: uid("ctr"),
            planId: plan.id,
            startedAt: now,
            endsAt: now + plan.days * 86_400_000,
            earnedUsd: 0,
            active: true,
            paused: false,
            lastMinedAt: now,
          },
          ...prev.contracts,
        ],
        txs: [
          makeTx(
            "contract",
            `${plan.name} · ${plan.hashrate} ${plan.unit} ${plan.coinTicker}`,
            -total,
          ),
          ...prev.txs,
        ].slice(0, 40),
      };
      return { ...next, clients: snapshotClient(next) };
    });
    return result;
  }, []);

  const payForPlan = useCallback((plan: Plan) => {
    let result: { ok: boolean; error?: string } = { ok: false, error: "Unknown" };
    setState((prev) => {
      if (!prev.user) {
        result = { ok: false, error: "Sign in to dock a contract." };
        return prev;
      }
      const total = planDockTotal(plan);
      const shortfall = planShortfall(plan, prev.balanceUsd);
      let balanceUsd = prev.balanceUsd;
      let txs = prev.txs;
      if (shortfall > 0) {
        balanceUsd += shortfall;
        txs = [
          makeTx("deposit", "Payment gateway", shortfall),
          ...txs,
        ];
      }
      const now = Date.now();
      result = { ok: true };
      const next = {
        ...prev,
        balanceUsd: +(balanceUsd - total).toFixed(2),
        contracts: [
          {
            id: uid("ctr"),
            planId: plan.id,
            startedAt: now,
            endsAt: now + plan.days * 86_400_000,
            earnedUsd: 0,
            active: true,
            paused: false,
            lastMinedAt: now,
          },
          ...prev.contracts,
        ],
        txs: [
          makeTx(
            "contract",
            `${plan.name} · ${plan.hashrate} ${plan.unit} ${plan.coinTicker}`,
            -total,
          ),
          ...txs,
        ].slice(0, 40),
      };
      return { ...next, clients: snapshotClient(next) };
    });
    return result;
  }, []);

  const setClientBalance = useCallback((email: string, balanceUsd: number) => {
    setState((prev) => {
      const clients = prev.clients.map((c) => {
        if (c.email !== email) return c;
        const delta = balanceUsd - c.balanceUsd;
        return {
          ...c,
          balanceUsd,
          txs: [
            makeTx("adjust", "Hall ops balance edit", delta),
            ...c.txs,
          ].slice(0, 40),
        };
      });
      const live =
        prev.user?.email === email
          ? {
              balanceUsd,
              txs: [
                makeTx("adjust", "Hall ops balance edit", balanceUsd - prev.balanceUsd),
                ...prev.txs,
              ].slice(0, 40),
            }
          : {};
      return { ...prev, clients, ...live };
    });
  }, []);

  const setClientAddress = useCallback((clientId: string, address: ClientAddress) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === clientId || c.email === clientId
          ? { ...c, address, profileVerified: true }
          : c,
      ),
    }));
  }, []);

  const setDockPaused = useCallback(
    (email: string, contractId: string, paused: boolean) => {
      setState((prev) => {
        const now = Date.now();
        const pausedDockIds = paused
          ? [...new Set([...(prev.pausedDockIds ?? []), contractId])]
          : (prev.pausedDockIds ?? []).filter((id) => id !== contractId);
        const clients = prev.clients.map((c) => {
          if (c.email !== email) return c;
          let extra = 0;
          const contracts = c.contracts.map((dock) => {
            if (dock.id !== contractId || !dock.active) return dock;
            if (paused) {
              const settled = settleContract(dock, now, []);
              extra += settled.payout;
              return {
                ...settled.contract,
                paused: true,
                lastMinedAt: now,
              };
            }
            return { ...dock, paused: false, lastMinedAt: now };
          });
          return {
            ...c,
            contracts,
            balanceUsd: c.balanceUsd + extra,
          };
        });
        return applySettled({ ...prev, pausedDockIds }, clients);
      });
    },
    [],
  );

  const openTicket = useCallback((subject: string, body: string) => {
    let result: { ok: boolean; error?: string } = { ok: false };
    setState((prev) => {
      if (!prev.user) {
        result = { ok: false, error: "Sign in first." };
        return prev;
      }
      result = { ok: true };
      const ticket: Ticket = {
        id: uid("tkt"),
        email: prev.user.email,
        name: prev.user.name,
        subject,
        body,
        status: "open",
        createdAt: Date.now(),
        replies: [],
      };
      return { ...prev, tickets: [ticket, ...prev.tickets] };
    });
    return result;
  }, []);

  const replyTicket = useCallback(
    (id: string, text: string, from: "client" | "admin") => {
      setState((prev) => ({
        ...prev,
        tickets: prev.tickets.map((t) =>
          t.id === id
            ? {
                ...t,
                status: "open",
                replies: [...t.replies, { from, text, at: Date.now() }],
              }
            : t,
        ),
      }));
    },
    [],
  );

  const setTicketStatus = useCallback((id: string, status: Ticket["status"]) => {
    setState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      adminLogin,
      adminLogout,
      deposit,
      withdraw,
      buyPlan,
      payForPlan,
      setClientBalance,
      setClientAddress,
      setDockPaused,
      openTicket,
      replyTicket,
      setTicketStatus,
    }),
    [
      state,
      login,
      logout,
      adminLogin,
      adminLogout,
      deposit,
      withdraw,
      buyPlan,
      payForPlan,
      setClientBalance,
      setClientAddress,
      setDockPaused,
      openTicket,
      replyTicket,
      setTicketStatus,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
