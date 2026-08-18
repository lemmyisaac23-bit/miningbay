export function BayBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-page">
      <div className="absolute inset-0 bg-panel" />
      <div className="absolute inset-0 hex-bay" />
      <div className="absolute inset-0 grid-bay opacity-40" />
      <div className="bay-drift absolute -left-24 top-[-10%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(52,120,248,0.16)_0%,transparent_68%)]" />
      <div className="bay-pulse absolute right-[-12%] top-[18%] h-[48vh] w-[48vh] rounded-full bg-[radial-gradient(circle,rgba(107,151,255,0.14)_0%,transparent_70%)]" />
    </div>
  );
}
