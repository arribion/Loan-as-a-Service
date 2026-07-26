import { useMemo, useState, type JSX } from "react";
import {
  Users,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import useAuth from "../../hooks/useAuth";
import {
  LOANS,
  PAYMENTS,
  kes,
  planById,
  type Member,
  type Loan,
  CHART_CASHFLOW,
  CHART_PORTFOLIO,
} from "../../data/mock";
import { cn } from "../../utils/cn";
import { MethodTag } from "../../components/admin/MethodTag";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

type Tab = "overview" | "members" | "loans" | "payments";

export default function Overview(): JSX.Element {
  const { user, memberCap } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const added: Member[] = [];
  const [loans, setLoans] = useState<Loan[]>(LOANS);

  const totalMembers = (user?.memberBase ?? 0) + added.length;
  const activeLoans = loans.filter(
    (l) => l.status === "Active" || l.status === "Overdue",
  );
  const bookValue = activeLoans.reduce((s, l) => s + l.balance, 0);
  const collectedMonth = PAYMENTS.reduce((s, p) => s + p.amount, 0) * 38;
  const firstName = user?.name.split(" ")[0] ?? "there";

  const cashflowData = useMemo(
    () => ({
      labels: CHART_CASHFLOW.labels,
      datasets: [
        {
          label: "Cashflow",
          data: CHART_CASHFLOW.disbursed,
          backgroundColor: "rgba(16,185,129,0.9)",
          borderRadius: 6,
        },
      ],
    }),
    [],
  );

  const cashflowOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index" as const, intersect: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "rgba(0,0,0,0.04)" } },
      },
    }),
    [],
  );

  const portfolioData = useMemo(
    () => ({
      labels: CHART_PORTFOLIO.labels,
      datasets: [
        {
          data: CHART_PORTFOLIO.values,
          backgroundColor: ["#F59E0B", "#10B981", "#EF4444", "#60A5FA"],
        },
      ],
    }),
    [],
  );

  const portfolioOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "right" as const } },
    }),
    [],
  );

  // Demo helpers
  const markLoanClosed = (id: string) =>
    setLoans((s) =>
      s.map((l) => (l.id === id ? { ...l, status: "Completed" } : l)),
    );

  return (
    <div className="space-y-6">
      {/* Header + tabs */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">
            Habari, {firstName}
          </h2>
          <p className="text-sm text-ink/55">
            Here's how {user?.org ?? "your organization"} is performing this
            week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <nav className="inline-flex rounded-lg bg-cream p-1">
            <button
              onClick={() => setTab("overview")}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-md",
                tab === "overview" ? "bg-forest/10 text-forest" : "text-ink/60",
              )}>
              Overview
            </button>
            <button
              onClick={() => setTab("members")}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-md",
                tab === "members" ? "bg-forest/10 text-forest" : "text-ink/60",
              )}>
              Members
            </button>
            <button
              onClick={() => setTab("loans")}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-md",
                tab === "loans" ? "bg-forest/10 text-forest" : "text-ink/60",
              )}>
              Loans
            </button>
            <button
              onClick={() => setTab("payments")}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold rounded-md",
                tab === "payments" ? "bg-forest/10 text-forest" : "text-ink/60",
              )}>
              Payments
            </button>
          </nav>

          <button
            onClick={() => setTab("loans")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-pine px-4 py-2.5 text-sm font-bold text-cream transition hover:bg-forest">
            Review pending loans <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Users,
                label: "Active members",
                value: `${totalMembers}`,
                sub:
                  memberCap === Infinity
                    ? "unlimited plan"
                    : `of ${memberCap} on ${user ? planById(user.plan).name : "plan"}`,
                tone: "text-forest bg-mint",
              },
              {
                icon: Wallet,
                label: "Loan book outstanding",
                value: kes(bookValue),
                sub: `${activeLoans.length} active loans`,
                tone: "text-golddeep bg-gold/15",
              },
              {
                icon: TrendingUp,
                label: "Collected this month",
                value: kes(collectedMonth),
                sub: "+12.4% vs last month",
                tone: "text-forest bg-mint",
              },
              {
                icon: AlertTriangle,
                label: "Portfolio at risk",
                value: "3.1%",
                sub: "1 loan overdue",
                tone: "text-danger bg-danger/10",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
                <span
                  className={cn(
                    "mb-4 inline-grid h-10 w-10 place-items-center rounded-xl",
                    s.tone,
                  )}>
                  <s.icon className="h-5 w-5" />
                </span>

                <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                  {s.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold tabular-nums text-ink">
                  {s.value}
                </p>
                <p className="mt-0.5 text-xs text-ink/50">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-ink/60">
                Cashflow (last 12 months)
              </h3>
              <div className="h-48">
                <Bar data={cashflowData} options={cashflowOptions} />
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-ink/60">
                Portfolio composition
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-36">
                  <Doughnut data={portfolioData} options={portfolioOptions} />
                </div>
                <div className="flex-1">
                  {CHART_PORTFOLIO.labels.map((label, i) => (
                    <div
                      key={label}
                      className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block h-3 w-3 rounded-sm"
                          style={{
                            background: (
                              portfolioData.datasets[0]
                                .backgroundColor as string[]
                            )[i],
                          }}
                        />
                        <span className="text-sm text-ink">{label}</span>
                      </div>
                      <div className="text-sm font-semibold text-ink/70">
                        {(CHART_PORTFOLIO.values[i] ?? 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-2 rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-ink/60">
                Recent payments
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink/8 text-left text-xs uppercase tracking-wider text-ink/45">
                      <th className="px-4 py-2">Receipt</th>
                      <th className="px-4 py-2">Member</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAYMENTS.slice(0, 6).map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-ink/5 last:border-0">
                        <td className="px-4 py-3 font-mono text-xs text-ink/60">
                          {p.id}
                        </td>
                        <td className="px-4 py-3 font-semibold text-ink">
                          {p.member}
                        </td>
                        <td className="px-4 py-3 text-forest font-bold">
                          +{kes(p.amount)}
                        </td>
                        <td className="px-4 py-3 text-ink/60">{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-ink/60">
                Quick actions
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setTab("members")}
                  className="rounded-md border border-ink/8 px-3 py-2 text-sm font-semibold">
                  Manage members
                </button>
                <button
                  onClick={() => setTab("loans")}
                  className="rounded-md border border-ink/8 px-3 py-2 text-sm font-semibold">
                  Review loans
                </button>
                <button
                  onClick={() => setTab("payments")}
                  className="rounded-md border border-ink/8 px-3 py-2 text-sm font-semibold">
                  View payments
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Members */}
      {tab === "members" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Members</h3>
            <div className="text-sm text-ink/60">Total: {totalMembers}</div>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-cream p-4 shadow-card">
            <p className="text-sm text-ink/60">
              This demo shows members added in this session.
            </p>
            <ul className="mt-3 space-y-2">
              {added.length === 0 ? (
                <li className="text-sm text-ink/50">
                  No members added in this session.
                </li>
              ) : (
                added.map((m) => (
                  <li
                    key={m.email}
                    className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-ink">{m.name}</div>
                      <div className="text-xs text-ink/50">{m.email}</div>
                    </div>
                    <div className="text-xs text-ink/60">{m.phone}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Loans */}
      {tab === "loans" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Loans</h3>
            <div className="text-sm text-ink/60">
              {activeLoans.length} active
            </div>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-cream p-4 shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink/45">
                  <th className="pb-2">Loan</th>
                  <th className="pb-2">Member</th>
                  <th className="pb-2">Balance</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l.id} className="border-t border-ink/6">
                    <td className="py-3 font-mono text-xs text-ink/60">
                      {l.id}
                    </td>
                    <td className="py-3 font-semibold text-ink">{l.member}</td>
                    <td className="py-3 text-ink/60">{kes(l.balance)}</td>
                    <td className="py-3 text-ink/60">{l.status}</td>
                    <td className="py-3 text-right">
                      {l.status !== "Completed" && (
                        <button
                          onClick={() => markLoanClosed(l.id)}
                          className="rounded-md bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                          Mark closed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments */}
      {tab === "payments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Payments</h3>
            <div className="text-sm text-ink/60">Recent transactions</div>
          </div>

          <div className="rounded-2xl border border-ink/8 bg-cream p-4 shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-ink/45">
                    <th className="pb-2">Receipt</th>
                    <th className="pb-2">Member</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Ref</th>
                    <th className="pb-2">Applied to</th>
                    <th className="pb-2">When</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENTS.map((p) => (
                    <tr key={p.id} className="border-t border-ink/6">
                      <td className="py-3 font-mono text-xs text-ink/60">
                        {p.id}
                      </td>
                      <td className="py-3 font-semibold text-ink">
                        {p.member}
                      </td>
                      <td className="py-3">
                        <MethodTag method={p.method} />
                      </td>
                      <td className="py-3 font-mono text-xs text-ink/50">
                        {p.ref}
                      </td>
                      <td className="py-3 text-ink/60">{p.loan}</td>
                      <td className="py-3 text-ink/60">{p.date}</td>
                      <td className="py-3 text-right font-bold tabular-nums text-forest">
                        +{kes(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
