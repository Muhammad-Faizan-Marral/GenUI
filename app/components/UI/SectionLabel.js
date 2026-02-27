
export function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-violet-400">
      <span className="w-3 h-px bg-violet-500" />
      {children}
    </span>
  );
}