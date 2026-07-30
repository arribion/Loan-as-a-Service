import React from "react";
import { kes, PAYMENTS } from "../../data/mock";
import { Smartphone } from "lucide-react";
import MethodTag from "../../components/admin/MethodTag";

const Payments: React.FC = () => {
  // Simple push/notification fallback. Replace with your toast/notification system if available.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const push = (message: string, _type: string) => {
    // If you have a toast provider, call it here instead of alert.
    // e.g. toast[ _type ]?.(message)
    // For now use alert so the button has visible behavior.
    alert(message);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Payments
            </h2>
            <p className="text-sm text-ink/55">
              Auto-reconciled from M-Pesa, bank & cash
            </p>
          </div>

          <button
            onClick={() =>
              push("STK push sent to all members with due instalments.", "info")
            }
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-4.5 py-2.5 text-sm font-bold text-ink shadow-[0_2px_0_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:bg-goldsoft">
            <Smartphone className="h-4 w-4" /> Send STK reminders
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/8 bg-frost/60 text-left text-xs uppercase tracking-wider text-ink/45">
                  <th className="px-6 py-3 font-semibold">Receipt</th>
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Method</th>
                  <th className="px-4 py-3 font-semibold">Ref</th>
                  <th className="px-4 py-3 font-semibold">Applied to</th>
                  <th className="px-4 py-3 font-semibold">When</th>
                  <th className="px-6 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>

              <tbody>
                {PAYMENTS.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-ink/5 transition last:border-0 hover:bg-mint/40">
                    <td className="px-6 py-3.5 font-mono text-xs text-ink/60">
                      {p.id}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-ink">
                      {p.member}
                    </td>
                    <td className="px-4 py-3.5">
                      <MethodTag method={p.method} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ink/50">
                      {p.ref}
                    </td>
                    <td className="px-4 py-3.5 text-ink/60">{p.loan}</td>
                    <td className="px-4 py-3.5 text-ink/60">{p.date}</td>
                    <td className="px-6 py-3.5 text-right font-bold tabular-nums text-forest">
                      +{kes(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
