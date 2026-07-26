import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Search,
  TrendingUp,
  PieChart,
  BarChart3,
  Wallet,
  Users,
  HandCoins,
  ReceiptText,
  LayoutDashboard,
  Settings,
  Globe2,
  Code2,
  Sparkles,
  Plus,
  Smartphone,
  Zap,
  Send,
} from "lucide-react";
import { Reveal } from "../components/ui/ScrollReveal";
import { cn } from "../utils/cn";
import Pricing from "../components/Pricing";
import { TESTIMONIALS, LANDER_NAMES } from "../data/mock";
import Subscribe from "../components/Subscribe";

import host_pro from "../assets/host-pro.png"
import christian from "../assets/christian.jpg"

const TEAM = [
  { img: host_pro, name: "Morris", role: "CEO & Co-Founder" },
  { img: host_pro, name: "Christian", role: "CTO & Co-Founder" },
  {
    img: host_pro,
    name: "Kevin",
    role: "Head of Partnerships",
  },
];

const FEATURES = [
  {
    t: "Real-Time M-Pesa Reconciliation",
    b: "Every STK payment posts itself to the right member and the right loan the second it lands. No more Friday-night spreadsheet marathons for your treasurer.",
  },
  {
    t: "Member Self-Service Portals",
    b: "Members check balances, request loans and pay instalments from their phone — in Swahili or English — without calling your office.",
  },
  {
    t: "Built-In Credit Scoring",
    b: "Score every borrower from repayment history, savings depth and guarantor strength before a single shilling is disbursed.",
  },
  {
    t: "SASRA-Ready Reporting",
    b: "PAR, liquidity and dividend reports export in exactly the format Kenyan regulators expect.",
  },
];

const FAQS = [
  {
    q: "How long is the free trial?",
    a: "14 days with full access to every feature on your chosen plan — no credit card required. Your data stays intact if you subscribe afterwards.",
  },
  {
    q: "What happens when I hit my member limit?",
    a: "We'll never lock you out. You'll see a friendly prompt to upgrade, and existing members keep working normally until you do.",
  },
  {
    q: "Can I change my subscription later?",
    a: "Yes — upgrade or downgrade anytime from the admin console. Billing is prorated to the day and member limits update instantly.",
  },
  {
    q: "Is our data secure?",
    a: "All data is encrypted in transit and at rest, hosted in-region, and handled in line with Kenya's Data Protection Act (2019). You can export your full ledger at any time.",
  },
  {
    q: "Do you integrate with M-Pesa Daraja?",
    a: "Natively. STK Push for collections, C2B paybills and automatic reconciliation are included on every plan — Lite through Enterprise.",
  },
];

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-cream px-4 py-1.5 text-sm font-semibold text-ink shadow-card">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-gold">
        <Zap className="h-3 w-3 text-pine" />
      </span>
      {children}
    </span>
  );
}

