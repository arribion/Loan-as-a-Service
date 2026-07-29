import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./ui/Logo";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  // Destructure user state from your custom hook
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Helper function to extract initials from name or email
  const getInitials = () => {
    if (!user) return "";

    if (user.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    return user.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-ink/6 bg-cream px-2 py-1.5 shadow-card md:flex">
          {[
            ["features", "Platform"],
            ["pricing", "Pricing"],
            ["stories", "Stories"],
            ["faq", "FAQ"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-ink/65 transition hover:bg-mint hover:text-forest">
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            /* Logged In State: Initials Avatar */
            <Link
              to="/admin"
              className="flex h-10 w-10 items-center gap-2 justify-center rounded-full bg-forest font-bold text-cream transition hover:scale-105">
              {getInitials()}
            </Link>
          ) : (
            /* Logged Out State: Auth Buttons */
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition hover:text-forest sm:block">
                Log in
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream px-5 py-2.5 text-sm font-bold text-ink shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
                Start Free
                <ArrowUpRight className="h-4 w-4 text-forest transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;