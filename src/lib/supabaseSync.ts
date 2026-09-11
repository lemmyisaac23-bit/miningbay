import type { Session, User as AuthUser } from "@supabase/supabase-js";
import type {
  Client,
  ClientAddress,
  Contract,
  State,
  Ticket,
  TicketReply,
  Tx,
  User,
  Withdrawal,
} from "../context/AppState";
import { supabase } from "./supabase";

type ProfileRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  address_line: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  profile_verified: boolean;
  balance_usd: number | string;
  referral_code: string;
  role: "client" | "admin";
  joined_at: string;
};

type ContractRow = {
  id: string;
  user_id: string;
  plan_id: string;
  started_at: string;
  ends_at: string;
  earned_usd: number | string;
  active: boolean;
  paused: boolean;
  last_mined_at: string | null;
};

type TxRow = {
  id: string;
  user_id: string;
  type: Tx["type"];
  label: string;
  amount_usd: number | string;
  at: string;
};

type WithdrawalRow = {
  id: string;
  user_id: string;
  email: string;
  wallet: string;
  amount_usd: number | string;
  at: string;
  status: "pending";
};

type TicketRow = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  subject: string;
  body: string;
  status: "open" | "closed";
  created_at: string;
  ticket_replies?: ReplyRow[] | null;
};

type ReplyRow = {
  id: string;
  ticket_id: string;
  from_role: "client" | "admin";
  body: string;
  at: string;
};

export type HydratedBay = Pick<
  State,
  | "user"
  | "admin"
  | "balanceUsd"
  | "contracts"
  | "txs"
  | "referralCode"
  | "clients"
  | "tickets"
  | "withdrawals"
  | "pausedDockIds"
>;

function num(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function ms(value: string | null | undefined) {
  if (!value) return Date.now();
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : Date.now();
}

function iso(value: number) {
  return new Date(value).toISOString();
}

function displayName(row: ProfileRow) {
  return `${row.first_name} ${row.last_name}`.trim() || row.email.split("@")[0];
}

function addressOf(row: ProfileRow): ClientAddress | undefined {
  if (!row.address_line && !row.city && !row.state && !row.zip) return undefined;
  return {
    line: row.address_line ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    zip: row.zip ?? "",
  };
}

function contractFromRow(row: ContractRow): Contract {
  return {
    id: row.id,
    planId: row.plan_id,
    startedAt: ms(row.started_at),
    endsAt: ms(row.ends_at),
    earnedUsd: num(row.earned_usd),
    active: row.active,
    paused: row.paused,
    lastMinedAt: row.last_mined_at ? ms(row.last_mined_at) : undefined,
  };
}

function txFromRow(row: TxRow): Tx {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    amountUsd: num(row.amount_usd),
    at: ms(row.at),
  };
}

function withdrawalFromRow(row: WithdrawalRow): Withdrawal {
  return {
    id: row.id,
    email: row.email,
    wallet: row.wallet,
    amountUsd: num(row.amount_usd),
    at: ms(row.at),
    status: row.status,
  };
}

function ticketFromRow(row: TicketRow): Ticket {
  const replies: TicketReply[] = (row.ticket_replies ?? [])
    .slice()
    .sort((a, b) => ms(a.at) - ms(b.at))
    .map((r) => ({
      id: r.id,
      from: r.from_role,
      text: r.body,
      at: ms(r.at),
    }));
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    name: row.name,
    subject: row.subject,
    body: row.body,
    status: row.status,
    createdAt: ms(row.created_at),
    replies,
  };
}

function clientFrom(
  row: ProfileRow,
  contracts: Contract[],
  txs: Tx[],
): Client {
  return {
    id: row.id,
    name: displayName(row),
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    country: row.country,
    address: addressOf(row),
    profileVerified: row.profile_verified,
    balanceUsd: num(row.balance_usd),
    contracts,
    txs,
    referralCode: row.referral_code,
    joinedAt: ms(row.joined_at),
  };
}

function userFrom(row: ProfileRow): User {
  return {
    name: displayName(row),
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    country: row.country,
  };
}

function pausedIds(clients: Client[]) {
  const ids: string[] = [];
  for (const client of clients) {
    for (const dock of client.contracts) {
      if (dock.paused) ids.push(dock.id);
    }
  }
  return ids;
}

