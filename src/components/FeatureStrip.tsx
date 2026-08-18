import { CircleCheck } from "lucide-react";

const ITEMS = [
  "Power and cooling included",
  "Daily payouts to your bay wallet",
  "No rigs to rack at home",
];

export function FeatureStrip() {
  return (
    <div className="rounded-xl bg-bay px-5 py-4">
      <ul className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {ITEMS.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ink">
            <CircleCheck size={18} className="shrink-0 text-[#16a34a]" strokeWidth={2.4} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
