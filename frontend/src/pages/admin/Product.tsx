// pages/admin/Product.tsx
import { useEffect, useState, type ComponentType } from "react";
import { Plus, Trash2, RefreshCw, X } from "lucide-react";
import { api } from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import AddLoanProductFormRaw from "../../components/admin/AddLoanProductForm";

const AddLoanProductForm = AddLoanProductFormRaw as ComponentType<{
  onCreated: () => void;
}>;

const Product = () => {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  const [showAddForm, setShowAddForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const apiBase = "/api/v1/loan-products";

  const fetchProducts = async () => {
    if (!tenantId) {
      setTableError("Please log in to view products.");
      return;
    }

    setLoading(true);
    setTableError(null);
    try {
      const res = await api.get(apiBase); // will automatically include tenant_id via auth middleware
      setProducts(Array.isArray(res.data) ? res.data : []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setTableError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProducts();
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const toggleLoanProductForm = () => {
    setShowAddForm((s) => !s);
  };

  const handleCreated = () => {
    setShowAddForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: string | number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`${apiBase}/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  // If user is not logged in, show a message
  if (!user) {
    return (
      <div className="p-6 text-center text-red-600">
        Please log in to manage loan products.
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-semibold text-2xl">Loan Products</h1>
          <p className="text-sm text-gray-600">
            Add and manage loan products clients can select and apply for.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-200 bg-white text-sm hover:bg-gray-50"
            title="Refresh list">
            <RefreshCw size={16} /> Refresh
          </button>

          <button
            onClick={toggleLoanProductForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded text-sm">
            <Plus size={16} /> Add Loan Product
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={toggleLoanProductForm}>
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={toggleLoanProductForm}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-ink/45 transition hover:bg-ink/5 hover:text-ink"
              type="button">
              <X className="h-5 w-5" />
            </button>

            <AddLoanProductForm onCreated={handleCreated} />
          </div>
        </div>
      )}

      <article className="bg-white rounded shadow-sm overflow-x-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              <strong>{products.length}</strong> product
              {products.length !== 1 && "s"}
            </div>
            {loading && <div className="text-sm text-gray-500">Loading...</div>}
          </div>
        </div>

        {tableError && (
          <div className="p-4 text-sm text-red-700 bg-red-50">{tableError}</div>
        )}

        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Interest Type</th>
              <th className="px-4 py-3">Base %</th>
              <th className="px-4 py-3">Min Amount</th>
              <th className="px-4 py-3">Max Amount</th>
              <th className="px-4 py-3">Max Term (days)</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No products found. Add a loan product to get started.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{p.reference_title}</td>
                  <td className="px-4 py-3">{p.interest_calculation_type}</td>
                  <td className="px-4 py-3">{p.base_percentage}</td>
                  <td className="px-4 py-3">{p.min_loan_amount}</td>
                  <td className="px-4 py-3">{p.max_loan_amount}</td>
                  <td className="px-4 py-3">{p.max_term_days}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert("Edit not implemented yet")}
                        className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-100">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 disabled:opacity-60">
                        <Trash2 size={14} />
                        {deletingId === p.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
};

export default Product;