function logError(scope: string, error: { message: string } | null) {
  if (error) console.warn(`[supabase ${scope}]`, error.message);
}

async function fetchProfile(userId: string) {
  if (!supabase) return null;
  const first = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (first.data) return first.data as ProfileRow;
  await new Promise((r) => setTimeout(r, 400));
  const retry = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  logError("profile", retry.error);
  return (retry.data as ProfileRow | null) ?? null;
}

export async function ensureProfile(
  authUser: AuthUser,
  extra?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
  },
) {
  if (!supabase) return null;
  let row = await fetchProfile(authUser.id);
  if (!row) {
    const email = (authUser.email ?? "").toLowerCase();
    const insert = await supabase.from("profiles").insert({
      id: authUser.id,
      email,
      first_name: extra?.firstName ?? "",
      last_name: extra?.lastName ?? "",
      phone: extra?.phone ?? "",
      country: extra?.country ?? "",
      referral_code: `VOLT-${email.slice(0, 3).toUpperCase()}-${authUser.id
        .slice(0, 3)
        .toUpperCase()}`,
    });
    logError("insert profile", insert.error);
    row = await fetchProfile(authUser.id);
  } else if (extra) {
    const patch = await supabase
      .from("profiles")
      .update({
        first_name: extra.firstName ?? row.first_name,
        last_name: extra.lastName ?? row.last_name,
        phone: extra.phone ?? row.phone,
        country: extra.country ?? row.country,
      })
      .eq("id", authUser.id);
    logError("patch profile", patch.error);
    row = (await fetchProfile(authUser.id)) ?? row;
  }
  return row;
}

async function fetchTicketRows(): Promise<TicketRow[]> {
  if (!supabase) return [];
  const [tickets, replies] = await Promise.all([
    supabase.from("tickets").select("*").order("created_at", { ascending: false }),
    supabase.from("ticket_replies").select("*").order("at", { ascending: true }),
  ]);
  logError("tickets", tickets.error);
  logError("ticket replies", replies.error);
  const byTicket = new Map<string, ReplyRow[]>();
  for (const row of (replies.data ?? []) as ReplyRow[]) {
    const list = byTicket.get(row.ticket_id) ?? [];
    list.push(row);
    byTicket.set(row.ticket_id, list);
  }
  return ((tickets.data ?? []) as TicketRow[]).map((row) => ({
    ...row,
    ticket_replies: byTicket.get(row.id) ?? [],
  }));
}

async function loadGrouped() {
  if (!supabase) {
    return {
      profiles: [] as ProfileRow[],
      contracts: [] as ContractRow[],
      txs: [] as TxRow[],
      withdrawals: [] as WithdrawalRow[],
      tickets: [] as TicketRow[],
    };
  }
  const [profiles, contracts, txs, withdrawals, tickets] = await Promise.all([
    supabase.from("profiles").select("*").eq("role", "client"),
    supabase.from("contracts").select("*"),
    supabase.from("txs").select("*").order("at", { ascending: false }),
    supabase.from("withdrawals").select("*").order("at", { ascending: false }),
    fetchTicketRows(),
  ]);
  logError("profiles", profiles.error);
  logError("contracts", contracts.error);
  logError("txs", txs.error);
  logError("withdrawals", withdrawals.error);
  return {
    profiles: (profiles.data ?? []) as ProfileRow[],
    contracts: (contracts.data ?? []) as ContractRow[],
    txs: (txs.data ?? []) as TxRow[],
    withdrawals: (withdrawals.data ?? []) as WithdrawalRow[],
    tickets,
  };
}

function assembleClients(
  profiles: ProfileRow[],
  contracts: ContractRow[],
  txs: TxRow[],
) {
  return profiles.map((profile) =>
    clientFrom(
      profile,
      contracts.filter((c) => c.user_id === profile.id).map(contractFromRow),
      txs.filter((t) => t.user_id === profile.id).map(txFromRow),
    ),
  );
}

