import { FormEvent, useEffect, useState } from "react";
import { useAppState } from "../context/AppState";

export function AdminTickets() {
  const { tickets, replyTicket, setTicketStatus, refreshTickets } = useAppState();
  const [activeId, setActiveId] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ticket = tickets.find((t) => t.id === activeId) ?? tickets[0];

  useEffect(() => {
    void refreshTickets();
    const id = window.setInterval(() => {
      void refreshTickets();
    }, 8000);
    return () => window.clearInterval(id);
  }, [refreshTickets]);

  useEffect(() => {
    if (!activeId && tickets[0]) setActiveId(tickets[0].id);
  }, [tickets, activeId]);

  async function onReply(e: FormEvent) {
    e.preventDefault();
    if (!ticket || !reply.trim()) return;
    setBusy(true);
    setError(null);
    const res = await replyTicket(ticket.id, reply.trim(), "admin");
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "Could not send this reply.");
      return;
    }
    setReply("");
    void refreshTickets();
  }

  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
        Support
      </p>
      <h1 className="mt-2 font-display text-4xl">Tickets</h1>
      <p className="mt-3 text-mist">
        Client messages land here. Open a ticket and send a reply — they will see
        it on Support.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <ul className="divide-y divide-line rounded-2xl border border-line bg-panel/80">
          {tickets.length === 0 && (
            <li className="px-4 py-6 text-sm text-mist">
              No tickets yet. When a client writes from Support, it shows here.
            </li>
          )}
          {tickets.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  setActiveId(t.id);
                  setError(null);
                }}
                className={`block w-full px-4 py-3 text-left ${
                  ticket?.id === t.id ? "bg-raised" : ""
                }`}
              >
                <p className="font-display text-sm">{t.subject}</p>
                <p className="text-xs text-mist">
                  {t.name} · {t.status}
                </p>
              </button>
            </li>
          ))}
        </ul>
        {ticket && (
          <div className="rounded-2xl border border-line bg-panel/80 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl">{ticket.subject}</h2>
                <p className="mt-1 text-sm text-mist">
                  {ticket.name} · {ticket.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setTicketStatus(
                    ticket.id,
                    ticket.status === "open" ? "closed" : "open",
                  )
                }
                className="rounded-full border border-line px-3 py-1 text-xs"
              >
                Mark {ticket.status === "open" ? "closed" : "open"}
              </button>
            </div>
            <p className="mt-5 text-sm leading-relaxed">{ticket.body}</p>
            <div className="mt-6 space-y-3">
              {ticket.replies.map((r, i) => (
                <div
                  key={r.id ?? `${r.at}-${i}`}
                  className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-mist">
                    {r.from} · {new Date(r.at).toLocaleString()}
                  </p>
                  <p className="mt-1">{r.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={onReply} className="mt-6 space-y-3">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm"
                placeholder="Reply as hall leads"
              />
              {error && (
                <p className="rounded-xl border border-copper/40 bg-copper/10 px-3 py-2 text-sm">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy || !reply.trim()}
                className="rounded-full bg-copper px-5 py-2 text-sm font-semibold text-ink disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send reply"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
