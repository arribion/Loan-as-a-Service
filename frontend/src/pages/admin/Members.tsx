import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {

  StatusPill,
  PlanBadge,
  useToast,
} from "../../components/ui";
import useAuth from "../../hooks/useAuth";
import {
  SEED_MEMBERS,
  LOANS,
  PAYMENTS,
  kes,
  planById,
  type Member,
  type Loan,
} from "../../data/mock";
import { cn } from "../../utils/cn";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const Members = () => {
     const { user, logout, memberCap } = useAuth();
     const navigate = useNavigate();
     const { push } = useToast();
     const [added, setAdded] = useState<Member[]>([]);
     const [showAdd, setShowAdd] = useState(false);
     const [showUpgrade, setShowUpgrade] = useState(false);
     const [loans, setLoans] = useState<Loan[]>(LOANS);
     const [query, setQuery] = useState("");

     const members = useMemo(() => [...added, ...SEED_MEMBERS], [added]);
     const totalMembers = (user?.memberBase ?? 0) + added.length;
     const atCap = totalMembers >= memberCap;
     const usagePct =
       memberCap === Infinity
         ? 4
         : Math.min(100, Math.round((totalMembers / memberCap) * 100));

     const activeLoans = loans.filter(
       (l) => l.status === "Active" || l.status === "Overdue",
     );
     const bookValue = activeLoans.reduce((s, l) => s + l.balance, 0);
     const collectedMonth = PAYMENTS.reduce((s, p) => s + p.amount, 0) * 38;

     const filteredMembers = members.filter(
       (m) =>
         m.name.toLowerCase().includes(query.toLowerCase()) ||
         m.phone.includes(query),
     );

     const addMember = (name: string, phone: string) => {
       if (atCap) {
         setShowAdd(false);
         setShowUpgrade(true);
         push(
           `Member limit reached on the ${planById(user!.plan).name} plan (${memberCap}). Upgrade to add more.`,
           "warn",
         );
         return;
       }
       const m: Member = {
         id: `M-00${49 + added.length}`,
         name,
         phone,
         joined: "Today",
         savings: 0,
         activeLoans: 0,
         status: "Good",
       };
       setAdded((a) => [m, ...a]);
       setShowAdd(false);
       push(`${name} added — welcome member #${totalMembers + 1}.`);
     };

  return (
    <>
      <section>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Members
              </h2>
              <p className="text-sm text-ink/55">
                {totalMembers} enrolled · {filteredMembers.length} shown
              </p>
            </div>
            <button
              onClick={() =>
                atCap
                  ? (setShowUpgrade(true),
                    push(
                      "Member limit reached — choose a bigger plan to continue.",
                      "warn",
                    ))
                  : setShowAdd(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-4.5 py-2.5 text-sm font-bold text-ink shadow-[0_2px_0_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:bg-goldsoft">
              <Plus className="h-4 w-4" /> Add member
            </button>
          </div>

          {/* usage bar */}
          <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                Subscription usage <PlanBadge plan={user!.plan} />
              </p>
              <p className="text-sm tabular-nums text-ink/60">
                {totalMembers} / {memberCap === Infinity ? "∞" : memberCap}{" "}
                members
              </p>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/8">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  usagePct > 90
                    ? "bg-danger"
                    : usagePct > 70
                      ? "bg-gold"
                      : "bg-leaf",
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/8 bg-frost/60 text-left text-xs uppercase tracking-wider text-ink/45">
                    <th className="px-6 py-3 font-semibold">Member</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Savings
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Loans
                    </th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m, i) => (
                    <tr
                      key={m.id}
                      className={cn(
                        "border-b border-ink/5 transition last:border-0 hover:bg-mint/40",
                        i < added.length && "animate-row-in",
                      )}>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-pine text-[11px] font-bold text-gold">
                            {m.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                          <div>
                            <p className="font-semibold text-ink">{m.name}</p>
                            <p className="text-[11px] text-ink/40">{m.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-ink/60">{m.phone}</td>
                      <td className="px-4 py-3.5 text-ink/60">{m.joined}</td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-ink">
                        {kes(m.savings)}
                      </td>
                      <td className="px-4 py-3.5 text-center tabular-nums text-ink/70">
                        {m.activeLoans}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusPill status={m.status} />
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-14 text-center text-ink/45">
                        {members.length === 0
                          ? "No members yet — add your first member to get started."
                          : "No members match your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {user!.memberBase > 0 && filteredMembers.length > 0 && (
              <p className="border-t border-ink/8 px-6 py-3 text-xs text-ink/40">
                Showing {filteredMembers.length} of {totalMembers} members ·
                older records archived in ledger export.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Members