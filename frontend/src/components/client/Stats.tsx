import { useState } from "react";
import {
  Smartphone,
  GraduationCap,
  PiggyBank,
  CalendarClock,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "../../components/ui/Toaster";
import { MEMBER_INSTALMENTS, kes, type Instalment } from "../../data/mock";
import { cn } from "../../utils/cn";


const Stats = () => {
  const { push } = useToast();
  const [insts, setInsts] = useState<Instalment[]>(MEMBER_INSTALMENTS);
  const [paying, setPaying] = useState<string | null>(null);

  const principal = 45000;
  const balance =
    insts.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0) +
    0;
  const repaidPct = Math.round(((principal - balance) / principal) * 100);
  const next = insts.find((i) => i.status === "Due");

  const payViaMpesa = (id: string) => {
    setPaying(id);
    push("STK push sent to +254 712 ••• 210 — enter your M-Pesa PIN.", "info");
    setTimeout(() => {
      setInsts((list) =>
        list.map((i, idx) => {
          if (i.id === id)
            return {
              ...i,
              status: "Paid",
              paidVia:
                "M-Pesa • SGH" +
                Math.random().toString(36).slice(2, 6).toUpperCase(),
            };
          if (
            i.status === "Upcoming" &&
            idx === list.findIndex((x) => x.id === id) + 1
          )
            return { ...i, status: "Due" };
          return i;
        }),
      );
      setPaying(null);
      push("Payment received. Asante! Your ledger is up to date.");
    }, 2000);
  };
  return (
    <section>
      {" "}
      {/* stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
          <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-mint text-forest">
            <GraduationCap className="h-5 w-5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
            Active loan · School Fees
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {kes(balance)}
          </p>
          <p className="text-xs text-ink/50">
            outstanding of {kes(principal)} · 3%/mo
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/8">
            <div
              className="h-full rounded-full bg-leaf transition-all duration-700"
              style={{ width: `${repaidPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-semibold text-forest">
            {repaidPct}% repaid
          </p>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-5 shadow-card",
            next ? "border-gold/40 bg-gold/8" : "border-ink/8 bg-cream",
          )}>
          <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-gold/20 text-golddeep">
            <CalendarClock className="h-5 w-5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
            Next instalment
          </p>
          {next ? (
            <>
              <p className="mt-1 font-display text-2xl font-bold text-ink">
                {kes(next.amount)}
              </p>
              <p className="text-xs text-ink/50">due {next.due} · in 6 days</p>
              <button
                onClick={() => payViaMpesa(next.id)}
                disabled={paying !== null}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-2.5 text-sm font-bold text-cream transition hover:bg-leaf disabled:opacity-70">
                {paying === next.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Smartphone className="h-4 w-4" />
                )}
                {paying === next.id ? "Waiting for PIN…" : "Pay with M-Pesa"}
              </button>
            </>
          ) : (
            <>
              <p className="mt-1 font-display text-2xl font-bold text-forest">
                All clear 🎉
              </p>
              <p className="text-xs text-ink/50">
                No payments due. You're ahead of schedule.
              </p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
          <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-pine/10 text-pine">
            <PiggyBank className="h-5 w-5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
            My savings & shares
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {kes(86500)}
          </p>
          <p className="text-xs text-ink/50">earns 8% dividend p.a.</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest">
            <ShieldCheck className="h-3.5 w-3.5" /> FOSA account active
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
