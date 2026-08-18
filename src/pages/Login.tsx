import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { ADMIN_EMAIL } from "../data/admin";

export function Login() {
  const { login, adminLogin } = useAppState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const hall = adminLogin(email, password);
    if (hall.ok) {
      navigate("/admin");
      return;
    }
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      setError("Email or password is incorrect.");
      return;
    }
    const res = login(email);
    if (!res.ok) {
      setError(res.error || "Could not sign in.");
      return;
    }
    navigate("/app");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-volt">
        Sign in
      </p>
      <h1 className="mt-3 font-display text-4xl">Back to the bay.</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-panel px-3 py-2"
            placeholder="you@volt.bay"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-panel px-3 py-2"
            placeholder="••••••••"
          />
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
          Enter the hall
        </button>
      </form>
      <p className="mt-4 text-sm text-mist">
        New here?{" "}
        <Link to="/register" className="text-volt">
          Create an account
        </Link>
      </p>
    </main>
  );
}
