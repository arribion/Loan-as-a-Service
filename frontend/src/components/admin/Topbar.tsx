import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CogIcon, LogOut, User } from "lucide-react";
import { cn } from "../../utils/cn";
import useAuth from "../../hooks/useAuth";
import Logo from "../ui/Logo";
import { NAV } from "../../config/navigate";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "members" | "loans" | "payments">(
    "overview",
  );
  const [profileModal, setProfileModel] = useState(false);

  const toggleProfileModel = () => setProfileModel(!profileModal);

  const doLogout = () => {
    logout();
    navigate("/");
  };


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mobileNav = NAV.filter((item) => !item.children); 

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
            <p className="text-xs text-ink/45">{user!.org} · Admin console</p>
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

          <div onClick={toggleProfileModel} className="min-w-0 flex-1 relative">
            <p className="truncate text-sm font-semibold">{user!.name}</p>
            <p className="truncate text-[11px] text-slate-800/70">
              {user!.org}
            </p>

            {profileModal && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <nav>
                  <ul className="py-1">
                    <li className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                      <User className="h-4 w-4" /> Account
                    </li>
                    <li className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                      <CogIcon className="h-4 w-4" /> Settings
                    </li>
                    <li className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                      MFA
                    </li>
                    <li
                      onClick={doLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                      <LogOut className="h-4 w-4" /> Logout
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile nav – only top-level items */}
      <div className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setTab(n.id as any)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition",
              tab === n.id ? "bg-pine text-cream" : "bg-ink/5 text-ink/60",
            )}>
            {n.icon && <n.icon className="h-3.5 w-3.5" />}
            {n.label}
          </button>
        ))}
      </div>

      {/* optional: keep logout button for mobile */}
      <button
        onClick={doLogout}
        className="ml-auto rounded-lg border border-ink/10 p-2 text-ink/55 transition hover:border-danger/30 hover:text-danger md:ml-0 lg:hidden"
        title="Log out">
        <LogOut className="h-4.5 w-4.5" />
      </button>
    </header>
  );
};

export default Topbar;
