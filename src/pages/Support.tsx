import { FormEvent, useState } from "react";
import { useAppState } from "../context/AppState";

export function Support() {
  const { user, tickets, openTicket, replyTicket } = useAppState();
  const mine = tickets.filter((t) => t.email === user?.email);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [openId, setOpenId] = useState(mine[0]?.id ?? "");

  function onCreate(e: FormEvent) {
    e.preventDefault();
    const res = openTicket(subject, body);
    if (!res.ok) {
      setMsg(res.error || "Could not open ticket.");
      return;
    }
    setSubject("");
    setBody("");
    setMsg("Ticket sent to hall ops.");
  }

  const active = mine.find((t) => t.id === openId) ?? mine[0];

  return (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.22em] text-volt">
        Support
      </p>
      <h1 className="mt-2 font-display text-4xl">Talk to hall ops</h1>
      <form
        onSubmit={onCreate}
        className="mt-8 max-w-lg space-y-4 rounded-2xl border border-line bg-panel/80 p-6"
      >
        <label className="block text-sm">
          Subject
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Message
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-volt px-5 py-2 text-sm font-semibold text-foam"
        >
          Open ticket
        </button>
        {msg && <p className="text-sm text-volt">{msg}</p>}
      </form>

      {mine.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl">Your tickets</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {mine.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOpenId(t.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  active?.id === t.id ? "bg-volt text-foam" : "border border-line"
                }`}
              >
                {t.subject}
              </button>
            ))}
          </div>
          {active && (
            <div className="mt-5 rounded-2xl border border-line bg-panel/80 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-mist">
                {active.status}
              </p>
              <p className="mt-2 text-sm">{active.body}</p>
              <div className="mt-4 space-y-2">
                {active.replies.map((r, i) => (
                  <p key={`${r.at}-${i}`} className="text-sm text-mist">
                    <span className="text-volt">{r.from}:</span> {r.text}
                  </p>
                ))}
              </div>
              {active.status === "open" && (
                <form
                  className="mt-4 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!reply.trim()) return;
                    replyTicket(active.id, reply.trim(), "client");
                    setReply("");
                  }}
                >
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="flex-1 rounded-xl border border-line bg-white px-3 py-2 text-sm"
                    placeholder="Add a note"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-volt px-4 py-2 text-sm font-semibold text-foam"
                  >
                    Reply
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
