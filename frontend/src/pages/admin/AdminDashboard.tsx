import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HandCoins,
  ReceiptText,
  LogOut,
  Plus,
  X,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Search,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Crown,
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
import {
  Logo,
  StatusPill,
  PlanBadge,
  useToast,
  Field,
  inputCls,
} from "../../components/ui";
import useAuth from "../../hooks/useAuth";
import {
  SEED_MEMBERS,
  LOANS,
  PAYMENTS,
  CHART_CASHFLOW,
  CHART_PORTFOLIO,
  kes,
  PLANS,
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

type Tab = "overview" | "members" | "loans" | "payments";

const NAV: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "loans", label: "Loans", icon: HandCoins },
  { id: "payments", label: "Payments", icon: ReceiptText },
];

export default function AdminDashboard() {
  const { user, logout, memberCap, updatePlan } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();

  const [tab, setTab] = useState<Tab>("overview");
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

  const approveLoan = (id: string) => {
    setLoans((ls) =>
      ls.map((l) =>
        l.id === id ? { ...l, status: "Active", disbursed: "Today" } : l,
      ),
    );
    push(`Loan ${id} approved & disbursed via M-Pesa.`);
  };

  const doLogout = () => {
    logout();
    navigate("/");
  };

  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-frost lg:grid lg:grid-cols-[264px_1fr]">
      {/* ============ SIDEBAR ============ */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-cream/10 bg-pine text-cream lg:flex">
        <div className="border-b border-cream/10 px-6 py-5">
          <Link to="/">
            <Logo light />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                tab === n.id
                  ? "bg-gold text-ink shadow-[0_2px_0_rgba(0,0,0,.25)]"
                  : "text-cream/65 hover:bg-cream/8 hover:text-cream",
              )}>
              <n.icon className="h-4.5 w-4.5" /> {n.label}
            </button>
          ))}
        </nav>
        {/* plan usage */}
        <div className="mx-3 mb-3 rounded-xl border border-cream/10 bg-cream/5 p-4">
          <div className="flex items-center justify-between">
            <PlanBadge plan={user!.plan} />
            <span className="text-xs text-cream/50">
              {totalMembers}/{memberCap === Infinity ? "∞" : memberCap}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream/10">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                usagePct > 90
                  ? "bg-danger"
                  : usagePct > 70
                    ? "bg-gold"
                    : "bg-fern",
              )}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-cream/45">
            Members on subscription
          </p>
          {user!.plan !== "enterprise" && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold/15 py-2 text-xs font-bold text-gold transition hover:bg-gold hover:text-ink">
              <Crown className="h-3.5 w-3.5" /> Upgrade plan
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 border-t border-cream/10 px-5 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-forest font-display text-sm font-bold text-gold">
            {user!.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user!.name}</p>
            <p className="truncate text-[11px] text-cream/45">{user!.org}</p>
          </div>
          <button
            onClick={doLogout}
            title="Log out"
            className="text-cream/50 transition hover:text-gold">
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <div className="min-w-0">
        {/* topbar */}
        <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/90 backdrop-blur">
          <div className="flex items-center gap-4 px-5 py-3.5 lg:px-8">
            <div className="lg:hidden">
              <Link to="/">
                <Logo compact />
              </Link>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs text-ink/45">{user!.org} · Admin console</p>
              <h1 className="font-display text-lg font-bold capitalize text-ink">
                {tab}
              </h1>
            </div>
            <div className="relative ml-auto hidden w-64 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (tab !== "members") setTab("members");
                }}
                placeholder="Search members…"
                className="w-full rounded-lg border border-ink/10 bg-paper py-2 pl-9 pr-3 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </div>
            <button
              onClick={doLogout}
              className="ml-auto rounded-lg border border-ink/10 p-2 text-ink/55 transition hover:border-danger/30 hover:text-danger md:ml-0 lg:hidden"
              title="Log out">
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
          {/* mobile nav */}
          <div className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition",
                  tab === n.id ? "bg-pine text-cream" : "bg-ink/5 text-ink/60",
                )}>
                <n.icon className="h-3.5 w-3.5" /> {n.label}
              </button>
            ))}
          </div>
        </header>

        <main className="px-5 py-7 lg:px-8">
          {/* cap warning */}
          {atCap && (
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-amber-warn/35 bg-gold/12 px-4 py-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-warn" />
              <p className="text-sm text-ink/75">
                You've reached the <strong>{memberCap}-member limit</strong> on
                the {planById(user!.plan).name} plan. Upgrade to keep onboarding
                members.
              </p>
              <button
                onClick={() => setShowUpgrade(true)}
                className="ml-auto rounded-lg bg-pine px-3.5 py-1.5 text-xs font-bold text-cream transition hover:bg-forest">
                View plans
              </button>
            </div>
          )}

          {/* ============ OVERVIEW ============ */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    Habari, {firstName} 👋
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
                        <span className="h-2.5 w-2.5 rounded-sm bg-fern" />{" "}
                        Repaid
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

          {/* ============ MEMBERS ============ */}
          {tab === "members" && (
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
                                <p className="font-semibold text-ink">
                                  {m.name}
                                </p>
                                <p className="text-[11px] text-ink/40">
                                  {m.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-ink/60">{m.phone}</td>
                          <td className="px-4 py-3.5 text-ink/60">
                            {m.joined}
                          </td>
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
          )}

          {/* ============ LOANS ============ */}
          {tab === "loans" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">
                    Loan book
                  </h2>
                  <p className="text-sm text-ink/55">
                    {activeLoans.length} active ·{" "}
                    {loans.filter((l) => l.status === "Pending").length}{" "}
                    awaiting approval
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
                          <td className="px-4 py-3.5 text-ink/60">
                            {l.product}
                          </td>
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
          )}

          {/* ============ PAYMENTS ============ */}
          {tab === "payments" && (
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
                    push(
                      "STK push sent to all members with due instalments.",
                      "info",
                    )
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
                        <th className="px-6 py-3 text-right font-semibold">
                          Amount
                        </th>
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
          )}
        </main>
      </div>

      {/* ============ ADD MEMBER MODAL ============ */}
      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onSave={addMember}
          nextNumber={totalMembers + 1}
        />
      )}

      {/* ============ UPGRADE MODAL ============ */}
      {showUpgrade && (
        <UpgradeModal
          current={user!.plan}
          onClose={() => setShowUpgrade(false)}
          onSelect={(p) => {
            updatePlan(p);
            setShowUpgrade(false);
            push(
              `Subscription upgraded to ${planById(p).name}. New member limit: ${planById(p).memberCap === Infinity ? "unlimited" : planById(p).memberCap}.`,
            );
          }}
        />
      )}
    </div>
  );
}

