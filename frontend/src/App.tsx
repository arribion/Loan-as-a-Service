import { useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import { ToastProvider } from "./components/ui/Toaster"

import ProtectedRoute from "./pages/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MemberDashboard from "./pages/client/MemberDashboard";
import NotFound from "./components/NotFound";

import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import Overview from "./pages/admin/Overview";
import Product from "./pages/admin/Product";
import Members from "./pages/admin/Members";
import Payments from "./pages/admin/Payments";
import LoanCalculator from "./pages/admin/LoanCalculator";
import Settings from "./pages/admin/Settings";
import Loans from "./pages/admin/Loans";
import { Toaster } from "react-hot-toast";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

/** Sends authenticated users away from auth pages to their main route. */
function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // Avoid redirecting before auth state resolves

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/member"} replace />
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <Toaster/>
          <ScrollToTop />
          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
            </Route>

            {/* Auth Layout */}
            <Route element={<AuthLayout />}>
              <Route
                path="login"
                element={
                  <RedirectIfAuthed>
                    <Login />
                  </RedirectIfAuthed>
                }
              />
              <Route
                path="register"
                element={
                  <RedirectIfAuthed>
                    <Register />
                  </RedirectIfAuthed>
                }
              />
            </Route>

            {/* Admin Portal (Protected) */}
            <Route
              path="admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
              <Route index element={<Overview />} />
              <Route path="members" element={<Members />} />
              <Route path="products" element={<Product />} />
              <Route path="loan" element={<Loans />} />
              <Route path="payments" element={<Payments />} />
              <Route path="loan-calculator" element={<LoanCalculator />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Member Portal (Protected) */}
            <Route
              path="member"
              element={
                <ProtectedRoute role="member">
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />

            {/* Global 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
