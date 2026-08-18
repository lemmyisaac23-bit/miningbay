export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-volt text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M13.2 2 4 13.4h6.4L8.6 22 20 10.3h-6.6L13.2 2z" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="font-display block text-[15px] font-bold tracking-tight text-ink">
            VOLT
          </span>
          <span className="block text-[10px] uppercase tracking-[0.22em] text-mist">
            Mining Bay
          </span>
        </span>
      )}
    </span>
  );
}
