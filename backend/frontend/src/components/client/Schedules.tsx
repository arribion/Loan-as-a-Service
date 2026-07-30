/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Smartphone, CalendarClock, CheckCircle2, Loader2 } from "lucide-react";
import { StatusPill } from "../../components/ui/Pills&Badges";

import { MEMBER_INSTALMENTS, kes, type Instalment } from "../../data/mock";
import { cn } from "../../utils/cn";


const Schedules = () => {
    const [insts, setInsts] = useState<Instalment[]>(MEMBER_INSTALMENTS);
    const [paying, setPaying] = useState<string | null>(null);
    const paidCount = insts.filter((i) => i.status === "Paid").length;
    
    function payViaMpesa(_id: string): void {
        throw new Error("Function not implemented.");
    }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">
          Repayment schedule
        </h2>
        <span className="text-sm text-ink/50">
          {paidCount} of {insts.length} paid
        </span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card">
        <ul className="divide-y divide-ink/6">
          {insts.map((i) => (
            <li
              key={i.id}
              className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-mint/30 sm:px-6">
              <div className="flex w-28 items-center gap-3">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full",
                    i.status === "Paid"
                      ? "bg-mint text-forest"
                      : i.status === "Due"
                        ? "bg-gold/20 text-golddeep"
                        : "bg-ink/5 text-ink/35",
                  )}>
                  {i.status === "Paid" ? (
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  ) : (
                    <CalendarClock className="h-4.5 w-4.5" />
                  )}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{i.due}</p>
                <p className="text-xs text-ink/45">
                  {i.status === "Paid"
                    ? i.paidVia
                    : i.status === "Due"
                      ? "Payment due now"
                      : "Upcoming"}
                </p>
              </div>
              <p className="font-display text-lg font-bold tabular-nums text-ink">
                {kes(i.amount)}
              </p>
              <div className="w-36 text-right">
                {i.status === "Paid" ? (
                  <StatusPill status="Paid" />
                ) : i.status === "Due" ? (
                  <button
                    onClick={() => payViaMpesa(i.id)}
                    disabled={paying !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-1.5 text-xs font-bold text-ink transition hover:bg-goldsoft disabled:opacity-70">
                    {paying === i.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Smartphone className="h-3.5 w-3.5" />
                    )}
                    {paying === i.id ? "Processing" : "Pay now"}
                  </button>
                ) : (
                  <StatusPill status="Upcoming" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Schedules;
