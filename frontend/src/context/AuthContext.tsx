import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { planById, type PlanId } from "../data/mock";

export type Role = "admin" | "member";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  org: string;
  plan: PlanId;
  memberBase: number;
}

interface RegisterPayload {
  org: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  plan: PlanId;
}

interface AuthCtx {
  user: SessionUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => { ok: boolean; error?: string; role?: Role };
  register: (payload: RegisterPayload) => { ok: boolean; error?: string };
  updatePlan: (plan: PlanId) => void;
  logout: () => void;
  memberCap: number;
}

const Ctx = createContext<AuthCtx | null>(null);

const SESSION_KEY = "mkopos_session_v1";
const TENANTS_KEY = "mkopos_tenants_v1";

const DEMO_ADMIN: SessionUser & { password: string } = {
  name: "Samuel Baraka",
  email: "admin@barakachama.co.ke",
  role: "admin",
  org: "Baraka Chama",
  plan: "lite",
  memberBase: 48,
  password: "admin123",
};

const DEMO_MEMBER: SessionUser & { password: string } = {
  name: "Wanjiku Kamau",
  email: "member@barakachama.co.ke",
  role: "member",
  org: "Baraka Chama",
  plan: "lite",
  memberBase: 48,
  password: "member123",
};

interface StoredTenant {
  org: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  plan: PlanId;
}

function readTenants(): StoredTenant[] {
  try {
    return JSON.parse(localStorage.getItem(TENANTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Persist session whenever user changes
  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  // Simulate initial auth resolution (keeps UI from flashing while app mounts)
  useEffect(() => {
    // If you have async validation, replace this with real async call.
    // Small timeout ensures components can read `loading` before it's cleared.
    const t = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(t);
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const login: AuthCtx["login"] = (email, password) => {
      const e = email.trim().toLowerCase();
      if (e === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _p, ...u } = DEMO_ADMIN;
        setUser(u);
        return { ok: true, role: "admin" };
      }
      if (e === DEMO_MEMBER.email && password === DEMO_MEMBER.password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _p, ...u } = DEMO_MEMBER;
        setUser(u);
        return { ok: true, role: "member" };
      }
      const tenant = readTenants().find((t) => t.email.toLowerCase() === e);
      if (tenant && tenant.password === password) {
        setUser({
          name: tenant.name,
          email: tenant.email,
          role: "admin",
          org: tenant.org,
          plan: tenant.plan,
          memberBase: 0,
        });
        return { ok: true, role: "admin" };
      }
      return {
        ok: false,
        error: "Invalid email or password. Try a demo account below.",
      };
    };

    const register: AuthCtx["register"] = (payload) => {
      const e = payload.email.trim().toLowerCase();
      if (
        e === DEMO_ADMIN.email ||
        e === DEMO_MEMBER.email ||
        readTenants().some((t) => t.email.toLowerCase() === e)
      ) {
        return {
          ok: false,
          error: "An account with this email already exists.",
        };
      }
      const tenant: StoredTenant = { ...payload, email: payload.email.trim() };
      localStorage.setItem(
        TENANTS_KEY,
        JSON.stringify([...readTenants(), tenant]),
      );
      setUser({
        name: payload.name,
        email: tenant.email,
        role: "admin",
        org: payload.org,
        plan: payload.plan,
        memberBase: 0,
      });
      return { ok: true };
    };

    const updatePlan: AuthCtx["updatePlan"] = (plan) => {
      setUser((u) => {
        if (!u) return u;
        const next = { ...u, plan };
        const tenants = readTenants();
        const idx = tenants.findIndex(
          (t) => t.email.toLowerCase() === u.email.toLowerCase(),
        );
        if (idx >= 0) {
          tenants[idx] = { ...tenants[idx], plan };
          localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
        }
        return next;
      });
    };

    const logout = () => setUser(null);

    const memberCap = user ? planById(user.plan).memberCap : 0;

    return { user, loading, login, register, updatePlan, logout, memberCap };
  }, [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export default Ctx;
