

export function UpgradeModal({
  current,
  onClose,
  onSelect,
}: {
  current: string;
  onClose: () => void;
  onSelect: (p: (typeof PLANS)[number]["id"]) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-90 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl bg-cream p-7 shadow-lift"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-golddeep">
              <Sparkles className="h-3 w-3" /> Upgrade
            </p>
            <h3 className="font-display text-2xl font-bold text-ink">
              Grow your member limit
            </h3>
            <p className="mt-1 text-sm text-ink/55">
              You're on <strong className="capitalize">{current}</strong>.
              Switch plans instantly — billing is prorated.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink/45 transition hover:bg-ink/5 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex flex-col rounded-xl border-2 p-4",
                p.id === current
                  ? "border-ink/10 bg-ink/4 opacity-60"
                  : "border-ink/10 bg-paper",
              )}>
              <p className="font-display text-lg font-bold text-ink">
                {p.name}
              </p>
              <p className="text-xs text-ink/50">
                {p.memberCap === Infinity
                  ? "Unlimited members"
                  : `Up to ${p.memberCap} members`}
              </p>
              <p className="mt-2 font-display text-sm font-bold text-forest">
                {p.monthly === null ? "Custom" : `${kes(p.monthly)}/mo`}
              </p>
              {p.id === current ? (
                <span className="mt-4 rounded-lg bg-ink/8 py-2 text-center text-xs font-bold text-ink/50">
                  Current plan
                </span>
              ) : (
                <button
                  onClick={() => onSelect(p.id)}
                  className={cn(
                    "mt-4 rounded-lg py-2 text-xs font-bold transition",
                    p.highlight
                      ? "bg-gold text-ink hover:bg-goldsoft"
                      : "bg-pine text-cream hover:bg-forest",
                  )}>
                  Switch to {p.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
