import { useState } from 'react'
import Logo from '../ui/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { HandCoins, LayoutDashboard, LogOut, ReceiptText, Users } from 'lucide-react';
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
  
    const doLogout = () => {
    logout();
    navigate("/");
  };
    return (
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/90 backdrop-blur">
        <div className="flex justify-between items-center gap-4 px-5 py-3.5 lg:px-8">
            <div>
              <div className="lg:hidden">
                <Link to="/">
                  <Logo compact />
                </Link>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs text-ink/45">
                  {user!.org} · Admin console
                </p>
                <h1 className="font-display text-lg font-bold capitalize text-ink">
                  {tab}
                </h1>
              </div>
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
                  <p className="truncate text-[11px] text-slate-800/70">
                    {user!.org}
                  </p>
                </div>

                <button
                  onClick={doLogout}
                  title="Log out"
                  className="text-green-600 transition hover:text-gold flex gap-2 items-center"
                  aria-label="Log out">
              <LogOut className="h-4.5 w-4.5" />
              logout
                </button>
              </div>
           </div>
        
          <button
            onClick={doLogout}
            className="ml-auto rounded-lg border border-ink/10 p-2 text-ink/55 transition hover:border-danger/30 hover:text-danger md:ml-0 lg:hidden"
            title="Log out">
          <LogOut className="h-4.5 w-4.5" />
          Logout
          </button>

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
    );
}

export default Topbar