import { useState, type FormEvent } from 'react'
import { Field } from '../ui';

const AddMemeberModel = () => {
  return function AddMemberModal({
    onClose,
    onSave,
    nextNumber,
  }: {
    onClose: () => void;
    onSave: (name: string, phone: string) => void;
    nextNumber: number;
  }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const submit = (e: FormEvent) => {
      e.preventDefault();
      if (name.trim().length < 3)
        return setErr("Enter the member's full name.");
      if (!/^\+?254\d{9}$|^0\d{9}$/.test(phone.replace(/\s/g, "")))
        return setErr("Enter a valid Kenyan phone number.");
      onSave(name.trim(), phone.trim());
    };
    return (
      <div
        className="fixed inset-0 z-90 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
        onClick={onClose}>
        <div
          className="w-full max-w-md rounded-2xl bg-cream p-6 shadow-lift"
          onClick={(e) => e.stopPropagation()}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-ink">
              Add member #{nextNumber}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink/45 transition hover:bg-ink/5 hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Full name">
              <input
                autoFocus
                className={inputCls}
                placeholder="e.g. Achieng Owino"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field
              label="Phone (M-Pesa)"
              hint="Used for STK push collections & SMS statements">
              <input
                className={inputCls}
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            {err && (
              <p className="rounded-lg border border-danger/25 bg-danger/8 px-3.5 py-2 text-sm text-danger">
                {err}
              </p>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-ink/15 py-2.5 font-semibold text-ink/60 transition hover:bg-ink/5">
                Cancel
              </button>
              <button className="flex-1 rounded-xl bg-pine py-2.5 font-bold text-cream transition hover:bg-forest">
                Add member
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
}

export default AddMemeberModel