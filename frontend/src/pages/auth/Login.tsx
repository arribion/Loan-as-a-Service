import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { useToast } from "../../components/ui/Toaster";
import Logo from "../../components/ui/Logo";
import useAuth from "../../hooks/useAuth";
import { inputCls } from "../../utils/inputCls";

export default function Login() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e?: FormEvent, em = email, pw = password) => {
    e?.preventDefault();
    setError(null);
    if (!em || !pw) return setError("Enter your email and password.");
    setBusy(true);

    const result = await login(em, pw);
    setBusy(false);

    if (!result.ok) {
      setError(result.error || "Login failed");
      return;
    }

    const user = result.user!;
    push(`Karibu back! Signed in as ${user.name}.`);
    // Navigate based on role
    if (user.role === "admin" || user.role === "loan_officer") {
      navigate("/admin");
    } else {
      navigate("/member");
    }
  };

  const fillDemo = (role: "admin" | "member") => {
    const em =
      role === "admin" ? "admin@barakachama.co.ke" : "member@barakachama.co.ke";
    const pw = role === "admin" ? "admin123" : "member123";
    setEmail(em);
    setPassword(pw);
    submit(undefined, em, pw);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* brand panel */}
      <aside className="relative hidden overflow-hidden bg-pine p-10 text-cream lg:flex lg:flex-col">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="bg-radial-gold absolute inset-0" />
        <Link to="/" className="relative">
          <Logo light />
        </Link>
        <div className="relative my-auto max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Your loan book, always reconciled.
          </h2>
          <ul className="mt-8 space-y-4 text-cream/70">
            <li className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-gold" /> M-Pesa STK
              collections post themselves to the ledger
            </li>
            <li className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gold" /> Member self-service
              portals on every plan
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-gold" /> Role-based access
              for admin, credit & teller staff
            </li>
          </ul>
        </div>
        <p className="relative text-xs text-cream/40">
          Demo tenant: Baraka Chama · Lite plan · 48/50 members
        </p>
      </aside>

      {/* form panel */}
      <main className="flex items-center justify-center bg-paper px-5 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink/55 transition hover:text-forest">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Log in to your tenant
          </h1>
          <p className="mt-2 text-ink/55">
            Admin and member portals live behind one door.
          </p>

          {/* demo buttons */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              onClick={() => fillDemo("admin")}
              className="group rounded-xl border-2 border-pine bg-pine px-4 py-3 text-left text-cream transition hover:-translate-y-0.5 hover:shadow-lift">
              <KeyRound className="mb-2 h-4 w-4 text-gold" />
              <p className="text-sm font-bold">Demo Admin</p>
              <p className="text-[11px] text-cream/60">Manage Baraka Chama</p>
            </button>
            <button
              onClick={() => fillDemo("member")}
              className="group rounded-xl border-2 border-ink/12 bg-cream px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-forest/40 hover:shadow-lift">
              <Users className="mb-2 h-4 w-4 text-forest" />
              <p className="text-sm font-bold text-ink">Demo Member</p>
              <p className="text-[11px] text-ink/50">Borrower portal</p>
            </button>
          </div>

          <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-ink/35">
            <span className="h-px flex-1 bg-ink/10" /> or with email{" "}
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className={inputCls}
                type="email"
                placeholder="you@organisation.co.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  className={inputCls + " pr-11"}
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
            {error && (
              <p className="rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="w-full rounded-xl bg-gold px-5 py-3.5 font-bold text-ink shadow-[0_3px_0_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:bg-goldsoft disabled:opacity-60">
              {busy ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-ink/55">
            New to MkopoOS?{" "}
            <Link
              to="/register"
              className="font-bold text-forest underline decoration-gold decoration-2 underline-offset-4 transition hover:text-pine">
              Create a tenant account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}