// context/AuthContext.tsx
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import { planById, type PlanId } from "../data/mock";

export type Role = "admin" | "loan_officer" | "auditor" | "borrower";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  org: string; // tenant business name
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

interface AuthCtx {
  user: SessionUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (
    payload: RegisterPayload,
  ) => Promise<{ ok: boolean; error?: string }>;
  updatePlan: (plan: PlanId) => Promise<void>;
  logout: () => Promise<void>;
  memberCap: number;
}

const Ctx = createContext<AuthCtx | null>(null);

// Demo credentials – must match seeded users
// const DEMO_ADMIN = {
//   email: "admin@barakachama.co.ke",
//   password: "admin123",
// };
// const DEMO_MEMBER = {
//   email: "member@barakachama.co.ke",
//   password: "member123",
// };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount (if cookies are present)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`,
          { withCredentials: true },
        );
        const data = response.data;
        // Transform to SessionUser
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
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value = useMemo<AuthCtx>(() => {
    // ----- LOGIN -----
    const login = async (email: string, password: string) => {
      try {
        await axios.post<LoginResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
          { email, password },
          { withCredentials: true },
        );
        // Ignore login response body and fetch full user via /me for complete details
        const meResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`,
          { withCredentials: true },
        );
        const me = meResponse.data;
        setUser({
          id: me.user.id,
          name: me.user.fullName,
          email: me.user.email,
          role: me.user.role,
          org: me.tenant.businessName,
          tenantId: me.user.tenantId,
          plan: me.tenant.packageTier,
        });
        return { ok: true };
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

    // ----- REGISTER -----
    const register = async (payload: RegisterPayload) => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register`,
          {
            businessName: payload.businessName,
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            plan: payload.plan,
          },
          { withCredentials: true },
        );
        // After registration, the user is automatically logged in (cookies set)
        // Fetch the full user via /me
        const meResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`,
          { withCredentials: true },
        );
        const me = meResponse.data;
        setUser({
          id: me.user.id,
          name: me.user.fullName,
          email: me.user.email,
          role: me.user.role,
          org: me.tenant.businessName,
          tenantId: me.user.tenantId,
          plan: me.tenant.packageTier,
        });
        return { ok: true };
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
      // You can implement a PUT /api/v1/tenants/plan endpoint later
      // For now, we'll just update the local user state
      setUser((u) => (u ? { ...u, plan } : u));
      // Optionally call API
    };

    // ----- LOGOUT -----
    const logout = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/logout`,
          {},
          { withCredentials: true },
        );
      } catch (error) {
        console.log(error)
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
