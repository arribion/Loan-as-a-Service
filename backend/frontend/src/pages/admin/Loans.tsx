import { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useToast } from "../../components/ui/Toaster";
import { StatusPill } from "../../components/ui/Pills&Badges";
import { LOANS, kes, type Loan } from "../../data/mock";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const Loans = () => {
      const { push } = useToast();
      const [loans, setLoans] = useState<Loan[]>(LOANS);
   
      const activeLoans = loans.filter(
        (l) => l.status === "Active" || l.status === "Overdue",
      );
    
      const approveLoan = (id: string) => {
        setLoans((ls) =>
          ls.map((l) =>
            l.id === id ? { ...l, status: "Active", disbursed: "Today" } : l,
          ),
        );
        push(`Loan ${id} approved & disbursed via M-Pesa.`);
      };
     
  return (
    <>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Loan book
              </h2>
              <p className="text-sm text-ink/55">
                {activeLoans.length} active ·{" "}
                {loans.filter((l) => l.status === "Pending").length} awaiting
                approval
              </p>
            </div>
            <button
              onClick={() =>
                push(
                  "Loan application form sent to member phones via SMS.",
                  "info",
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-pine px-4.5 py-2.5 text-sm font-bold text-cream transition hover:bg-forest">
              <Plus className="h-4 w-4" /> New loan
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/8 bg-frost/60 text-left text-xs uppercase tracking-wider text-ink/45">
                    <th className="px-6 py-3 font-semibold">Loan</th>
                    <th className="px-4 py-3 font-semibold">Member</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Principal
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Balance
                    </th>
                    <th className="px-4 py-3 font-semibold">Due</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-ink/5 transition last:border-0 hover:bg-mint/40">
                      <td className="px-6 py-3.5 font-mono text-xs text-ink/60">
                        {l.id}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-ink">
                        {l.member}
                      </td>
                      <td className="px-4 py-3.5 text-ink/60">{l.product}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-ink/70">
                        {kes(l.principal)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-ink">
                        {kes(l.balance)}
                      </td>
                      <td className="px-4 py-3.5 text-ink/60">{l.due}</td>
                      <td className="px-4 py-3.5">
                        <StatusPill status={l.status} />
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {l.status === "Pending" && (
                          <button
                            onClick={() => approveLoan(l.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-1.5 text-xs font-bold text-cream transition hover:bg-leaf">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                        )}
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
}

export default Loans