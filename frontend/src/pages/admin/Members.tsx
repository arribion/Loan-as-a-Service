import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { kes, SEED_MEMBERS, type Member } from "../../data/mock";
import { cn } from "../../utils/cn";
import { StatusPill } from "../../components/ui/Pills&Badges";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../components/ui/Toaster";

/**
 * Local fallback for planById and PlanBadge.
 * Replace these with your real implementations if available.
 */
const planById = (id: string | undefined) => {
  const plans: Record<string, { id: string; name: string }> = {
    free: { id: "free", name: "Free" },
    pro: { id: "pro", name: "Pro" },
    team: { id: "team", name: "Team" },
  };
  return plans[id ?? "free"] ?? { id: "free", name: "Free" };
};

const PlanBadge = ({ plan }: { plan?: string }) => {
  const p = planById(plan);
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-ink/6 px-2 py-0.5 text-xs font-medium text-ink/80">
      {p.name}
    </span>
  );
};

/** Small Add Member modal (inline). Replace with your modal component if you have one. */
const AddMemberModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string, phone: string) => void;
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-3 text-lg font-semibold">Add member</h3>
        <label className="block text-sm">
          <span className="text-xs text-ink/60">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="Jane Doe"
          />
        </label>

        <label className="mt-3 block text-sm">
          <span className="text-xs text-ink/60">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="+2547XXXXXXXX"
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border px-3 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!name.trim()) return;
              onAdd(name.trim(), phone.trim());
            }}
            className="rounded bg-gold px-3 py-2 text-sm font-semibold">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

/** Small Upgrade modal placeholder */
const UpgradeModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-3 text-lg font-semibold">Upgrade required</h3>
        <p className="text-sm text-ink/60">
          You have reached your member limit. Upgrade your plan to add more
          members.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Members = () => {
  const { user, memberCap } = useAuth();
  const { push } = useToast();

  const [added, setAdded] = useState<Member[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [query, setQuery] = useState("");

  // combine added members with seeded members; memoize on added
  const members = useMemo(() => {
    return [...added, ...SEED_MEMBERS];
  }, [added]);

  const totalMembers = SEED_MEMBERS.length + added.length;
  const atCap = memberCap !== Infinity && totalMembers >= memberCap;

  const usagePct = useMemo(() => {
    if (memberCap === Infinity) return 4;
    if (!memberCap || memberCap === 0) return 100;
    return Math.min(100, Math.round((totalMembers / memberCap) * 100));
  }, [totalMembers, memberCap]);

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)),
    );
  }, [members, query]);

  const addMember = (name: string, phone: string) => {
    if (atCap) {
      setShowAdd(false);
      setShowUpgrade(true);
      push(
        `Member limit reached on the ${planById(user?.plan).name} plan (${memberCap}). Upgrade to add more.`,
        "warn",
      );
      return;
    }

    const newId = `M-${String(1000 + added.length).slice(-4)}`;
    const m: Member = {
      id: newId,
      name,
      phone,
      email: "",
      joined: "Today",
      savings: 0,
      activeLoans: 0,
      status: "Good",
    };

    setAdded((a) => [m, ...a]);
    setShowAdd(false);
    push(`${name} added — welcome member #${totalMembers + 1}.`);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Members
            </h2>
            <p className="text-sm text-ink/55">
              {totalMembers} enrolled · {filteredMembers.length} shown
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone"
              className="rounded border px-3 py-2 text-sm"
            />

            <button
              onClick={() =>
                atCap
                  ? (setShowUpgrade(true),
                    push(
                      "Member limit reached — choose a bigger plan to continue.",
                      "warn",
                    ))
                  : setShowAdd(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-4.5 py-2.5 text-sm font-bold text-ink shadow-[0_2px_0_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:bg-goldsoft">
              <Plus className="h-4 w-4" /> Add member
            </button>
          </div>
        </div>

        {/* usage bar */}
        <div className="rounded-2xl border border-ink/8 bg-cream p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">
              Subscription usage <PlanBadge plan={user?.plan} />
            </p>
            <p className="text-sm tabular-nums text-ink/60">
              {totalMembers} / {memberCap === Infinity ? "∞" : memberCap}{" "}
              members
            </p>
          </div>

          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink/8">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                usagePct > 90
                  ? "bg-danger"
                  : usagePct > 70
                    ? "bg-gold"
                    : "bg-leaf",
              )}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/8 bg-frost/60 text-left text-xs uppercase tracking-wider text-ink/45">
                  <th className="px-6 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Savings
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">Loans</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr
                    key={m.id}
                    className={cn(
                      "border-b border-ink/5 transition last:border-0 hover:bg-mint/40",
                      i < added.length && "animate-row-in",
                    )}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-pine text-[11px] font-bold text-gold">
                          {m.name
                            .split(" ")
                            .map((w) => (w ? w[0] : ""))
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>

                        <div>
                          <p className="font-semibold text-ink">{m.name}</p>
                          <p className="text-[11px] text-ink/40">{m.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-ink/60">{m.phone}</td>
                    <td className="px-4 py-3.5 text-ink/60">{m.joined}</td>

                    <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-ink">
                      {kes(m.savings)}
                    </td>

                    <td className="px-4 py-3.5 text-center tabular-nums text-ink/70">
                      {m.activeLoans}
                    </td>

                    <td className="px-6 py-3.5">
                      <StatusPill status={m.status} />
                    </td>
                  </tr>
                ))}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-14 text-center text-ink/45">
                      {members.length === 0
                        ? "No members yet — add your first member to get started."
                        : "No members match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {memberCap > 0 && filteredMembers.length > 0 && (
            <p className="border-t border-ink/8 px-6 py-3 text-xs text-ink/40">
              Showing {filteredMembers.length} of {totalMembers} members · older
              records archived in ledger export.
            </p>
          )}
        </div>
      </div>

      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onAdd={(name, phone) => addMember(name, phone)}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </>
  );
};

export default Members;
