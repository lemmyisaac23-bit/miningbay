import { OwnDockCard } from "../components/OwnDockCard";
import { OWN_DOCKS } from "../data/ownDocks";

export function OwnADock() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-volt">
        Own a dock
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">
        Buy a hall dock
      </h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {OWN_DOCKS.map((dock) => (
          <OwnDockCard key={dock.id} dock={dock} />
        ))}
      </div>
    </div>
  );
}
