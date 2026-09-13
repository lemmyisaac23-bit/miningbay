import { useNavigate } from "react-router-dom";
import { dockInquirePath, type OwnDock } from "../data/ownDocks";

export function OwnDockCard({ dock }: { dock: OwnDock }) {
  const navigate = useNavigate();

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <img
        src={dock.image}
        alt={dock.alt}
        className="h-52 w-full object-cover md:h-60"
      />
      <div className="flex flex-1 flex-col px-5 py-4">
        <h3 className="font-display text-2xl font-extrabold">{dock.name}</h3>
        <p className="mt-1 text-sm text-mist">{dock.housing}</p>
        <button
          type="button"
          onClick={() => navigate(dockInquirePath(dock.id))}
          className="mt-4 rounded-full bg-volt px-5 py-2 text-sm font-semibold text-foam"
        >
          Buy
        </button>
      </div>
    </article>
  );
}
