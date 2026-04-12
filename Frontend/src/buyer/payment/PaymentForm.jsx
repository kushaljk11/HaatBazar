import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../utils/axios";
import { generateUniqueId } from "../../utils/paymentGateway.helper";

export default function PaymentForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const orderId = params.get("orderId") || "";
  const amount = params.get("amount") || "";
  const gateway = (params.get("gateway") || "esewa").toLowerCase();
  const postId = params.get("postId") || "";
  const quantity = params.get("quantity") || "";
  const productNameFromQuery = params.get("productName") || "";
  const deliveryAddress = params.get("deliveryAddress") || "";

  const [formData, setFormData] = useState({
    customerName: storedUser?.name || "",
    customerEmail: storedUser?.email || "",
    customerPhone: storedUser?.phone || "",
    productName: orderId ? `Order ${orderId}` : productNameFromQuery || "Order Payment",
    amount,
    paymentGateway: ["esewa", "khalti"].includes(gateway) ? gateway : "esewa",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEsewaForm = (url, fields) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to continue payment");
      return;
    }

    setIsSubmitting(true);

    try {
      const productId = orderId || generateUniqueId();
      sessionStorage.setItem("current_transaction_id", productId);

      const response = await api.post(
        "/payment/initiate-payment",
        {
          ...formData,
          productId,
          amount: Number(formData.amount),
          postId: postId || undefined,
          quantity: quantity ? Number(quantity) : undefined,
          deliveryAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response?.data?.gateway === "esewa") {
        submitEsewaForm(response.data.url, response.data.formData || {});
        return;
      }

      if (response?.data?.url) {
        window.location.href = response.data.url;
        return;
      }

      toast.error("Payment URL not available");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment initiation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-zinc-50"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Gateway Payment</h1>
        <p className="mt-2 text-sm text-slate-500">Complete your payment securely using eSewa or Khalti.</p>

        <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</label>
            <input name="customerName" value={formData.customerName} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
            <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</label>
            <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Method</label>
            <select name="paymentGateway" value={formData.paymentGateway} onChange={handleChange} className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Amount (NPR)</label>
            <input type="number" min="1" name="amount" value={formData.amount} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
