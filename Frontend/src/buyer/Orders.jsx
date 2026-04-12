import { useEffect, useMemo, useState } from "react";
import { Clock3, PackageCheck, Search, Truck, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "../utils/axios";

const statusTone = {
  placed: "bg-emerald-100 text-emerald-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  packed: "bg-emerald-100 text-emerald-800",
  shipped: "bg-emerald-100 text-emerald-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-emerald-100 text-emerald-800",
};

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view your orders.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(response?.data) ? response.data : []);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const text = `${order?.orderId || ""} ${order?.postId?.postTitle || ""} ${order?.postId?.postLocation || ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [orders, query]);

  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      await api.post(
        `/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (cancelError) {
      toast.error(cancelError?.response?.data?.message || "Failed to cancel order");
    }
  };

  const activeCount = orders.filter((o) => ["placed", "confirmed", "packed", "shipped"].includes(o?.orderStatus)).length;
  const deliveredCount = orders.filter((o) => o?.orderStatus === "delivered").length;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <main className="h-full w-full overflow-y-auto bg-[#f6f8f7] p-4 md:p-6">
          <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-800">My Orders</h1>
            <p className="mt-1 text-sm text-slate-600">Track placed, shipped, and delivered orders in one place.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-emerald-800">Active Orders</p>
                  <Clock3 className="h-4 w-4 text-emerald-800" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{activeCount}</p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-emerald-700">Delivered</p>
                  <PackageCheck className="h-4 w-4 text-emerald-700" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{deliveredCount}</p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-emerald-800">Total Orders</p>
                  <Truck className="h-4 w-4 text-emerald-800" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{orders.length}</p>
              </article>
            </div>

            <div className="mt-5 relative max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order id, crop, or location"
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {error ? <p className="mt-3 text-sm font-medium text-emerald-800">{error}</p> : null}
          </section>

          <section className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">No orders found.</div>
            ) : (
              filteredOrders.map((order) => (
                <article key={order._id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{order.orderId}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">{order?.postId?.postTitle || "Produce"}</h3>
                      <p className="text-sm text-slate-600">{order?.postId?.postLocation || "Unknown location"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[order?.orderStatus] || "bg-slate-100 text-slate-600"}`}>
                      {order?.orderStatus || "placed"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                    <p>Qty: <span className="font-semibold">{order.quantity} kg</span></p>
                    <p>Total: <span className="font-semibold">NPR {Number(order.totalPrice || 0).toLocaleString()}</span></p>
                    <p>Payment: <span className="font-semibold capitalize">{order.paymentStatus}</span></p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => cancelOrder(order._id)}
                      disabled={["cancelled", "delivered"].includes(order?.orderStatus)}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" /> Cancel Order
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
