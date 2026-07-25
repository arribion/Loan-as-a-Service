export type PlanId = "lite" | "growth" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number | null; // KES, null = custom
  memberCap: number; // Infinity for enterprise
  features: string[];
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "lite",
    name: "Lite",
    tagline: "For new chamas & table banking groups",
    monthly: 4500,
    memberCap: 50,
    features: [
      "Up to 50 members",
      "2 loan products",
      "M-Pesa STK push collections",
      "SMS payment reminders",
      "Member & loan ledgers",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For established SACCOs & microfinance brands",
    monthly: 14500,
    memberCap: 500,
    highlight: true,
    features: [
      "Up to 500 members",
      "Unlimited loan products",
      "M-Pesa + bank reconciliation",
      "Credit scoring engine",
      "Automated penalty rules",
      "Bulk SMS & statements",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For deposit-taking SACCOs & county lenders",
    monthly: null,
    memberCap: Infinity,
    features: [
      "Unlimited members",
      "Multi-branch & teller roles",
      "Custom credit score models",
      "CBS & SASRA reporting",
      "Dedicated success manager",
      "99.9% uptime SLA",
      "On-site onboarding in Kenya",
    ],
  },
];

export const planById = (id: PlanId): Plan => PLANS.find((p) => p.id === id)!;

export const kes = (n: number) =>
  "KES " + n.toLocaleString("en-KE", { maximumFractionDigits: 0 });

/* ---------------- mock members (demo tenant: Baraka Chama, Lite plan) ---------------- */
export interface Member {
  id: string;
  name: string;
  phone: string;
  joined: string;
  savings: number;
  activeLoans: number;
  status: "Good" | "Watch" | "Overdue";
}

export const SEED_MEMBERS: Member[] = [
  { id: "M-0041", name: "Wanjiku Kamau", phone: "+254 712 448 210", joined: "Jan 2024", savings: 86500, activeLoans: 1, status: "Good" },
  { id: "M-0042", name: "Otieno Odhiambo", phone: "+254 722 903 114", joined: "Feb 2024", savings: 54200, activeLoans: 1, status: "Good" },
  { id: "M-0043", name: "Amina Yusuf", phone: "+254 733 671 885", joined: "Mar 2024", savings: 112800, activeLoans: 0, status: "Good" },
  { id: "M-0044", name: "Kiprop Sang", phone: "+254 701 224 556", joined: "Apr 2024", savings: 38900, activeLoans: 1, status: "Watch" },
  { id: "M-0045", name: "Nyambura Wairimu", phone: "+254 745 118 002", joined: "May 2024", savings: 67300, activeLoans: 1, status: "Overdue" },
  { id: "M-0046", name: "Baraka Mwenda", phone: "+254 728 556 341", joined: "Jun 2024", savings: 29750, activeLoans: 0, status: "Good" },
  { id: "M-0047", name: "Achieng' Adongo", phone: "+254 716 774 209", joined: "Jul 2024", savings: 91400, activeLoans: 1, status: "Good" },
  { id: "M-0048", name: "Mwangi Njoroge", phone: "+254 707 332 918", joined: "Aug 2024", savings: 45600, activeLoans: 1, status: "Watch" },
];

export interface Loan {
  id: string;
  member: string;
  product: string;
  principal: number;
  balance: number;
  rate: number; // % per month
  disbursed: string;
  due: string;
  status: "Active" | "Completed" | "Overdue" | "Pending";
}

export const LOANS: Loan[] = [
  { id: "LN-2201", member: "Wanjiku Kamau", product: "School Fees", principal: 45000, balance: 18200, rate: 3, disbursed: "12 Jan 2025", due: "12 Jul 2025", status: "Active" },
  { id: "LN-2202", member: "Otieno Odhiambo", product: "Agri Input", principal: 80000, balance: 52400, rate: 2.5, disbursed: "03 Feb 2025", due: "03 Oct 2025", status: "Active" },
  { id: "LN-2203", member: "Nyambura Wairimu", product: "Emergency", principal: 20000, balance: 9600, rate: 4, disbursed: "18 Nov 2024", due: "18 May 2025", status: "Overdue" },
  { id: "M-2204", member: "Kiprop Sang", product: "Personal", principal: 30000, balance: 30000, rate: 3, disbursed: "02 Mar 2025", due: "02 Sep 2025", status: "Active" },
  { id: "LN-2198", member: "Achieng' Adongo", product: "Business", principal: 120000, balance: 0, rate: 2.5, disbursed: "20 Jun 2024", due: "20 Feb 2025", status: "Completed" },
  { id: "LN-2205", member: "Mwangi Njoroge", product: "Personal", principal: 25000, balance: 14750, rate: 3, disbursed: "22 Feb 2025", due: "22 Aug 2025", status: "Active" },
  { id: "LN-2206", member: "Baraka Mwenda", product: "Agri Input", principal: 60000, balance: 60000, rate: 2.5, disbursed: "—", due: "—", status: "Pending" },
];

