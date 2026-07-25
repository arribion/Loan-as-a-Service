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
import { ToastProvider, ProtectedRoute } from "./components/ui";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MemberDashboard from "./pages/client/MemberDashboard";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import NotFound from "./components/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}

/** Sends signed-in users away from auth pages to their console. */
function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user)
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/member"} replace />
    );
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Landing />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route
                path="/login"
                element={
                  <RedirectIfAuthed>
                    {" "}
                    <Login />
                  </RedirectIfAuthed>
                }
              />
              <Route
                path="/register"
                element={
                  <RedirectIfAuthed>
                    {" "}
                    <Register />{" "}
                  </RedirectIfAuthed>
                }
              />
              <Route path="*" element={<NotFound/>} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  {" "}
                  <AdminDashboard />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/member"
              element={
                <ProtectedRoute role="member">
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
