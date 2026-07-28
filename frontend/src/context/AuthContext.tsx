// context/AuthContext.tsx
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AxiosError } from "axios";
import { api } from "../utils/api";
import { planById, type PlanId } from "../data/mock";

export type Role = "admin" | "loan_officer" | "auditor" | "borrower";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  org: string;
  tenantId: string;
  plan: PlanId;
}

interface RegisterPayload {
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  plan: PlanId;
}

interface LoginResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    tenantId: string;
  };
  tenant?: {
    id: string;
    name: string;
    packageTier: PlanId;
  };
}

interface MeResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    tenantId: string;
  };
  tenant: {
    id: string;
    businessName: string;
    packageTier: PlanId;
    isActive: boolean;
  };
}

interface AuthCtx {
  user: SessionUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string; user?: SessionUser }>;
  register: (
    payload: RegisterPayload,
  ) => Promise<{ ok: boolean; error?: string; user?: SessionUser }>;
  updatePlan: (plan: PlanId) => Promise<void>;
  logout: () => Promise<void>;
  memberCap: number;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount (if cookies exist)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<MeResponse>("/api/v1/auth/me");
        const data = response.data;
        setUser({
          id: data.user.id,
          name: data.user.fullName,
          email: data.user.email,
          role: data.user.role,
          org: data.tenant.businessName,
          tenantId: data.user.tenantId,
          plan: data.tenant.packageTier,
        });
      } catch (error) {
        // Not authenticated – leave user null
        console.debug("No active session:", (error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value = useMemo<AuthCtx>(() => {
    // ----- LOGIN (returns user) -----
    const login = async (email: string, password: string) => {
      try {
        await api.post<LoginResponse>("/api/v1/auth/login", {
          email,
          password,
        });
        // Fetch full user via /me
        const meResponse = await api.get<MeResponse>("/api/v1/auth/me");
        const me = meResponse.data;
        const sessionUser: SessionUser = {
          id: me.user.id,
          name: me.user.fullName,
          email: me.user.email,
          role: me.user.role,
          org: me.tenant.businessName,
          tenantId: me.user.tenantId,
          plan: me.tenant.packageTier,
        };
        setUser(sessionUser);
        return { ok: true, user: sessionUser };
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        let msg = "Login failed";
        if (error.response?.data?.message) {
          msg = error.response.data.message;
        } else if (error.response?.status === 401) {
          msg = "Invalid email or password.";
        } else if (error.response?.status === 403) {
          msg = "Account is inactive.";
        }
        return { ok: false, error: msg };
      }
    };

    // ----- REGISTER (returns user) -----
    const register = async (payload: RegisterPayload) => {
      try {
        await api.post("/api/v1/auth/register", {
          businessName: payload.businessName,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          password: payload.password,
          plan: payload.plan,
        });
        // After registration, fetch user via /me
        const meResponse = await api.get<MeResponse>("/api/v1/auth/me");
        const me = meResponse.data;
        const sessionUser: SessionUser = {
          id: me.user.id,
          name: me.user.fullName,
          email: me.user.email,
          role: me.user.role,
          org: me.tenant.businessName,
          tenantId: me.user.tenantId,
          plan: me.tenant.packageTier,
        };
        setUser(sessionUser);
        return { ok: true, user: sessionUser };
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        let msg = "Registration failed";
        if (error.response?.data?.message) {
          msg = error.response.data.message;
        } else if (error.response?.status === 409) {
          msg = "Email already registered.";
        }
        return { ok: false, error: msg };
      }
    };

    // ----- UPDATE PLAN (placeholder) -----
    const updatePlan = async (plan: PlanId) => {
      setUser((u) => (u ? { ...u, plan } : u));
    };

    // ----- LOGOUT -----
    const logout = async () => {
      try {
        await api.post("/api/v1/auth/logout", {});
      } catch (error) {
        console.debug("Logout error:", (error as Error).message);
      } finally {
        setUser(null);
      }
    };

    const memberCap = user ? planById(user.plan).memberCap : 0;

    return { user, loading, login, register, updatePlan, logout, memberCap };
  }, [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export default Ctx;