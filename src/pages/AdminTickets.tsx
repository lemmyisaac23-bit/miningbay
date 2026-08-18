import { FormEvent, useState } from "react";
import { useAppState } from "../context/AppState";

export function AdminTickets() {
  const { tickets, replyTicket, setTicketStatus } = useAppState();
  const [activeId, setActiveId] = useState(tickets[0]?.id ?? "");
  const [reply, setReply] = useState("");
  const ticket = tickets.find((t) => t.id === activeId) ?? tickets[0];

  function onReply(e: FormEvent) {
    e.preventDefault();
    if (!ticket || !reply.trim()) return;
    replyTicket(ticket.id, reply.trim(), "admin");
    setReply("");
  }

  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
        Support
      </p>
      <h1 className="mt-2 font-display text-4xl">Tickets</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <ul className="divide-y divide-line rounded-2xl border border-line bg-panel/80">
          {tickets.length === 0 && (
            <li className="px-4 py-6 text-sm text-mist">No tickets yet.</li>
          )}
          {tickets.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setActiveId(t.id)}
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
                  key={`${r.at}-${i}`}
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
                placeholder="Reply as hall ops"
              />
              <button
                type="submit"
                className="rounded-full bg-copper px-5 py-2 text-sm font-semibold text-ink"
              >
                Send reply
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
