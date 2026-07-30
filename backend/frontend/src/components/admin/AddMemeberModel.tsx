// components/modal/AddMemberModal.tsx
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { api } from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import { inputCls } from "../../utils/inputCls";

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess?: () => void; // callback after successful creation
}

const AddMemberModal = ({ onClose, onSuccess }: AddMemberModalProps) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // optional but good to have
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (fullName.trim().length < 3) return "Enter the member's full name.";
    if (!/^\+?254\d{9}$|^0\d{9}$/.test(phone.replace(/\s/g, "")))
      return "Enter a valid Kenyan phone number.";
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      return "Enter a valid email address.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user?.tenantId) {
      setError("You must be logged in to add a member.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/v1/members", {
        full_name: fullName.trim(),
        email_address:
          email.trim() || `${fullName.trim().replace(/\s/g, ".")}@temp.co.ke`, // temporary email if not provided
        phone_number: phone.trim(),
        security_role: "borrower"
      });

      // Success
      onSuccess?.();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to add member.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-cream p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-ink">
            Add Member
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink/45 transition hover:bg-ink/5 hover:text-ink"
            type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Full Name</label>
            <input
              autoFocus
              className={inputCls}
              placeholder="e.g. Achieng Owino"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
            </div>

          <div>
            <label>Phone (Mpesa)</label>
            <input
              className={inputCls}
              placeholder="07XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
         </div>

          <div>
            <label htmlFor="">Email (Optional)</label>
            <input
              className={inputCls}
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-ink/15 py-2.5 font-semibold text-ink/60 transition hover:bg-ink/5"
              disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-pine py-2.5 font-bold text-cream transition hover:bg-forest disabled:opacity-60"
              disabled={loading}>
              {loading ? "Adding…" : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
