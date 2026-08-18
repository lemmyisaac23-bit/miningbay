import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppState";

export function Terms() {
  const { user } = useAppState();
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-volt">
        voltminingbay.com
      </p>
      <h1 className="mt-3 font-display text-5xl">Terms and conditions</h1>
      <p className="mt-4 text-mist">
        These terms govern use of Volt Mining Bay hosted hashpower at
        voltminingbay.com. By creating an account you agree to them.
      </p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-mist">
        <section>
          <h2 className="font-display text-xl text-foam">1. The bay</h2>
          <p className="mt-2">
            Volt Mining Bay leases hosted ASIC, GPU, and CPU capacity. You buy a
            contract. We run power, cooling, and hall operations. Hashpower stays
            in our facilities.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-foam">2. Accounts</h2>
          <p className="mt-2">
            You must give a true first name, second name, email, phone number,
            and country. You are responsible for the password you set and for
            activity on your bay account.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-foam">3. Contracts and payouts</h2>
          <p className="mt-2">
            Daily output estimates move with network difficulty and coin price.
            A contract can return less than you put in. Payouts credit to your
            bay wallet. Withdrawals go to an address you control.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-foam">4. Risk</h2>
          <p className="mt-2">
            This is not financial advice. Only dock what you can afford to keep
            in the bay. Volt Mining Bay is not liable for market moves, network
            congestion, or third-party wallet loss.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-foam">5. Conduct</h2>
          <p className="mt-2">
            Do not abuse the hall, spoof identity, or use the platform for
            unlawful activity. We may freeze or close an account that breaks
            these terms.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-foam">6. Contact</h2>
          <p className="mt-2">
            Questions go to hall ops through your bay Support desk on
            voltminingbay.com.
          </p>
        </section>
      </div>
      {user ? (
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="mt-10 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-foam"
        >
          I agree — continue to the bay
        </button>
      ) : (
        <Link
          to="/register"
          className="mt-10 inline-flex rounded-full bg-volt px-6 py-3 text-sm font-semibold text-foam"
        >
          Back to create account
        </Link>
      )}
    </main>
  );
}
