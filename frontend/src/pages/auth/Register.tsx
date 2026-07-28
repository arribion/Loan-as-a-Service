import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2, Check, Eye, EyeOff, Users } from "lucide-react";
import { useToast } from "../../components/ui/Toaster";
import Logo from "../../components/ui/Logo";
import { PLANS, kes, type PlanId } from "../../data/mock";
import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";
import { inputCls } from "../../utils/inputCls";


const COUNTIES = [
  "Nairobi",
  "Kiambu",
  "Nakuru",
  "Mombasa",
  "Kisumu",
  "Uasin Gishu",
  "Machakos",
  "Garissa",
  "Meru",
  "Kakamega",
];

export default function Register() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { register } = useAuth(); // <-- use context register
  const [params] = useSearchParams();
  const initialPlan = (
    ["lite", "growth", "enterprise"].includes(params.get("plan") || "")
      ? params.get("plan")
      : "growth"
  ) as PlanId;

  const [org, setOrg] = useState("");
  const [county, setCounty] = useState("Nairobi");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation (same as before)
    if (!org.trim() || !name.trim()) {
      return setError("Organisation and contact name are required.");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError("Enter a valid email address.");
    }
    if (!/^\+?254\d{9}$|^0\d{9}$/.test(phone.replace(/\s/g, ""))) {
      return setError("Enter a valid Kenyan phone number, e.g. 0712 345 678.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setBusy(true);

    const result = await register({
      businessName: org.trim(),
      fullName: name.trim(),
      email,
      phone,
      password,
      plan,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.error || "Registration failed");
      return;
    }

    push(`Tenant "${org.trim()}" created on the ${plan} plan. Karibu!`);
    navigate("/admin");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.15fr]">
      {/* brand panel */}
      <aside className="relative hidden overflow-hidden bg-pine p-10 text-cream lg:flex lg:flex-col">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="bg-radial-gold absolute inset-0" />
        <Link to="/" className="relative">
          <Logo light />
        </Link>
        <div className="relative my-auto">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Become a tenant
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Your own lending brand, live on Kenya's rails.
          </h2>
          <div className="mt-9 space-y-5">
            {[
              [
                "Brand your member portal",
                "Logo, colours and SMS sender ID in your name.",
              ],
              [
                "Your data, your ledger",
                "Export everything anytime — no lock-in.",
              ],
              [
                "Scale by upgrading",
                "Lite → Growth → Enterprise without migration.",
              ],
            ].map(([t, b], i) => (
              <div key={t} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/15 font-display text-sm font-bold text-gold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-sm text-cream/55">{b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-cream/40">
          14-day free trial on every plan · No card required
        </p>
      </aside>

      {/* form */}
      <main className="bg-paper px-5 py-12">
        <div className="mx-auto max-w-xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink/55 transition hover:text-forest">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Create your tenant
          </h1>
          <p className="mt-2 text-ink/55">
            One account for your organisation — you'll manage members from the
            admin console.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-8">
            {/* organisation */}
            <section className="rounded-2xl border border-ink/8 bg-cream p-6 shadow-card">
              <p className="mb-5 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-pine">
                <Building2 className="h-4 w-4 text-gold" /> Organisation
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="org">Organization</label>
                  <input
                    id="org"
                    className={inputCls}
                    placeholder="e.g. Tumaini Bora SACCO"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="county">County</label>
                  <select
                    id="county"
                    className={inputCls}
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}>
                    {COUNTIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* admin details */}
            <section className="rounded-2xl border border-ink/8 bg-cream p-6 shadow-card">
              <p className="mb-5 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-pine">
                <Users className="h-4 w-4 text-gold" /> Admin account
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name">
                    Your name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    className={inputCls}
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    className={inputCls}
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email">
                    Work Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    className={inputCls}
                    type="email"
                    placeholder="you@organisation.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      className={inputCls + " pr-11"}
                      type={show ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition hover:text-forest"
                      aria-label="Toggle password">
                      {show ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* plan */}
            <section>
              <p className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-pine">
                Choose your subscription
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {PLANS.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={cn(
                      "relative rounded-xl border-2 p-4 text-left transition hover:-translate-y-0.5",
                      plan === p.id
                        ? "border-forest bg-mint shadow-card"
                        : "border-ink/10 bg-cream hover:border-forest/40",
                    )}>
                    {plan === p.id && (
                      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-forest text-cream">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <p className="font-display text-lg font-bold text-ink">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {p.memberCap === Infinity
                        ? "Unlimited members"
                        : `Up to ${p.memberCap} members`}
                    </p>
                    <p className="mt-3 font-display text-sm font-bold text-forest">
                      {p.monthly === null ? "Custom" : `${kes(p.monthly)}/mo`}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink/45">
                You can change plans anytime from the admin console. Member
                limits apply per tenant.
              </p>
            </section>

            {error && (
              <p className="rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}

            <button
              disabled={busy}
              className="w-full rounded-xl bg-gold px-5 py-4 font-bold text-ink shadow-[0_3px_0_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:bg-goldsoft disabled:opacity-60">
              {busy
                ? "Creating tenant…"
                : `Create tenant on ${PLANS.find((p) => p.id === plan)!.name}`}
            </button>
            <p className="text-center text-sm text-ink/55">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-forest underline decoration-gold decoration-2 underline-offset-4 hover:text-pine">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
