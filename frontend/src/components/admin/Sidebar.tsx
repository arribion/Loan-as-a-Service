import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { Crown, HandCoins, LayoutDashboard, LogOut, ReceiptText, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PlanBadge } from '../ui';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

const NAV: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "loans", label: "Loans", icon: HandCoins },
  { id: "payments", label: "Payments", icon: ReceiptText },
];

type Tab = "overview" | "members" | "loans" | "payments";

const Sidebar = () => {
    const { user, memberCap } = useAuth();
    const [tab, setTab] = useState<Tab>("overview");
    const totalMembers = (user?.memberBase ?? 0) + added.length;
    const usagePct = memberCap === Infinity ? 4 : Math.min(100, Math.round((totalMembers / memberCap) * 100));
  return (
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
  )
}

export default Sidebar