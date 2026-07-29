import {
  BanknoteArrowDown,
  Calculator,
  Clock,
  Cog,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  Users,
} from "lucide-react";

export type Tab =
  | "overview"
  | "products"
  | "loan-calculator"
  | "members"
  | "loans"
  | "schedule"
  | "payments"
  | "settings";

export type NavItem = {
  id: Tab;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
  children?: Omit<NavItem, "icon" | "children">[];
};

export const NAV: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, to: "/admin" },
  { id: "members", label: "Members", icon: Users, to: "/admin/members" },
  {
    id: "products",
    label: "Products",
    icon: ReceiptText,
    to: "/admin/products",
    children: [
      { id: "all-products", label: "All Products", to: "/admin/products/all" },
      { id: "add-products", label: "Add Product", to: "/admin/products/add" },
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
        to: "/admin/payments/settings",
      },
    ],
  },
  { id: "settings", label: "Settings", icon: Cog, to: "/admin/settings" },
];
