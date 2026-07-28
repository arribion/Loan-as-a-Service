import { useState } from "react";
import { api } from "../../utils/api"; // adjust path to your utils/api.ts
import useAuth from "../../hooks/useAuth";

interface LoanProductFormData {
  reference_title: string;
  interest_calculation_type: "flat" | "reducing_balance" | "compound";
  base_percentage: string;
  fine_rules: string; // JSON string
  min_loan_amount: string;
  max_loan_amount: string;
  max_term_days: number;
}

const AddLoanProductForm = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  const [form, setForm] = useState<LoanProductFormData>({
    reference_title: "",
    interest_calculation_type: "flat",
    base_percentage: "1.0000",
    fine_rules: "{}",
    min_loan_amount: "0.00",
    max_loan_amount: "0.00",
    max_term_days: 30,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const isNumberInput =
      e.target instanceof HTMLInputElement && e.target.type === "number";
    setForm((s) => ({
      ...s,
      [name]: isNumberInput ? Number(value) : value,
    }));
  };

  const validate = (): string | null => {
    if (!form.reference_title.trim()) return "Reference title is required.";
    if (
      !["flat", "reducing_balance", "compound"].includes(
        form.interest_calculation_type,
      )
    )
      return "Invalid interest calculation type.";
    if (
      isNaN(Number(form.base_percentage)) ||
      Number(form.base_percentage) <= 0
    )
      return "Base percentage must be a positive number.";
    if (
      isNaN(Number(form.min_loan_amount)) ||
      isNaN(Number(form.max_loan_amount))
    )
      return "Loan amounts must be numeric.";
    if (Number(form.min_loan_amount) < 0 || Number(form.max_loan_amount) < 0)
      return "Loan amounts must be non-negative.";
    if (Number(form.max_loan_amount) < Number(form.min_loan_amount))
      return "Max loan amount must be >= min loan amount.";
    if (!Number.isInteger(form.max_term_days) || form.max_term_days <= 0)
      return "Max term days must be a positive integer.";
    try {
      JSON.parse(form.fine_rules || "{}");
    } catch {
      return "Fine rules must be valid JSON.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tenantId) {
      setError("You must be logged in to create a loan product.");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      tenant_id: tenantId,
      reference_title: form.reference_title,
      interest_calculation_type: form.interest_calculation_type,
      base_percentage: Number(form.base_percentage).toFixed(4),
      fine_rules: JSON.parse(form.fine_rules || "{}"),
      min_loan_amount: Number(form.min_loan_amount).toFixed(2),
      max_loan_amount: Number(form.max_loan_amount).toFixed(2),
      max_term_days: Number(form.max_term_days),
    };

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Use the centralized api instance (with baseURL and withCredentials)
      await api.post("/api/v1/loan-products", payload);
      setMessage("Loan product created successfully.");
      // Reset form
      setForm({
        reference_title: "",
        interest_calculation_type: "flat",
        base_percentage: "1.0000",
        fine_rules: "{}",
        min_loan_amount: "0.00",
        max_loan_amount: "0.00",
        max_term_days: 30,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Request failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated, show a message
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-sm">
        <p className="text-red-600">Please log in to create a loan product.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-sm overflow-y-scroll">
      <h2 className="text-xl font-semibold mb-4">Add Loan Product</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-800 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reference Title
          </label>
          <input
            name="reference_title"
            value={form.reference_title}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-green-800 focus:border-green-700"
            placeholder="School fee Loan"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Interest Calculation Type
          </label>
          <select
            name="interest_calculation_type"
            value={form.interest_calculation_type}
            onChange={handleChange}
            className="border-2 border-slate-300 rounded p-2 w-full my-2">
            <option value="flat">Flat</option>
            <option value="reducing_balance">Reducing Balance</option>
            <option value="compound">Compound</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Base Percentage (%)
            </label>
            <input
              name="base_percentage"
              value={form.base_percentage}
              onChange={handleChange}
              className="border-2 border-slate-300 rounded p-2 w-full my-2"
              placeholder="12.5000"
              step="0.0001"
            />
            <p className="text-xs text-gray-500 mt-1">
              Numeric, up to 4 decimal places.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Term Days
            </label>
            <input
              name="max_term_days"
              type="number"
              value={form.max_term_days}
              onChange={handleChange}
              className="border-2 border-slate-300 rounded p-2 w-full my-2"
              placeholder="180"
              min={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Loan Amount
            </label>
            <input
              name="min_loan_amount"
              value={form.min_loan_amount}
              onChange={handleChange}
              className="border-2 border-slate-300 rounded p-2 w-full my-2"
              placeholder="500.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Loan Amount
            </label>
            <input
              name="max_loan_amount"
              value={form.max_loan_amount}
              onChange={handleChange}
              className="border-2 border-slate-300 rounded p-2 w-full my-2"
              placeholder="25000.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fine Rules (JSON)
          </label>
          <textarea
            name="fine_rules"
            value={form.fine_rules}
            onChange={handleChange}
            className="border-2 border-slate-300 rounded p-2 w-full my-2"
            rows={2}
            placeholder='{"grace_days": 3, "daily_penalty_rate": 0.02}'
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be valid JSON. Optional fields: grace_days, daily_penalty_rate,
            max_penalty_cap.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60">
            {loading ? "Saving..." : "Create Loan Product"}
          </button>

          <div className="text-sm text-gray-500">
            <strong>Tenant</strong>: <span className="ml-1">{tenantId}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLoanProductForm;
