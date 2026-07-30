import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";
import {
  BanknoteArrowDown,
  Calculator,
  ChevronDown,
  Clock,
  Cog,
  Crown,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  Users,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { PlanBadge } from "../ui/Pills&Badges";
import useAuth from "../../hooks/useAuth";
import type { Member } from "../../data/mock";

type ChildNavItem = {
  id: string;
  label: string;
  to: string;
};

type NavItem = {
  id: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to?: string; // optional for parent with children (if we still want a default page)
  children?: ChildNavItem[]; // children don't have icons (or could, but we'll omit)
};

const NAV: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, to: "/admin" },
  {
    id: "members",
    label: "Members",
    icon: Users,
    to: "/admin/members",
    children: [
      { id: "all-products", label: "All Products", to: "/admin/products/all" },
      { id: "add-products", label: "Add Product", to: "/admin/products/add" },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: ReceiptText,
    to: "/admin/products",
    children: [
      { id: "all-members", label: "All Members", to: "/admin/products/" },
      { id: "add-products", label: "Add Member", to: "/admin/products/add" },
    ],
  },
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
    icon: BanknoteArrowDown,
    to: "/admin/payments",
    children: [
      {
        id: "members-payments",
        label: "Members Payments",
        to: "/admin/payments/members",
      },
      {
        id: "payment-settings",
        label: "Payment Settings",
        to: "payments/settings",
      },
    ],
  },
  {
    id: "sms",
    label: "SMS",
    icon: BanknoteArrowDown,
    to: "/admin/sms-communication",
    children: [
      {
        id: "members-payments",
        label: "Members Payments",
        to: "/admin/payments/members",
      },
      {
        id: "sms-settings",
        label: "SMS Settings",
        to: "sms/settings",
      },
    ],
  },
  { id: "settings", label: "Settings", icon: Cog, to: "/admin/settings" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, memberCap } = useAuth();
  const [added] = useState<Member[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showUpgrade, setShowUpgrade] = useState(false);

  // Set initial expanded state based on current route
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    NAV.forEach((item) => {
      if (item.children?.some((child) => location.pathname === child.to)) {
        initial.add(item.id);
      }
    });
    return initial;
  });

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Determine if a nav item (or one of its children) is active
  const isItemActive = (item: NavItem): boolean => {
    if (item.to && location.pathname === item.to) return true;
    if (item.children) {
      return item.children.some((child) => location.pathname === child.to);
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalMembers = ((user as any)?.memberBase ?? 0) + added.length;
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
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item);
          const hasChildren = Boolean(item.children?.length);
          const isExpanded = expanded.has(item.id);

          if (!hasChildren) {
            // Simple nav link (no children)
            return (
              <Link
                key={item.id}
                to={item.to!}
                className={cn(
                  "flex w-full items-center gap-3 rounded px-4 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-gold text-ink "
                    : "text-cream/65 hover:bg-cream/8 hover:text-cream",
                )}
                aria-current={isActive ? "page" : undefined}>
                {Icon && <Icon className="h-4.5 w-4.5" />}
                {item.label}
              </Link>
            );
          }

          // Parent with children
          return (
            <div key={item.id} className="space-y-0.5">
              {/* Parent row */}
              <div className="flex items-center">
                <Link
                  to={item.to!}
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded px-4 py-2.5 text-sm font-semibold transition",
                    isActive
                      ? "bg-gold text-ink"
                      : "text-cream/65 hover:bg-cream/8 hover:text-cream",
                  )}
                  aria-current={isActive ? "page" : undefined}>
                  {Icon && <Icon className="h-4.5 w-4.5" />}
                  {item.label}
                </Link>
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="ml-auto p-2 text-cream/50 hover:text-cream transition-transform"
                  aria-label={isExpanded ? "Collapse" : "Expand"}>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform duration-200", {
                      "rotate-180": isExpanded,
                    })}
                  />
                </button>
              </div>

              {/* Children links */}
              {isExpanded && (
                <ul className="ml-6 space-y-0.5 border-l border-cream/10 pl-4">
                  {item.children!.map((child) => {
                    const childActive = location.pathname === child.to;
                    return (
                      <li key={child.id}>
                        <Link
                          to={child.to}
                          className={cn(
                            "block rounded-lg px-4 py-2 text-sm font-medium transition",
                            childActive
                              ? "bg-gold/20 text-gold"
                              : "text-cream/50 hover:bg-cream/8 hover:text-cream",
                          )}
                          aria-current={childActive ? "page" : undefined}>
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
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
