import { cn } from "../../utils/cn";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="grid h-9 w-9 place-items-center rounded-[0.8rem] bg-linear-to-br from-leaf to-pine shadow-[0_4px_10px_-2px_rgba(23,64,46,.45),inset_0_1px_0_rgba(255,255,255,.25)]">
        <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" fill="none" aria-hidden>
          <path d="M6 23V9l5.5 7L16 9l4.5 7L26 9v14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && (
        <span className={cn("font-display text-[1.35rem] font-bold tracking-tight", light ? "text-cream" : "text-ink")}>
          PRO-<span className={light ? "text-gold" : "text-forest"}>LAAS</span>
        </span>
      )}
    </span>
  );
}

export default Logo