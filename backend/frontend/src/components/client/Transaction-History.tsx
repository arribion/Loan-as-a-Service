import { PiggyBank, ArrowDownLeft } from "lucide-react";
import { kes,  } from "../../data/mock";

const TransactionHistory = () => {
  return (
    <section className="mt-8">
      <h2 className="mb-4 font-display text-xl font-bold text-ink">
        Recent activity
      </h2>
      <div className="rounded-2xl border border-ink/8 bg-cream p-2 shadow-card">
        {[
          {
            icon: ArrowDownLeft,
            label: "Repayment received",
            sub: "M-Pesa · RTY5XK87",
            amt: "+4,500",
            when: "12 Apr",
          },
          {
            icon: PiggyBank,
            label: "Monthly savings deposit",
            sub: "M-Pesa · QWE9ZZ42",
            amt: "+6,000",
            when: "05 Apr",
          },
          {
            icon: ArrowDownLeft,
            label: "Repayment received",
            sub: "M-Pesa · QWE9ZZ42",
            amt: "+4,500",
            when: "12 Mar",
          },
        ].map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-frost">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint text-forest">
              <t.icon className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{t.label}</p>
              <p className="text-xs text-ink/45">{t.sub}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold tabular-nums text-forest">
                {kes(parseInt(t.amt.replace(/[^0-9]/g, "")))}
              </p>
              <p className="text-xs text-ink/40">{t.when}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-ink/40">
        Need help? Call your chama treasurer or SMS "HELP" to 40411.
      </p>
    </section>
  );
};

export default TransactionHistory;
