import { cn } from "../../utils/cn";
import { planById, type PlanId } from "../../data/mock";

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Good: "bg-mint text-forest",
    Active: "bg-mint text-forest",
    Completed: "bg-pine/10 text-pine",
    Paid: "bg-mint text-forest",
    Watch: "bg-gold/20 text-golddeep",
    Due: "bg-gold/20 text-golddeep",
    Pending: "bg-pine/10 text-pine",
    Upcoming: "bg-ink/5 text-ink/60",
    Overdue: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-600",
        map[status] || "bg-ink/5 text-ink/60",
      )}
      style={{ fontWeight: 600 }}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: PlanId }) {
  const p = planById(plan);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-2.5 py-0.5 text-xs font-700 uppercase tracking-wide text-golddeep">
      {p.name}
    </span>
  );
}