import { useEffect, useState } from "react";
import { BadgeCheck, CircleDollarSign, WalletCards } from "lucide-react";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

export default function AdminPayment() {
  const [payments, setPayments] = useState([]);

  const grossAmount = payments.reduce((sum, item) => sum + Number(item?.amount || 0), 0);
  const successful = payments.filter((item) => item?.status === "success").length;

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/admin/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setPayments([]);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />
        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-900 via-indigo-900 to-sky-700 p-6 text-white shadow-sm md:p-7">
            <h1 className="text-2xl font-semibold md:text-3xl">Payment Control</h1>
            <p className="mt-2 text-sm text-violet-50 md:text-base">Monitor methods, success rates, and payment volume at platform scale.</p>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><WalletCards className="h-4 w-4 text-violet-700" />Transactions</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{payments.length}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><BadgeCheck className="h-4 w-4 text-violet-700" />Successful</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{successful}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><CircleDollarSign className="h-4 w-4 text-violet-700" />Gross Amount</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">NPR {grossAmount.toLocaleString()}</p>
            </article>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Payment ID</th>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Farmer</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((item) => (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{item.paymentId}</td>
                      <td className="px-4 py-3">{item?.bookingId?.buyerId?.name || item?.userId?.name || "Buyer"}</td>
                      <td className="px-4 py-3">{item?.bookingId?.postId?.user?.name || "Farmer"}</td>
                      <td className="px-4 py-3 capitalize">{item?.method || "wallet"}</td>
                      <td className="px-4 py-3">NPR {Number(item?.amount || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">{item?.status || "pending"}</span>
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