export interface Payment {
  id: string;
  member: string;
  method: "M-Pesa" | "Bank" | "Cash";
  ref: string;
  amount: number;
  date: string;
  loan: string;
}

export const PAYMENTS: Payment[] = [
  { id: "P-9921", member: "Wanjiku Kamau", method: "M-Pesa", ref: "SGH7KL2M1N", amount: 4500, date: "Today, 09:42", loan: "LN-2201" },
  { id: "P-9920", member: "Amina Yusuf", method: "M-Pesa", ref: "QWE3RT8YU2", amount: 6000, date: "Today, 08:15", loan: "Savings" },
  { id: "P-9919", member: "Otieno Odhiambo", method: "Bank", ref: "EQTY-88231", amount: 8900, date: "Yesterday", loan: "LN-2202" },
  { id: "P-9918", member: "Kiprop Sang", method: "M-Pesa", ref: "ZX9CV4BN7M", amount: 3200, date: "Yesterday", loan: "LN-2204" },
  { id: "P-9917", member: "Achieng' Adongo", method: "Cash", ref: "Teller #2", amount: 12500, date: "Mon, 14:03", loan: "LN-2198" },
  { id: "P-9916", member: "Mwangi Njoroge", method: "M-Pesa", ref: "LK3JH6GF9D", amount: 2750, date: "Mon, 10:27", loan: "LN-2205" },
];

/* ---------------- member portal data (Wanjiku Kamau) ---------------- */
export interface Instalment {
  id: string;
  due: string;
  amount: number;
  status: "Paid" | "Due" | "Upcoming";
  paidVia?: string;
}

export const MEMBER_INSTALMENTS: Instalment[] = [
  { id: "I-1", due: "12 Feb 2025", amount: 4500, status: "Paid", paidVia: "M-Pesa • SGH2AA11" },
  { id: "I-2", due: "12 Mar 2025", amount: 4500, status: "Paid", paidVia: "M-Pesa • QWE9ZZ42" },
  { id: "I-3", due: "12 Apr 2025", amount: 4500, status: "Paid", paidVia: "M-Pesa • RTY5XK87" },
  { id: "I-4", due: "12 May 2025", amount: 4600, status: "Due" },
  { id: "I-5", due: "12 Jun 2025", amount: 4600, status: "Upcoming" },
  { id: "I-6", due: "12 Jul 2025", amount: 4500, status: "Upcoming" },
];

/* ---------------- landing content ---------------- */
export const CHART_CASHFLOW = {
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  disbursed: [1.9, 2.4, 3.1, 2.8, 3.6, 4.2],
  repaid: [1.4, 1.8, 2.2, 2.5, 2.9, 3.4],
};

export const CHART_PORTFOLIO = {
  labels: ["Personal", "School Fees", "Agri Input", "Business", "Emergency"],
  values: [32, 24, 18, 16, 10],
};

export const TESTIMONIALS = [
  {
    quote:
      "We moved 312 members off exercise books in a single weekend. M-Pesa reconciliation that took our treasurer three days now happens before chai time.",
    name: "Grace Wambui",
    role: "Manager, Tumaini Bora SACCO — Nakuru",
    initials: "GW",
  },
  {
    quote:
      "The credit score engine flags risky borrowers before we disburse. Our portfolio-at-risk dropped from 9% to 3.1% in two quarters.",
    name: "Daniel Kiptoo",
    role: "Credit Officer, Elgon Harvest Chama — Kitale",
    initials: "DK",
  },
  {
    quote:
      "As a table banking group we only needed Lite. When we crossed 50 members, upgrading to Growth took one click — no data migration drama.",
    name: "Fatuma Hassan",
    role: "Chairperson, Garissa Women Table Banking",
    initials: "FH",
  },
];

export const LANDER_NAMES = [
  "Tumaini Bora SACCO",
  "Elgon Harvest Chama",
  "Pwani Fishers Fund",
  "Nairobi Matatu Owners",
  "Kilimo Biashara Group",
  "Garissa Women TB",
  "Jua Kali Traders Fund",
  "Boda Boda Saccos Ke",
];
