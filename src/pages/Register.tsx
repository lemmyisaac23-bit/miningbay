import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { ADMIN_EMAIL } from "../data/admin";
import { COUNTRIES } from "../data/countries";

const field =
  "mt-2 w-full rounded-xl border border-line bg-panel px-3 py-2";

export function Register() {
  const { login, adminLogin } = useAppState();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Set password and confirm password must match.");
      return;
    }
    if (!agreed) {
      setError("Agree to the terms and conditions to continue.");
      return;
    }
    const hall = adminLogin(email, password);
    if (hall.ok) {
      navigate("/admin");
      return;
    }
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      setError("Email or password is incorrect.");
      return;
    }
    const fullName = `${firstName.trim()} ${secondName.trim()}`.trim();
    const res = login(email, fullName, {
      firstName: firstName.trim(),
      lastName: secondName.trim(),
      phone: phone.trim(),
      country,
    });
    if (!res.ok) {
      setError(res.error || "Could not create account.");
      return;
    }
    navigate("/app");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-volt">
        Create account
      </p>
      <h1 className="mt-3 font-display text-4xl">Dock your first lane.</h1>
      <p className="mt-3 text-sm text-mist">
        Create a bay account, then lease a Spark or Scrypt lane from the hall.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            First name
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={field}
              placeholder="Ada"
            />
          </label>
          <label className="block text-sm">
            Second name
            <input
              required
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              className={field}
              placeholder="Harbor"
            />
          </label>
        </div>
        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            placeholder="you@volt.bay"
          />
        </label>
        <label className="block text-sm">
          Phone number
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={field}
            placeholder="+1 555 0100"
          />
        </label>
        <label className="block text-sm">
          Country
          <select
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={field}
          >
            <option value="" disabled>
              Select country
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Set password
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm">
          Confirm password
          <input
            required
            type="password"
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={field}
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-mist">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 accent-volt"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="text-volt underline">
              terms and conditions
            </Link>{" "}
            of voltminingbay.com.
          </span>
        </label>
        {error && (
          <p className="rounded-xl border border-copper/40 bg-copper/10 px-3 py-2 text-sm">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-full bg-volt py-3 text-sm font-semibold text-foam"
        >
          Open bay account
        </button>
      </form>
      <p className="mt-4 text-sm text-mist">
        Already docked?{" "}
        <Link to="/login" className="text-volt">
          Sign in
        </Link>
      </p>
    </main>
  );
}
