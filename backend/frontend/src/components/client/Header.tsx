import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../../components/ui/Logo";

import useAuth from "../../hooks/useAuth";


export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => { logout(); navigate("/"); };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Logo />
          </Link>
          <span className="hidden rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-forest sm:inline">
            Member portal
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink/55 sm:block">
            {user?.org}
          </span>
          <button
            onClick={doLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-ink/12 px-3 py-2 text-sm font-semibold text-ink/60 transition hover:border-danger/30 hover:text-danger">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </div>
    </header>
  );
} 
