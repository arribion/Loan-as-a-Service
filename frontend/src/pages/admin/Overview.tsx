import { useState } from "react";
import { Users, ArrowUpRight, TrendingUp, Wallet, AlertTriangle } from "lucide-react";
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


export default function Overview() {
  const { user, memberCap } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [added, setAdded] = useState<Member[]>([]);
  const [loans, setLoans] = useState<Loan[]>(LOANS);

  const totalMembers = (user?.memberBase ?? 0) + added.length;


  const activeLoans = loans.filter(
    (l) => l.status === "Active" || l.status === "Overdue",
  );
  const bookValue = activeLoans.reduce((s, l) => s + l.balance, 0);
  const collectedMonth = PAYMENTS.reduce((s, p) => s + p.amount, 0) * 38;
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Habari, {firstName}
              </h2>
              <p className="text-sm text-ink/55">
                Here's how {user!.org} is performing this week.
              </p>
            </div>
            <button
              onClick={() => setTab("loans")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-pine px-4 py-2.5 text-sm font-bold text-cream transition hover:bg-forest">
              Review pending loans <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Users,
                label: "Active members",
                value: `${totalMembers}`,
                sub:
                  memberCap === Infinity
                    ? "unlimited plan"
                    : `of ${memberCap} on ${planById(user!.plan).name}`,
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

          {/* charts */}
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="rounded-2xl border border-ink/8 bg-cream p-6 shadow-card">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    Cashflow — last 6 months
                  </h3>
                  <p className="text-xs text-ink/50">
                    Disbursed vs repaid (KES millions)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-ink/55">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-gold" />{" "}
                    Disbursed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-fern" /> Repaid
                  </span>
                </div>
              </div>
              <div className="h-64">
                <Bar
                  data={{
                    labels: CHART_CASHFLOW.labels,
                    datasets: [
                      {
                        label: "Disbursed",
                        data: CHART_CASHFLOW.disbursed,
                        backgroundColor: "#A8E84B",
                        borderRadius: 6,
                        maxBarThickness: 26,
                      },
                      {
                        label: "Repaid",
                        data: CHART_CASHFLOW.repaid,
                        backgroundColor: "#2FB380",
                        borderRadius: 6,
                        maxBarThickness: 26,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: "#06170f99" },
                      },
                      y: {
                        grid: { color: "#06170f0d" },
                        ticks: {
                          color: "#06170f80",
                          callback: (v) => `${v}M`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-ink/8 bg-cream p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-ink">
                Portfolio mix
              </h3>
              <p className="text-xs text-ink/50">By loan product</p>
              <div className="mx-auto mt-4 h-52 max-w-60">
                <Doughnut
                  data={{
                    labels: CHART_PORTFOLIO.labels,
                    datasets: [
                      {
                        data: CHART_PORTFOLIO.values,
                        backgroundColor: [
                          "#1E5A40",
                          "#A8E84B",
                          "#2F9E68",
                          "#17402E",
                          "#BEF26F",
                        ],
                        borderWidth: 3,
                        borderColor: "#fbfaf4",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "62%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          boxWidth: 10,
                          boxHeight: 10,
                          padding: 12,
                          color: "#06170fcc",
                          font: { size: 11 },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* recent payments */}
          <div className="rounded-2xl border border-ink/8 bg-cream shadow-card">
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-4">
              <h3 className="font-display text-lg font-bold text-ink">
                Latest collections
              </h3>
              <button
                onClick={() => setTab("payments")}
                className="text-sm font-bold text-forest transition hover:text-pine">
                View all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/8 text-left text-xs uppercase tracking-wider text-ink/45">
                    <th className="px-6 py-3 font-semibold">Member</th>
                    <th className="px-4 py-3 font-semibold">Method</th>
                    <th className="px-4 py-3 font-semibold">Ref</th>
                    <th className="px-6 py-3 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENTS.slice(0, 4).map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-ink/5 transition last:border-0 hover:bg-mint/40">
                      <td className="px-6 py-3.5 font-semibold text-ink">
                        {p.member}
                      </td>
                      <td className="px-4 py-3.5">
                        <MethodTag method={p.method} />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-ink/50">
                        {p.ref}
                      </td>
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
      )}
    </>
  );
}