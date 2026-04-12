import { useEffect } from "react";
import { XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { base64Decode } from "../../utils/paymentGateway.helper";

export default function PaymentFailure() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const tokenData = query.get("data");
  const decoded = tokenData ? base64Decode(tokenData) : null;
  const productId =
    decoded?.transaction_uuid ||
    query.get("purchase_order_id") ||
    sessionStorage.getItem("current_transaction_id");

  useEffect(() => {
    const markFailed = async () => {
      const token = localStorage.getItem("token");
      if (!token || !productId) {
        return;
      }

      try {
        await api.post(
          "/payment/payment-status",
          { product_id: productId, status: "FAILED" },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch {
        // no-op
      }
    };

    markFailed();
  }, [productId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <XCircle className="h-9 w-9 text-emerald-800" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Payment Failed</h1>
      <p className="mt-2 text-sm text-slate-500">There was an issue processing your payment.</p>
      <p className="mt-2 text-xs text-slate-500">Reference: {productId || "N/A"}</p>
      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">Try Again</button>
        <button onClick={() => navigate("/buyer/payment")} className="rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white">Back to Payments</button>
      </div>
    </div>
  );
}
