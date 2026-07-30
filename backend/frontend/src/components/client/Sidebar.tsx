import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";
import {
  BanknoteArrowDown,
  Calculator,
  ChevronDown,
  Clock,
  Cog,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
} from "lucide-react";
import { cn } from "../../utils/cn";

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
  { id: "overview", label: "Overview", icon: LayoutDashboard, to: "/member" },
  {
    id: "Loans",
    label: "Loans",
    icon: ReceiptText,
    to: "/admin/products",
    children: [
      { id: "apply-loan", label: "Apply Loan", to: "/member/apply-loan/" },
      { id: "my-loan", label: "My Loans", to: "/member/my-loan" },
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
    id: "repayments",
    label: "Repayments",
    icon: BanknoteArrowDown,
    to: "/member/payments",
    children: [
      {
        id: "repay-loan",
        label: "Loan Payments",
        to: "/admin/payments/members",
      },
      {
        id: "payment-settings",
        label: "Payment History",
        to: "payments/settings",
      },
    ],
  },
  { id: "settings", label: "Settings", icon: Cog, to: "/admin/settings" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

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
    </aside>
  );
};

export default Sidebar;