/* ---------------- floating product mock ---------------- */
function ProductMock() {
  const bars = [42, 58, 46, 70, 62, 88, 76];
  return (
    <div className="relative">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gold/25 blur-3xl" />
      <div className="flex overflow-hidden rounded-2xl border border-ink/6 bg-cream shadow-lift">
        {/* icon rail */}
        <div className="flex w-13 flex-col items-center gap-2 border-r border-ink/6 py-4">
          {[LayoutDashboard, Users, HandCoins, ReceiptText, Settings].map(
            (I, i) => (
              <span
                key={i}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-xl transition",
                  i === 0
                    ? "bg-gold text-pine"
                    : "text-ink/35 hover:bg-mint hover:text-forest",
                )}>
                <I className="h-4.5 w-4.5" />
              </span>
            ),
          )}
        </div>
        {/* content */}
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-ink/40">
                Admin console
              </p>
              <p className="font-display text-base font-bold text-ink">
                Baraka Chama
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold text-forest">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-fern" />{" "}
              Live
            </span>
          </div>
          {/* notification bubble */}
          <div className="mt-4 ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-mint px-4 py-2.5 text-xs leading-relaxed text-forest shadow-card">
            <strong>KES 4,500</strong> received from Wanjiku K. via M-Pesa —
            auto-posted to loan LN-2201 ✓
          </div>
          {/* mini chart */}
          <div className="mt-5 rounded-xl border border-ink/6 bg-frost p-4">
            <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-ink/45">
              <span>Collections this week</span>
              <span className="text-forest">+18%</span>
            </div>
            <div className="flex h-20 items-end gap-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-linear-to-t from-forest to-leaf transition-all duration-500 hover:from-golddeep hover:to-gold"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          {/* input */}
          <div className="mt-4 flex items-center gap-2 rounded-full border border-ink/8 bg-paper px-4 py-2">
            <span className="flex-1 text-xs text-ink/35">
              Ask about your loan book…
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-pine text-cream">
              <Send className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
      {/* floating chips */}
      <div className="animate-float-slow absolute -right-5 -top-6 rounded-xl border border-ink/6 bg-cream px-4 py-3 shadow-lift">
        <p className="text-[10px] uppercase tracking-wider text-ink/45">
          Repayment rate
        </p>
        <p className="flex items-center gap-1.5 font-display text-lg font-bold text-ink">
          96.4% <TrendingUp className="h-4 w-4 text-forest" />
        </p>
      </div>
      <div
        className="animate-float-slow absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl border border-ink/6 bg-pine px-4 py-2.5 text-cream shadow-lift"
        style={{ animationDelay: "1.2s" }}>
        <Smartphone className="h-4 w-4 text-gold" />
        <span className="text-xs font-semibold">M-Pesa connected</span>
      </div>
    </div>
  );
}

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-paper">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="bg-blob-soft absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pt-16">
          <div>
            <span className="mb-7 inline-grid h-16 w-16 place-items-center rounded-[1.15rem] bg-linear-to-br from-leaf to-pine shadow-[0_10px_24px_-6px_rgba(23,64,46,.5),inset_0_1px_0_rgba(255,255,255,.3)]">
              <img src={host_pro} alt="" className="max-w-[4em] rounded-2xl" />
            </span>
            <h1 className="font-display text-[2.7rem] font-bold leading-[1.04] tracking-tight text-ink sm:text-6xl">
              Unlock Your Loan Book's Potential
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/60">
              Automate member management, disbursements and M-Pesa collections
              in real time — all on one powerful platform built for Kenyan
              lenders.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-ink shadow-[0_6px_18px_-6px_rgba(85,130,15,.55)] transition hover:-translate-y-0.5 hover:bg-goldsoft">
                Get 14-Day Free Trial{" "}
                <ArrowRight className="h-4.5 w-4.5 transition group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink/12 bg-cream px-6 py-3 font-bold text-ink transition hover:border-forest hover:text-forest">
                Book A Demo <Sparkles className="h-4 w-4 text-forest" />
              </button>
            </div>
            <ul className="mt-9 space-y-3">
              {[
                "Real-time M-Pesa reconciliation",
                "Member self-service portals",
                "SASRA-ready reporting",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-[15px] font-medium text-ink/70">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold">
                    <Check className="h-3 w-3 text-pine" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <ProductMock />
        </div>

        {/* trusted by */}
        <div className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <Reveal>
            <p className="mb-5 text-center font-display text-lg font-bold text-ink">
              Trusted by lenders across Kenya
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-2xl border border-ink/6 bg-cream px-8 py-6 shadow-card md:justify-between">
              {LANDER_NAMES.map((n) => (
                <span
                  key={n}
                  className="font-display text-sm font-bold uppercase tracking-wider text-ink/30 transition hover:text-forest">
                  {n}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal className="text-center">
          <Pill>Features</Pill>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Features That Drive Results
          </h2>
        </Reveal>
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="divide-y divide-ink/8">
              {FEATURES.map((f, i) => (
                <button
                  key={f.t}
                  onClick={() => setActiveFeature(i)}
                  className="block w-full py-5 text-left transition">
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "font-display text-sm font-bold tabular-nums",
                        activeFeature === i ? "text-forest" : "text-ink/30",
                      )}>
                      0{i + 1}.
                    </span>
                    <span
                      className={cn(
                        "font-display text-xl font-bold transition",
                        activeFeature === i ? "text-ink" : "text-ink/55",
                      )}>
                      {f.t}
                    </span>
                    <span
                      className={cn(
                        "ml-auto h-2 w-2 rounded-full transition",
                        activeFeature === i ? "bg-gold" : "bg-ink/15",
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "grid transition-all duration-500",
                      activeFeature === i
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}>
                    <div className="overflow-hidden">
                      <p className="max-w-md pt-3 pl-9 leading-relaxed text-ink/60">
                        {f.b}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative rounded-[2.5rem] border-[6px] border-pine bg-gold p-4 shadow-lift">
              <img
                src={christian}
                alt="Member using the MkopoOS mobile portal"
                className="h-105 w-full rounded-4xl object-cover"
              />
              {[
                { I: TrendingUp, cls: "-left-6 top-10" },
                { I: PieChart, cls: "-right-6 top-24" },
                { I: BarChart3, cls: "-left-6 bottom-24" },
                { I: Wallet, cls: "-right-6 bottom-10" },
              ].map(({ I, cls }, i) => (
                <span
                  key={i}
                  className={cn(
                    "animate-float-slow absolute grid h-14 w-14 place-items-center rounded-full bg-cream text-forest shadow-lift",
                    cls,
                  )}
                  style={{ animationDelay: `${i * 0.8}s` }}>
                  <I className="h-5.5 w-5.5" />
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section className="relative overflow-hidden bg-pine py-24 text-cream">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <h2 className="font-display text-4xl font-bold tracking-tight text-gold md:text-5xl">
              Why Choose CMAAS?
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Create Your Tenant",
                b: "Register your organisation, pick Lite, Growth or Enterprise and brand your member portal in minutes.",
                visual: (
                  <span className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-bold text-ink shadow-lift">
                    Sign Up For Free <Search className="h-4 w-4 text-forest" />
                  </span>
                ),
              },
              {
                t: "Onboard Your Members",
                b: "Import your existing ledger or register members on the ground with phone-based KYC capture.",
                visual: (
                  <div className="relative h-full w-full">
                    {[
                      { I: Users, c: "left-[12%] top-[18%] text-gold" },
                      { I: Globe2, c: "right-[16%] top-[10%] text-cream/70" },
                      {
                        I: BarChart3,
                        c: "left-[28%] bottom-[14%] text-cream/70",
                      },
                      { I: Code2, c: "right-[24%] bottom-[20%] text-gold" },
                      { I: PieChart, c: "left-[52%] top-[40%] text-fern" },
                    ].map(({ I, c }, i) => (
                      <I key={i} className={cn("absolute h-5 w-5", c)} />
                    ))}
                  </div>
                ),
              },
              {
                t: "Disburse & Collect",
                b: "Approve with credit scores, send via M-Pesa and watch repayments reconcile themselves.",
                visual: (
                  <div className="font-display text-5xl font-bold leading-[0.95] tracking-tighter text-cream/12">
                    <p>KES ✦ AUTO</p>
                    <p className="pl-6">RECONCILED</p>
                  </div>
                ),
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 110}>
                <div className="group h-full rounded-2xl border border-cream/10 bg-cream/4 p-6 transition hover:-translate-y-1 hover:border-gold/40 hover:bg-cream/[0.07]">
                  <div className="mb-6 grid h-36 place-items-center overflow-hidden rounded-xl bg-cream/5 p-4">
                    {c.visual}
                  </div>
                  <h3 className="font-display text-xl font-bold">{c.t}</h3>
                  <p className="mt-2 leading-relaxed text-cream/60">{c.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* ============ TESTIMONIALS ============ */}
      <section
        id="stories"
        className="relative overflow-hidden bg-pine py-24 text-cream">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-ink">
              <Sparkles className="h-3.5 w-3.5" /> Stories
            </span>
            <h2 className="mt-5 max-w-md font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              What Our Lenders Are Saying
            </h2>
            <p className="mt-3 max-w-md text-cream/60">
              From table banking groups to deposit-taking SACCOs — hear it from
              the people running their books on CMAAS.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 110}>
                <figure className="flex h-full flex-col rounded-2xl bg-cream p-6 text-ink shadow-lift transition hover:-translate-y-1">
                  <div className="mb-3 flex gap-1 text-gold">
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j} className="text-sm text-golddeep">
                        {s}
                      </span>
                    ))}
                  </div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-ink/70">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/8 pt-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-pine font-display text-xs font-bold text-gold">
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-ink/50">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TEAM ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal className="text-center">
          <Pill>Our Team</Pill>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Meet The People Behind CMAAS
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 100}>
              <div className="group overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card transition hover:-translate-y-1.5 hover:shadow-lift">
                <div className="overflow-hidden">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-60 w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-display font-bold text-ink">{m.name}</p>
                    <p className="text-xs text-ink/50">{m.role}</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
        <Reveal className="text-center">
          <Pill>Help</Pill>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Frequently Asked Questions
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div
                className={cn(
                  "overflow-hidden rounded-xl border bg-cream transition",
                  openFaq === i
                    ? "border-forest/40 shadow-card"
                    : "border-ink/8",
                )}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-semibold text-ink">{f.q}</span>
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full transition",
                      openFaq === i
                        ? "rotate-45 bg-gold text-pine"
                        : "bg-ink/5 text-ink/50",
                    )}>
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-ink/60">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Subscribe/>
    </div>
  );
}
