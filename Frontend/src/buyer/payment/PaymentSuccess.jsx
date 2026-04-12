import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { base64Decode } from "../../utils/paymentGateway.helper";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");

  const query = new URLSearchParams(location.search);
  const tokenData = query.get("data");
  const decoded = tokenData ? base64Decode(tokenData) : null;

  const productId =
    decoded?.transaction_uuid ||
    query.get("purchase_order_id") ||
    sessionStorage.getItem("current_transaction_id");
  const pidx = query.get("pidx");

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token || !productId) {
        setStatus("FAILED");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.post(
          "/payment/payment-status",
          { product_id: productId, pidx },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setStatus(response?.data?.status || "FAILED");
      } catch {
        setStatus("FAILED");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [productId, pidx]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-slate-500">Verifying payment...</p>
      </div>
    );
  }

  if (status !== "COMPLETED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Payment Verification Failed</h1>
        <p className="mt-2 text-sm text-slate-500">Your payment could not be verified automatically.</p>
        <button onClick={() => navigate("/buyer/payment")} className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">Back to Payments</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-9 w-9 text-emerald-800" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Payment Successful</h1>
      <p className="mt-2 text-sm text-slate-500">Your transaction has been verified successfully.</p>
      <p className="mt-2 text-xs text-slate-500">Reference: {productId}</p>
      <button onClick={() => navigate("/buyer/payment")} className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700">Go to Payments</button>
    </div>
  );
}
