import { FormEvent, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../context/AppState";

const field =
  "mt-2 w-full rounded-xl border border-white/15 bg-[#1a2233] px-3 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#f5b942]";

export function ClientAddress() {
  const { clientId } = useParams();
  const { clients, setClientAddress } = useAppState();
  const navigate = useNavigate();
  const client = clients.find((c) => c.id === clientId);

  const [line, setLine] = useState(client?.address?.line ?? "");
  const [state, setState] = useState(client?.address?.state ?? "");
  const [zip, setZip] = useState(client?.address?.zip ?? "");
  const [city, setCity] = useState(client?.address?.city ?? "");

  if (!client) {
    return <Navigate to="/admin" replace />;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!client) return;
    setClientAddress(client.id, {
      line: line.trim(),
      state: state.trim(),
      zip: zip.trim(),
      city: city.trim(),
    });
    navigate("/admin");
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
        Clients
      </p>
      <h1 className="mt-2 font-display text-3xl">{client.name}</h1>
      <p className="mt-2 text-sm text-mist">Enter the billing address, then submit.</p>
      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-2xl bg-[#121721] p-6 text-white"
      >
        <label className="block text-sm text-white/70">
          Address
          <input
            required
            value={line}
            onChange={(e) => setLine(e.target.value)}
            placeholder="Address"
            className={field}
          />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block text-sm text-white/70">
            State
            <input
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className={field}
            />
          </label>
          <label className="block text-sm text-white/70">
            Zip Code
            <input
              required
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Zip Code"
              className={field}
            />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block text-sm text-white/70">
            City
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={field}
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-[#f5b942] py-3 text-sm font-bold text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
