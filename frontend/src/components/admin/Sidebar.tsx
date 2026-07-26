import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import {
  Calculator,
  Clock,
  Cog,
  Crown,
  Folder,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  Users,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { PlanBadge } from "../ui/Pills&Badges";
import useAuth from "../../hooks/useAuth";
import type { Member } from "../../data/mock";

type Tab =
  | "overview"
  | "products"
  | "loan-calculator"
  | "members"
  | "loans"
  | "schedule"
  | "payments"
  | "settings";

const NAV: {
  id: Tab;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, to: "/admin" },
  { id: "members", label: "Members", icon: Users, to: "/admin/members" },
  { id: "products", label: "Products", icon: Folder, to: "/admin/products" },
  {
    id: "loan-calculator",
    label: "Loan calculator",
    icon: Calculator,
    to: "/admin/loan-calculator",
  },
  { id: "loans", label: "Loans", icon: HandCoins, to: "/admin/loans" },
  { id: "schedule", label: "Schedule", icon: Clock, to: "/admin/schedule" },
  {
    id: "payments",
    label: "Payments",
    icon: ReceiptText,
    to: "/admin/payments",
  },
  { id: "settings", label: "Settings", icon: Cog, to: "/admin/settings" },
];

const Sidebar: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [added, setAdded] = useState<Member[]>([]);
  const { user, memberCap } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showUpgrade, setShowUpgrade] = useState(false);

  const totalMembers = (user?.memberBase ?? 0) + added.length;
  const usagePct =
    memberCap === Infinity
      ? 4
      : Math.min(100, Math.round((totalMembers / memberCap) * 100));

  return (
    <aside className="sticky top-0 overflow-y-auto hidden h-screen flex-col border-r border-cream/10 bg-pine text-cream lg:flex">
      <div className="border-b border-cream/10 px-6 py-5">
        <Link to="/admin">
          <Logo light />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Main navigation">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = tab === n.id;
          return (
            <Link
              key={n.id}
              to={n.to}
              onClick={() => setTab(n.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-gold text-ink shadow-[0_2px_0_rgba(0,0,0,.25)]"
                  : "text-cream/65 hover:bg-cream/8 hover:text-cream",
              )}
              aria-current={isActive ? "page" : undefined}>
              <Icon className="h-4.5 w-4.5" /> {n.label}
            </Link>
          );
        })}
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
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold/15 py-2 text-xs font-bold text-gold transition hover:bg-gold hover:text-ink"
            aria-label="Upgrade plan">
            <Crown className="h-3.5 w-3.5" /> Upgrade plan
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;