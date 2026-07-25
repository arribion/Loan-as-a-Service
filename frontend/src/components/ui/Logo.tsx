import { cn } from "../../utils/cn";
import host_pro from "../../assets/host-pro.png"

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="grid h-9 w-9 place-items-center rounded-[0.8rem] shadow-[0_4px_10px_-2px_rgba(23,64,46,.45),inset_0_1px_0_rgba(255,255,255,.25)]">
        <img src={host_pro} alt="" className="max-w-[2em] rounded" />
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