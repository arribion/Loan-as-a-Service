import { createContext, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

type Tone = "success" | "warn" | "info";

interface Toast {
  id: number;
  msg: string;
  tone: Tone;
}


const ToastCtx = createContext<{
  push: (msg: string, tone?: Tone) => void;
} | null>(null);

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
              t.tone === "warn" &&
                "border-amber-warn/40 bg-[#2a1c05] text-cream",
              t.tone === "info" && "border-pine/20 bg-cream text-ink",
            )}>
            {t.tone === "success" && (
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-fern" />
            )}
            {t.tone === "warn" && (
              <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />
            )}
            {t.tone === "info" && (
              <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-forest" />
            )}
            <p className="text-sm leading-snug">{t.msg}</p>
            <button
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="ml-auto opacity-60 transition hover:opacity-100"
              aria-label="Dismiss">
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
