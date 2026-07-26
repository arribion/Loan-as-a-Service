import { useState } from 'react'
import Logo from '../ui/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { HandCoins, LayoutDashboard, LogOut, ReceiptText, Search, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import useAuth from '../../hooks/useAuth';

const NAV: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "loans", label: "Loans", icon: HandCoins },
  { id: "payments", label: "Payments", icon: ReceiptText },
];

type Tab = "overview" | "members" | "loans" | "payments";


const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  
    const doLogout = () => {
    logout();
    navigate("/");
  };
    return (
        <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/90 backdrop-blur">
          <div className="flex items-center gap-4 px-5 py-3.5 lg:px-8">
            <div className="lg:hidden">
              <Link to="/">
                <Logo compact />
              </Link>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs text-ink/45">{user!.org} · Admin console</p>
              <h1 className="font-display text-lg font-bold capitalize text-ink">
                {tab}
              </h1>
            </div>
            <div className="relative ml-auto hidden w-64 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (tab !== "members") setTab("members");
                }}
                placeholder="Search members…"
                className="w-full rounded-lg border border-ink/10 bg-paper py-2 pl-9 pr-3 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </div>
            <button
              onClick={doLogout}
              className="ml-auto rounded-lg border border-ink/10 p-2 text-ink/55 transition hover:border-danger/30 hover:text-danger md:ml-0 lg:hidden"
              title="Log out">
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
          {/* mobile nav */}
          <div className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition",
                  tab === n.id ? "bg-pine text-cream" : "bg-ink/5 text-ink/60",
                )}>
                <n.icon className="h-3.5 w-3.5" /> {n.label}
              </button>
            ))}
          </div>
          </header>
          
  )
}

export default Topbar