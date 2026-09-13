import { useNavigate } from "react-router-dom";
import { dockInquirePath, type OwnDock } from "../data/ownDocks";

export function OwnDockCard({
  dock,
  compact,
}: {
  dock: OwnDock;
  compact?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <article
      className={`overflow-hidden rounded-xl border border-line bg-white ${
        compact ? "" : "flex flex-col"
      }`}
    >
      {!compact && (
        <img
          src={dock.image}
          alt={dock.alt}
          className="h-52 w-full object-cover md:h-60"
        />
      )}
      <div className={compact ? "p-2.5" : "flex flex-1 flex-col px-5 py-4"}>
        <h3
          className={`font-display font-extrabold ${
            compact ? "text-sm" : "text-2xl"
          }`}
        >
          {dock.name}
        </h3>
        <p className={`mt-1 text-mist ${compact ? "text-[11px]" : "text-sm"}`}>
          {dock.housing}
        </p>
        <button
          type="button"
          onClick={() => navigate(dockInquirePath(dock.id))}
          className={`rounded-full bg-volt font-semibold text-foam ${
            compact
              ? "mt-2 w-full px-3 py-1.5 text-xs"
              : "mt-4 px-5 py-2 text-sm"
          }`}
        >
          Buy
        </button>
      </div>
    </article>
  );
}