/* ---------------- helpers ---------------- */
function MethodTag({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold",
        method === "M-Pesa"
          ? "bg-fern/15 text-forest"
          : method === "Bank"
            ? "bg-pine/10 text-pine"
            : "bg-ink/6 text-ink/60",
      )}>
      {method === "M-Pesa" && <Smartphone className="h-3 w-3" />} {method}
    </span>
  );
}

function AddMemberModal({
  onClose,
  onSave,
  nextNumber,
}: {
  onClose: () => void;
  onSave: (name: string, phone: string) => void;
  nextNumber: number;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) return setErr("Enter the member's full name.");
    if (!/^\+?254\d{9}$|^0\d{9}$/.test(phone.replace(/\s/g, "")))
      return setErr("Enter a valid Kenyan phone number.");
    onSave(name.trim(), phone.trim());
  };
  return (
    <div
      className="fixed inset-0 z-90 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-cream p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-ink">
            Add member #{nextNumber}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink/45 transition hover:bg-ink/5 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Full name">
            <input
              autoFocus
              className={inputCls}
              placeholder="e.g. Achieng Owino"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field
            label="Phone (M-Pesa)"
            hint="Used for STK push collections & SMS statements">
            <input
              className={inputCls}
              placeholder="07XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          {err && (
            <p className="rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-2 text-sm text-danger">
              {err}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-ink/15 py-2.5 font-semibold text-ink/60 transition hover:bg-ink/5">
              Cancel
            </button>
            <button className="flex-1 rounded-xl bg-pine py-2.5 font-bold text-cream transition hover:bg-forest">
              Add member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UpgradeModal({
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
