import { useEffect, useMemo, useState } from "react";
import { BadgeDollarSign, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "../utils/axios";

const methodOptions = ["wallet", "esewa", "khalti", "bank_transfer", "cod"];

const methodLabel = {
  wallet: "Wallet",
  esewa: "eSewa",
  khalti: "Khalti",
  bank_transfer: "Bank Transfer",
  cod: "Cash on Delivery",
};

export default function Payment() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState("wallet");
  const [payingOrderId, setPayingOrderId] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [ordersRes, paymentsRes] = await Promise.all([
        api.get("/orders/my", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/payments/my", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : []);
      setPayments(Array.isArray(paymentsRes?.data) ? paymentsRes.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load payment data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unpaidOrders = useMemo(
    () => orders.filter((order) => order?.paymentStatus === "unpaid" && order?.orderStatus !== "cancelled"),
    [orders],
  );

  const paidAmount = useMemo(
    () => payments.filter((p) => p?.status === "success").reduce((sum, p) => sum + Number(p?.amount || 0), 0),
    [payments],
  );

  const payOrder = async (order) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (["esewa", "khalti"].includes(activeMethod)) {
      navigate(
        `/buyer/payment/checkout?amount=${encodeURIComponent(order.totalPrice)}&gateway=${encodeURIComponent(activeMethod)}&orderId=${encodeURIComponent(order.orderId)}`,
      );
      return;
    }

    try {
      setPayingOrderId(order._id);
      await api.post(
        `/payments/order/${order._id}/pay`,
        { method: activeMethod },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Payment successful");
      await fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment failed");
    } finally {
      setPayingOrderId("");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <main className="h-full w-full overflow-y-auto bg-[#f6f8f7] p-4 md:p-6">
          <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-800">Payments</h1>
            <p className="mt-1 text-sm text-slate-600">Pay unpaid orders and track successful transactions.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-emerald-700">Unpaid Orders</p>
                  <CreditCard className="h-4 w-4 text-emerald-700" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{unpaidOrders.length}</p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-emerald-800">Successful Payments</p>
                  <CheckCircle2 className="h-4 w-4 text-emerald-800" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{payments.filter((p) => p?.status === "success").length}</p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-emerald-800">Total Paid</p>
                  <BadgeDollarSign className="h-4 w-4 text-emerald-800" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-900">NPR {paidAmount.toLocaleString()}</p>
              </article>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Pay Outstanding Orders</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {methodOptions.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setActiveMethod(method)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    activeMethod === method
                      ? "bg-emerald-700 text-white"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {methodLabel[method]}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">Loading unpaid orders...</div>
            ) : unpaidOrders.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">No unpaid orders available.</div>
            ) : (
              <div className="mt-4 grid gap-3">
                {unpaidOrders.map((order) => (
                  <article key={order._id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{order.orderId}</p>
                        <h3 className="text-lg font-semibold text-slate-900">{order?.postId?.postTitle || "Produce"}</h3>
                        <p className="text-sm text-slate-600">Total NPR {Number(order.totalPrice || 0).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => payOrder(order)}
                        disabled={payingOrderId === order._id}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Wallet className="h-4 w-4" />
                        {payingOrderId === order._id ? "Processing..." : `Pay with ${methodLabel[activeMethod]}`}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Payment History</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Payment ID</th>
                    <th className="py-2 pr-3 font-semibold">Amount</th>
                    <th className="py-2 pr-3 font-semibold">Method</th>
                    <th className="py-2 pr-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id} className="border-b border-slate-100">
                      <td className="py-3 pr-3 text-slate-800">{payment.paymentId}</td>
                      <td className="py-3 pr-3 text-slate-700">NPR {Number(payment.amount || 0).toLocaleString()}</td>
                      <td className="py-3 pr-3 capitalize text-slate-700">{methodLabel[payment.method] || payment.method}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${payment.status === "success" ? "bg-emerald-100 text-emerald-800" : payment.status === "pending" ? "bg-emerald-100 text-emerald-800" : payment.status === "refunded" ? "bg-emerald-100 text-emerald-800" : "bg-emerald-100 text-emerald-800"}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!isLoading && payments.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">No payment records yet.</div>
              ) : null}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