export async function hydrateSession(
  session: Session | null,
): Promise<HydratedBay> {
  const empty: HydratedBay = {
    user: null,
    admin: false,
    balanceUsd: 0,
    contracts: [],
    txs: [],
    referralCode: "VOLT-BAY-7K2",
    clients: [],
    tickets: [],
    withdrawals: [],
    pausedDockIds: [],
  };
  if (!supabase || !session?.user) return empty;

  const profile = await ensureProfile(session.user);
  if (!profile) return empty;

  const grouped = await loadGrouped();
  const tickets = grouped.tickets.map(ticketFromRow);
  const withdrawals = grouped.withdrawals.map(withdrawalFromRow);

  if (profile.role === "admin") {
    const clients = assembleClients(
      grouped.profiles,
      grouped.contracts,
      grouped.txs,
    );
    return {
      ...empty,
      admin: true,
      clients,
      tickets,
      withdrawals,
      pausedDockIds: pausedIds(clients),
    };
  }

  const me =
    assembleClients([profile], grouped.contracts, grouped.txs)[0] ??
    clientFrom(profile, [], []);
  return {
    user: userFrom(profile),
    admin: false,
    balanceUsd: me.balanceUsd,
    contracts: me.contracts,
    txs: me.txs,
    referralCode: me.referralCode,
    clients: [me],
    tickets: tickets.filter(
      (t) => t.email.toLowerCase() === profile.email.toLowerCase(),
    ),
    withdrawals: withdrawals.filter((w) => w.email === profile.email),
    pausedDockIds: pausedIds([me]),
  };
}

function profilePayload(client: Client) {
  return {
    id: client.id,
    email: client.email.toLowerCase(),
    first_name: client.firstName ?? "",
    last_name: client.lastName ?? "",
    phone: client.phone ?? "",
    country: client.country ?? "",
    address_line: client.address?.line ?? null,
    city: client.address?.city ?? null,
    state: client.address?.state ?? null,
    zip: client.address?.zip ?? null,
    profile_verified: Boolean(client.profileVerified),
    balance_usd: client.balanceUsd,
    referral_code: client.referralCode,
    joined_at: iso(client.joinedAt),
  };
}

function contractPayload(userId: string, dock: Contract) {
  return {
    id: dock.id,
    user_id: userId,
    plan_id: dock.planId,
    started_at: iso(dock.startedAt),
    ends_at: iso(dock.endsAt),
    earned_usd: dock.earnedUsd,
    active: dock.active,
    paused: Boolean(dock.paused),
    last_mined_at: dock.lastMinedAt ? iso(dock.lastMinedAt) : null,
  };
}

function txPayload(userId: string, tx: Tx) {
  return {
    id: tx.id,
    user_id: userId,
    type: tx.type,
    label: tx.label,
    amount_usd: tx.amountUsd,
    at: iso(tx.at),
  };
}

function withdrawalPayload(userId: string, row: Withdrawal) {
  return {
    id: row.id,
    user_id: userId,
    email: row.email,
    wallet: row.wallet,
    amount_usd: row.amountUsd,
    at: iso(row.at),
    status: row.status,
  };
}

async function persistClient(client: Client) {
  if (!supabase) return;
  const profile = await supabase
    .from("profiles")
    .upsert(profilePayload(client), { onConflict: "id" });
  logError("save profile", profile.error);

  if (client.contracts.length) {
    const docks = await supabase
      .from("contracts")
      .upsert(
        client.contracts.map((dock) => contractPayload(client.id, dock)),
        { onConflict: "id" },
      );
    logError("save contracts", docks.error);
  }

  if (client.txs.length) {
    const txs = await supabase
      .from("txs")
      .upsert(
        client.txs.map((tx) => txPayload(client.id, tx)),
        { onConflict: "id" },
      );
    logError("save txs", txs.error);
  }
}

export async function saveClientBalance(
  clientId: string,
  balanceUsd: number,
  tx: Tx,
) {
  if (!supabase) return { ok: true as const };
  const bal = await supabase
    .from("profiles")
    .update({ balance_usd: balanceUsd })
    .eq("id", clientId);
  logError("save balance", bal.error);
  if (bal.error) return { ok: false as const, error: bal.error.message };
  const savedTx = await supabase
    .from("txs")
    .upsert(txPayload(clientId, tx), { onConflict: "id" });
  logError("save balance tx", savedTx.error);
  if (savedTx.error) return { ok: false as const, error: savedTx.error.message };
  return { ok: true as const };
}

export async function fetchTickets(): Promise<Ticket[]> {
  const rows = await fetchTicketRows();
  return rows.map(ticketFromRow);
}

