import { useEffect, useState } from "react";
import { Boxes, CircleDollarSign, Truck } from "lucide-react";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);

  const totalRevenue = orders.reduce((sum, item) => sum + Number(item?.totalPrice || 0), 0);
  const delivered = orders.filter((item) => item?.orderStatus === "delivered").length;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />
        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-700 p-6 text-white shadow-sm md:p-7">
            <h1 className="text-2xl font-semibold md:text-3xl">Order Intelligence</h1>
            <p className="mt-2 text-sm text-blue-50 md:text-base">Track order lifecycle, delivery progress, and commercial volume.</p>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><Boxes className="h-4 w-4 text-indigo-700" />Total Orders</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{orders.length}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><Truck className="h-4 w-4 text-indigo-700" />Delivered</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{delivered}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><CircleDollarSign className="h-4 w-4 text-indigo-700" />Revenue</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">NPR {totalRevenue.toLocaleString()}</p>
            </article>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Farmer</th>
                    <th className="px-4 py-3">Post</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{item.orderId}</td>
                      <td className="px-4 py-3">{item?.buyerId?.name || "Buyer"}</td>
                      <td className="px-4 py-3">{item?.postId?.user?.name || "Farmer"}</td>
                      <td className="px-4 py-3">{item?.postId?.postTitle || "Post"}</td>
                      <td className="px-4 py-3">NPR {Number(item?.totalPrice || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800">{item?.orderStatus || "placed"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
