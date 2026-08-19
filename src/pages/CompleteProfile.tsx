import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";

const field =
  "mt-2 w-full rounded-xl border border-white/15 bg-[#1a2233] px-3 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#f5b942]";

export function CompleteProfile() {
  const { user, clients, setClientAddress } = useAppState();
  const navigate = useNavigate();
  const me = clients.find((c) => c.email === user?.email);

  const [line, setLine] = useState(me?.address?.line ?? "");
  const [region, setRegion] = useState(me?.address?.state ?? "");
  const [zip, setZip] = useState(me?.address?.zip ?? "");
  const [city, setCity] = useState(me?.address?.city ?? "");

  if (!user || !me) {
    return <Navigate to="/login" replace />;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!me) return;
    setClientAddress(me.id, {
      line: line.trim(),
      state: region.trim(),
      zip: zip.trim(),
      city: city.trim(),
    });
    navigate("/app");
  }

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl bg-[#121721] p-6 text-white"
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
              value={region}
              onChange={(e) => setRegion(e.target.value)}
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
