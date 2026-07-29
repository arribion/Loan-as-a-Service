import { Gauge } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Stats from "../../components/client/Stats";
import TransactionHistory from "../../components/client/Transaction-History";
import Schedules from "../../components/client/Schedules";

export default function MemberDashboard() {
  const { user } = useAuth();
  const repaidPct = 72;

  return (
    <div className="min-h-screen bg-frost">
      <main className="mx-auto px-5 py-8">
        {/* greeting */}
        <div className="relative overflow-hidden rounded-2xl bg-pine p-7 text-cream shadow-lift">
          <div className="bg-grid-dark absolute inset-0" />
          <div className="bg-radial-gold absolute inset-0" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-cream/55">Member M-0041 · since Jan 2024</p>
              <h1 className="mt-1 font-display text-3xl font-bold">Habari, {user?.name.split(" ")[0]} 🌿</h1>
              <p className="mt-2 max-w-md text-sm text-cream/65">Your school fees loan is {repaidPct}% repaid. Keep it up and your credit limit grows next cycle.</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-cream/12 bg-cream/6 px-4 py-3 backdrop-blur">
              <Gauge className="h-6 w-6 text-gold" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-cream/50">Credit score</p>
                <p className="font-display text-xl font-bold text-goldsoft">812 <span className="text-xs font-normal text-fern">Excellent</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* stats */}
        <Stats/>

        {/* schedule */}
        <Schedules/>

        {/* history */}
        <TransactionHistory/>
      </main>
    </div>
  );
}
