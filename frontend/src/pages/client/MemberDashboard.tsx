import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Smartphone, GraduationCap, PiggyBank, Gauge, CalendarClock, CheckCircle2, Loader2, ArrowDownLeft, ShieldCheck } from "lucide-react";
import { Logo, StatusPill, useToast } from "../../components/ui";
import useAuth from "../../hooks/useAuth";
import { MEMBER_INSTALMENTS, kes, type Instalment } from "../../data/mock";
import { cn } from "../../utils/cn";

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();
  const [insts, setInsts] = useState<Instalment[]>(MEMBER_INSTALMENTS);
  const [paying, setPaying] = useState<string | null>(null);

  const principal = 45000;
  const balance = insts.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0) + 0;
  const repaidPct = Math.round(((principal - balance) / principal) * 100);
  const next = insts.find((i) => i.status === "Due");
  const paidCount = insts.filter((i) => i.status === "Paid").length;

  const payViaMpesa = (id: string) => {
    setPaying(id);
    push("STK push sent to +254 712 ••• 210 — enter your M-Pesa PIN.", "info");
    setTimeout(() => {
      setInsts((list) =>
        list.map((i, idx) => {
          if (i.id === id) return { ...i, status: "Paid", paidVia: "M-Pesa • SGH" + Math.random().toString(36).slice(2, 6).toUpperCase() };
          if (i.status === "Upcoming" && idx === list.findIndex((x) => x.id === id) + 1) return { ...i, status: "Due" };
          return i;
        })
      );
      setPaying(null);
      push("Payment received. Asante! Your ledger is up to date.");
    }, 2000);
  };

  const doLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-frost">
      {/* topbar */}
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <span className="hidden rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-forest sm:inline">Member portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink/55 sm:block">{user?.org}</span>
            <button onClick={doLogout} className="inline-flex items-center gap-2 rounded-lg border border-ink/12 px-3 py-2 text-sm font-semibold text-ink/60 transition hover:border-danger/30 hover:text-danger">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {/* greeting */}
        <div className="relative overflow-hidden rounded-2xl bg-pine p-7 text-cream shadow-lift">
          <div className="bg-grid-dark absolute inset-0" />
          <div className="bg-radial-gold absolute inset-0" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-cream/55">Member M-0041 · since Jan 2024</p>
              <h1 className="mt-1 font-display text-3xl font-bold">Habari, {user?.name.split(" ")[0]} 🌿</h1>
              <p className="mt-2 max-w-md text-sm text-cream/65">Your school fees loan is {repaidPct}% repaid. Keep it up and your credit limit grows next cycle.</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-cream/12 bg-cream/6 px-4 py-3 backdrop-blur">
              <Gauge className="h-6 w-6 text-gold" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-cream/50">Credit score</p>
                <p className="font-display text-xl font-bold text-goldsoft">812 <span className="text-xs font-normal text-fern">Excellent</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* stat cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
            <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-mint text-forest"><GraduationCap className="h-5 w-5" /></span>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Active loan · School Fees</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">{kes(balance)}</p>
            <p className="text-xs text-ink/50">outstanding of {kes(principal)} · 3%/mo</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/8">
              <div className="h-full rounded-full bg-leaf transition-all duration-700" style={{ width: `${repaidPct}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-forest">{repaidPct}% repaid</p>
          </div>

          <div className={cn("rounded-2xl border p-5 shadow-card", next ? "border-gold/40 bg-gold/8" : "border-ink/8 bg-cream")}>
            <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-gold/20 text-golddeep"><CalendarClock className="h-5 w-5" /></span>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Next instalment</p>
            {next ? (
              <>
                <p className="mt-1 font-display text-2xl font-bold text-ink">{kes(next.amount)}</p>
                <p className="text-xs text-ink/50">due {next.due} · in 6 days</p>
                <button
                  onClick={() => payViaMpesa(next.id)}
                  disabled={paying !== null}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-2.5 text-sm font-bold text-cream transition hover:bg-leaf disabled:opacity-70"
                >
                  {paying === next.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
                  {paying === next.id ? "Waiting for PIN…" : "Pay with M-Pesa"}
                </button>
              </>
            ) : (
              <>
                <p className="mt-1 font-display text-2xl font-bold text-forest">All clear 🎉</p>
                <p className="text-xs text-ink/50">No payments due. You're ahead of schedule.</p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
            <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-pine/10 text-pine"><PiggyBank className="h-5 w-5" /></span>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">My savings & shares</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">{kes(86500)}</p>
            <p className="text-xs text-ink/50">earns 8% dividend p.a.</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest"><ShieldCheck className="h-3.5 w-3.5" /> FOSA account active</p>
          </div>
        </div>

        {/* schedule */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Repayment schedule</h2>
            <span className="text-sm text-ink/50">{paidCount} of {insts.length} paid</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card">
            <ul className="divide-y divide-ink/6">
              {insts.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-mint/30 sm:px-6">
                  <div className="flex w-28 items-center gap-3">
                    <span className={cn("grid h-9 w-9 place-items-center rounded-full", i.status === "Paid" ? "bg-mint text-forest" : i.status === "Due" ? "bg-gold/20 text-golddeep" : "bg-ink/5 text-ink/35")}>
                      {i.status === "Paid" ? <CheckCircle2 className="h-4.5 w-4.5" /> : <CalendarClock className="h-4.5 w-4.5" />}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{i.due}</p>
                    <p className="text-xs text-ink/45">{i.status === "Paid" ? i.paidVia : i.status === "Due" ? "Payment due now" : "Upcoming"}</p>
                  </div>
                  <p className="font-display text-lg font-bold tabular-nums text-ink">{kes(i.amount)}</p>
                  <div className="w-36 text-right">
                    {i.status === "Paid" ? (
                      <StatusPill status="Paid" />
                    ) : i.status === "Due" ? (
                      <button
                        onClick={() => payViaMpesa(i.id)}
                        disabled={paying !== null}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-1.5 text-xs font-bold text-ink transition hover:bg-goldsoft disabled:opacity-70"
                      >
                        {paying === i.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Smartphone className="h-3.5 w-3.5" />}
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

        {/* history */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-xl font-bold text-ink">Recent activity</h2>
          <div className="rounded-2xl border border-ink/8 bg-cream p-2 shadow-card">
            {[
              { icon: ArrowDownLeft, label: "Repayment received", sub: "M-Pesa · RTY5XK87", amt: "+4,500", when: "12 Apr" },
              { icon: PiggyBank, label: "Monthly savings deposit", sub: "M-Pesa · QWE9ZZ42", amt: "+6,000", when: "05 Apr" },
              { icon: ArrowDownLeft, label: "Repayment received", sub: "M-Pesa · QWE9ZZ42", amt: "+4,500", when: "12 Mar" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-frost">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint text-forest"><t.icon className="h-4 w-4" /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{t.label}</p>
                  <p className="text-xs text-ink/45">{t.sub}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums text-forest">{kes(parseInt(t.amt.replace(/[^0-9]/g, "")))}</p>
                  <p className="text-xs text-ink/40">{t.when}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink/40">Need help? Call your chama treasurer or SMS "HELP" to 40411.</p>
        </section>
      </main>
    </div>
  );
}
