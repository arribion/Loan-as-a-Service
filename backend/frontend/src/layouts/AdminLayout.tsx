import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useToast } from "../components/ui/Toaster";
import { planById, type Member } from "../data/mock";
import { UpgradeModal } from "../components/admin/UpgradeModel";
import Topbar from "../components/admin/Topbar";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

export function AdminLayout() {
  const { user, memberCap, updatePlan } = useAuth();
  const { push } = useToast();
  const [added] = useState<Member[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const totalMembers = (user?.memberBase ?? 0) + added.length;
  const atCap = totalMembers >= memberCap;

  return (
    <>
      <div className="min-h-screen bg-frost lg:grid lg:grid-cols-[264px_1fr]">
        <Sidebar />

        <div className="min-w-0">
          {/* topbar */}
          <Topbar />
          <main className="px-5 py-7 lg:px-8">
            {/* cap warning */}
            {atCap && (
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-amber-warn/35 bg-gold/12 px-4 py-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-warn" />
                <p className="text-sm text-ink/75">
                  You've reached the <strong>{memberCap}-member limit</strong>{" "}
                  on the {planById(user!.plan).name} plan. Upgrade to keep
                  onboarding members.
                </p>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="ml-auto rounded-lg bg-pine px-3.5 py-1.5 text-xs font-bold text-cream transition hover:bg-forest">
                  View plans
                </button>
              </div>
            )}

            {/* ============ UPGRADE MODAL ============ */}
            {showUpgrade && (
              <UpgradeModal
                current={user!.plan}
                onClose={() => setShowUpgrade(false)}
                onSelect={(p) => {
                  updatePlan(p);
                  setShowUpgrade(false);
                  push(
                    `Subscription upgraded to ${planById(p).name}. New member limit: ${planById(p).memberCap === Infinity ? "unlimited" : planById(p).memberCap}.`,
                  );
                }}
              />
            )}
            
            <Outlet/>

          </main>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;