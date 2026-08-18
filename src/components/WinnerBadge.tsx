function Leaf({
  cx,
  cy,
  rot,
  scale = 1,
  fill,
}: {
  cx: number;
  cy: number;
  rot: number;
  scale?: number;
  fill: string;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={6.2 * scale}
      ry={15.5 * scale}
      transform={`rotate(${rot} ${cx} ${cy})`}
      fill={fill}
      stroke="#7a5a28"
      strokeWidth={0.4}
    />
  );
}

function branch(side: 1 | -1) {
  const leaves: { cx: number; cy: number; rot: number; scale: number }[] = [];
  const count = 16;
  const r = 122;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const theta = 0.22 + t * 2.72;
    const cx = 160 + side * Math.sin(theta) * r;
    const cy = 178 + Math.cos(theta) * r;
    const dx = side * Math.cos(theta);
    const dy = -Math.sin(theta);
    const rot = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    leaves.push({ cx, cy, rot, scale: 0.88 + t * 0.14 });
    if (i > 0 && i < count - 1) {
      leaves.push({
        cx: 160 + side * Math.sin(theta + 0.04) * (r - 15),
        cy: 178 + Math.cos(theta + 0.04) * (r - 15),
        rot: rot + side * 14,
        scale: 0.7 + t * 0.1,
      });
    }
  }
  return leaves;
}

function IssuerMark({ issuer }: { issuer: "gbm" | "brm" | "gbaf" }) {
  if (issuer === "gbm") {
    return (
      <div className="mt-1 flex items-end gap-[3px]">
        {[
          ["g", "h-5"],
          ["b", "h-6"],
          ["m", "h-[1.65rem]"],
        ].map(([letter, h]) => (
          <span
            key={letter}
            className={`flex ${h} w-[0.7rem] items-center justify-center rounded-[2px] bg-[#c8c8c8] text-[8px] font-bold lowercase leading-none text-[#121721]`}
          >
            {letter}
          </span>
        ))}
      </div>
    );
  }
  if (issuer === "brm") {
    return (
      <div className="relative mt-1 px-1 font-display text-[13px] font-extrabold tracking-[0.18em]">
        <span className="text-white">B</span>
        <span className="text-[#c5a059]">R</span>
        <span className="text-white">M</span>
        <span className="absolute inset-x-0 top-1/2 h-px bg-white/90" />
      </div>
    );
  }
  return (
    <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#c5a059] font-display text-[7px] font-extrabold leading-none tracking-wide text-white">
      GBAF
    </div>
  );
}

export function WinnerBadge({
  issuer,
  lines,
  year,
}: {
  issuer: "gbm" | "brm" | "gbaf";
  lines: string[];
  year: string;
}) {
  const fill = `url(#vmb-gold-${issuer}-${year})`;
  return (
    <div className="relative aspect-square w-full bg-[#121721]">
      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`vmb-gold-${issuer}-${year}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#f0e0b0" />
            <stop offset="40%" stopColor="#d4af5a" />
            <stop offset="100%" stopColor="#8d6a2e" />
          </linearGradient>
        </defs>
        {[...branch(-1), ...branch(1)].map((leaf, i) => (
          <Leaf key={i} {...leaf} fill={fill} />
        ))}
      </svg>
      <div className="absolute inset-[14%] flex flex-col items-center justify-center px-2 text-center">
        <p className="font-display text-[11px] font-extrabold tracking-[0.28em] text-[#d4af5a] sm:text-xs">
          WINNER
        </p>
        <IssuerMark issuer={issuer} />
        <p className="mt-2 font-display text-[10px] font-bold uppercase leading-[1.25] tracking-wide text-white sm:text-[11px]">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <p className="mt-2 font-display text-sm font-extrabold tracking-wide text-[#d4af5a]">
          {year}
        </p>
      </div>
    </div>
  );
}
