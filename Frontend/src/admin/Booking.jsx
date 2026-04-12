import { useEffect, useState } from "react";
import { CalendarRange, PackageCheck, Wallet } from "lucide-react";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

export default function AdminBooking() {
  const [bookings, setBookings] = useState([]);

  const totalValue = bookings.reduce((sum, item) => sum + Number(item?.totalPrice || 0), 0);
  const confirmed = bookings.filter((item) => item?.status === "confirmed").length;

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(Array.isArray(response?.data) ? response.data : []);
      } catch {
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />
        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-900 via-teal-800 to-emerald-800 p-6 text-white shadow-sm md:p-7">
            <h1 className="text-2xl font-semibold md:text-3xl">Booking Operations</h1>
            <p className="mt-2 text-sm text-cyan-50 md:text-base">Track reservation flow between buyers and farmers in real time.</p>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><CalendarRange className="h-4 w-4 text-cyan-700" />Total Bookings</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{bookings.length}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><PackageCheck className="h-4 w-4 text-cyan-700" />Confirmed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{confirmed}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><Wallet className="h-4 w-4 text-cyan-700" />Booked Value</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">NPR {totalValue.toLocaleString()}</p>
            </article>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Buyer</th>
                    <th className="px-4 py-3">Farmer</th>
                    <th className="px-4 py-3">Post</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((item) => (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{item.bookingId}</td>
                      <td className="px-4 py-3">{item?.buyerId?.name || "Buyer"}</td>
                      <td className="px-4 py-3">{item?.postId?.user?.name || "Farmer"}</td>
                      <td className="px-4 py-3">{item?.postId?.postTitle || "Post"}</td>
                      <td className="px-4 py-3">{Number(item?.quantity || 0)} kg</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-800">{item?.status || "pending"}</span>
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
