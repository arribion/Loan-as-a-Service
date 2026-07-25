import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { type Role } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import { planById, type PlanId } from "../data/mock";
import { cn } from "../utils/cn";

/* ---------------- Logo ---------------- */
export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="grid h-9 w-9 place-items-center rounded-[0.8rem] bg-linear-to-br from-leaf to-pine shadow-[0_4px_10px_-2px_rgba(23,64,46,.45),inset_0_1px_0_rgba(255,255,255,.25)]">
        <svg viewBox="0 0 32 32" className="h-4.5 w-4.5" fill="none" aria-hidden>
          <path d="M6 23V9l5.5 7L16 9l4.5 7L26 9v14" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && (
        <span className={cn("font-display text-[1.35rem] font-bold tracking-tight", light ? "text-cream" : "text-ink")}>
          mkopo<span className={light ? "text-gold" : "text-forest"}>os</span>
        </span>
      )}
    </span>
  );
}

/* ---------------- Scroll reveal ---------------- */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- Protected route ---------------- */
export function ProtectedRoute({ children, role }: { children: ReactNode; role: Role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/member"} replace />;
  return <>{children}</>;
}

/* ---------------- Toasts ---------------- */
type Tone = "success" | "warn" | "info";
interface Toast { id: number; msg: string; tone: Tone }
const ToastCtx = createContext<{ push: (msg: string, tone?: Tone) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (msg: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-100 flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lift backdrop-blur",
              t.tone === "success" && "border-leaf/30 bg-pine text-cream",
              t.tone === "warn" && "border-amber-warn/40 bg-[#2a1c05] text-cream",
              t.tone === "info" && "border-pine/20 bg-cream text-ink"
            )}
          >
            {t.tone === "success" && <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-fern" />}
            {t.tone === "warn" && <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />}
            {t.tone === "info" && <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-forest" />}
            <p className="text-sm leading-snug">{t.msg}</p>
            <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="ml-auto opacity-60 transition hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

/* ---------------- Pills & badges ---------------- */
export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Good: "bg-mint text-forest",
    Active: "bg-mint text-forest",
    Completed: "bg-pine/10 text-pine",
    Paid: "bg-mint text-forest",
    Watch: "bg-gold/20 text-golddeep",
    Due: "bg-gold/20 text-golddeep",
    Pending: "bg-pine/10 text-pine",
    Upcoming: "bg-ink/5 text-ink/60",
    Overdue: "bg-danger/10 text-danger",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-600", map[status] || "bg-ink/5 text-ink/60")} style={{ fontWeight: 600 }}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: PlanId }) {
  const p = planById(plan);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-2.5 py-0.5 text-xs font-700 uppercase tracking-wide text-golddeep">
      {p.name}
    </span>
  );
}

/* ---------------- Field ---------------- */
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-700 uppercase tracking-wider text-ink/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-forest focus:ring-2 focus:ring-forest/20";