export async function saveTicket(ticket: Ticket, userId: string) {
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("tickets").upsert(
    {
      id: ticket.id,
      user_id: userId,
      email: ticket.email,
      name: ticket.name,
      subject: ticket.subject,
      body: ticket.body,
      status: ticket.status,
      created_at: iso(ticket.createdAt),
    },
    { onConflict: "id" },
  );
  logError("save ticket", error);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function saveTicketReply(reply: {
  id: string;
  ticketId: string;
  from: "client" | "admin";
  text: string;
  at: number;
}) {
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("ticket_replies").upsert(
    {
      id: reply.id,
      ticket_id: reply.ticketId,
      from_role: reply.from,
      body: reply.text,
      at: iso(reply.at),
    },
    { onConflict: "id" },
  );
  logError("save reply", error);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

async function persistTickets(tickets: Ticket[], userIdByEmail: Map<string, string>) {
  if (!supabase || tickets.length === 0) return;
  const rows = tickets
    .map((t) => {
      const userId = t.userId || userIdByEmail.get(t.email.toLowerCase());
      if (!userId) return null;
      return {
        id: t.id,
        user_id: userId,
        email: t.email,
        name: t.name,
        subject: t.subject,
        body: t.body,
        status: t.status,
        created_at: iso(t.createdAt),
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
  if (rows.length) {
    const saved = await supabase.from("tickets").upsert(rows, { onConflict: "id" });
    logError("save tickets", saved.error);
  }
  const replies = tickets.flatMap((t) =>
    t.replies.map((r, i) => ({
      id: r.id || `${t.id}-r${i}`,
      ticket_id: t.id,
      from_role: r.from,
      body: r.text,
      at: iso(r.at),
    })),
  );
  if (replies.length) {
    const saved = await supabase
      .from("ticket_replies")
      .upsert(replies, { onConflict: "id" });
    logError("save replies", saved.error);
  }
}

async function persistWithdrawals(
  rows: Withdrawal[],
  userIdByEmail: Map<string, string>,
) {
  if (!supabase || rows.length === 0) return;
  const payload = rows
    .map((row) => {
      const userId = userIdByEmail.get(row.email.toLowerCase());
      if (!userId) return null;
      return withdrawalPayload(userId, row);
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
  if (!payload.length) return;
  const saved = await supabase
    .from("withdrawals")
    .upsert(payload, { onConflict: "id" });
  logError("save withdrawals", saved.error);
}

export async function persistAppState(state: State) {
  if (!supabase) return;
  if (!state.user && !state.admin) return;

  const clients = state.clients;
  const userIdByEmail = new Map(
    clients.map((c) => [c.email.toLowerCase(), c.id] as const),
  );
  if (state.user) {
    const me = clients.find(
      (c) => c.email.toLowerCase() === state.user!.email.toLowerCase(),
    );
    if (me) userIdByEmail.set(me.email.toLowerCase(), me.id);
  }

  const toSave = state.admin
    ? clients
    : clients.filter(
        (c) =>
          state.user &&
          c.email.toLowerCase() === state.user.email.toLowerCase(),
      );

  await Promise.all(toSave.map((client) => persistClient(client)));
  await persistTickets(state.tickets, userIdByEmail);
  await persistWithdrawals(state.withdrawals ?? [], userIdByEmail);
}

let persistTimer: ReturnType<typeof setTimeout> | undefined;
let persistInFlight = false;
let queued: State | null = null;

export function schedulePersist(getState: () => State) {
  if (!supabase) return;
  if (persistTimer) return;
  persistTimer = window.setTimeout(() => {
    persistTimer = undefined;
    void flushPersist(getState());
  }, 3000);
}

export function persistNow(getState: () => State) {
  if (!supabase) return;
  window.clearTimeout(persistTimer);
  persistTimer = undefined;
  void flushPersist(getState());
}

async function flushPersist(state: State) {
  if (persistInFlight) {
    queued = state;
    return;
  }
  persistInFlight = true;
  try {
    await persistAppState(state);
  } catch (err) {
    console.warn("[supabase persist]", err);
  } finally {
    persistInFlight = false;
    if (queued) {
      const next = queued;
      queued = null;
      void flushPersist(next);
    }
  }
}

export function authMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return "Email or password is incorrect.";
  if (lower.includes("email not confirmed")) {
    return "Confirm your email, then sign in.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "That email already has a bay account. Sign in instead.";
  }
  return message;
}
