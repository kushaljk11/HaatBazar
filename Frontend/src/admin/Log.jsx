import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarClock, Filter } from "lucide-react";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

const filterOptions = ["All", "Booking", "Order", "Payment", "Post"];

const statusBadgeClass = (status) => {
  const value = String(status || "pending").toLowerCase();
  if (value.includes("approved") || value.includes("success") || value.includes("delivered")) {
    return "bg-emerald-100 text-emerald-800";
  }

  if (value.includes("rejected") || value.includes("failed") || value.includes("cancel")) {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-amber-100 text-amber-700";
};

export default function AdminLog() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [selectedType, setSelectedType] = useState("All");

  const formatTime = (value) => {
    if (!value) return "Unknown time";
    return new Date(value).toLocaleString();
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setActivityLogs([]);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [bookingsResponse, ordersResponse, paymentsResponse, pendingPostsResponse] = await Promise.all([
          api.get("/admin/bookings", { headers }),
          api.get("/admin/orders", { headers }),
          api.get("/admin/payments", { headers }),
          api.get("/pendingposts", { headers }),
        ]);

        const bookingLogs = (Array.isArray(bookingsResponse?.data) ? bookingsResponse.data : []).map((item) => ({
          id: item._id,
          type: "Booking",
          actor: item?.buyerId?.name || "Buyer",
          target: item?.postId?.postTitle || "Post",
          title: `${item?.buyerId?.name || "Buyer"} booked ${item?.postId?.postTitle || "a post"}`,
          status: item?.status || "pending",
          amount: Number(item?.totalPrice || 0),
          time: item?.createdAt,
        }));

        const orderLogs = (Array.isArray(ordersResponse?.data) ? ordersResponse.data : []).map((item) => ({
          id: item._id,
          type: "Order",
          actor: item?.buyerId?.name || "Buyer",
          target: item?.postId?.postTitle || "Post",
          title: `${item?.buyerId?.name || "Buyer"} placed ${item?.orderId || "an order"}`,
          status: item?.orderStatus || "placed",
          amount: Number(item?.totalPrice || 0),
          time: item?.createdAt,
        }));

        const paymentLogs = (Array.isArray(paymentsResponse?.data) ? paymentsResponse.data : []).map((item) => ({
          id: item._id,
          type: "Payment",
          actor: item?.bookingId?.buyerId?.name || item?.userId?.name || "Buyer",
          target: item?.bookingId?.postId?.user?.name || "Farmer",
          title: `${item?.paymentId || "Payment"} received via ${item?.method || "wallet"}`,
          status: item?.status || "pending",
          amount: Number(item?.amount || 0),
          time: item?.paidAt || item?.createdAt,
        }));

        const postLogs =
          (Array.isArray(pendingPostsResponse?.data?.posts) ? pendingPostsResponse.data.posts : []).map((item) => ({
            id: item._id,
            type: "Post",
            actor: item?.user?.name || "Farmer",
            target: item?.postTitle || "Post",
            title: `Pending approval for ${item?.postTitle || "post"}`,
            status: item?.adminApproval || "Pending",
            amount: Number(item?.price || 0),
            time: item?.createdAt,
          }));

        const mergedLogs = [...bookingLogs, ...orderLogs, ...paymentLogs, ...postLogs].sort(
          (a, b) => new Date(b.time || 0) - new Date(a.time || 0),
        );

        setActivityLogs(mergedLogs);
      } catch {
        setActivityLogs([]);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    if (selectedType === "All") return activityLogs;
    return activityLogs.filter((item) => item.type === selectedType);
  }, [activityLogs, selectedType]);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />

        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-sm md:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Operations Audit</p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">Recent Platform Logs</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-100 md:text-base">
              Track recent booking, order, payment, and post approval events in one timeline.
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Filter className="h-4 w-4 text-emerald-700" />
                Filter
              </div>
              {filterOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedType(item)}
                  className={[
                    "rounded-xl px-3 py-2 text-sm font-semibold transition",
                    selectedType === item
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length ? (
                    filteredLogs.map((item) => (
                      <tr key={`${item.type}-${item.id}`} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-800">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.actor}</td>
                        <td className="px-4 py-3 text-slate-600">{item.target}</td>
                        <td className="px-4 py-3 text-slate-700">NPR {Number(item.amount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{formatTime(item.time)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={7}>
                        No logs found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Activity className="h-4 w-4 text-emerald-700" /> Activity Distribution
              </h3>
              <p className="mt-2 text-sm text-slate-600">Total events shown: {filteredLogs.length}</p>
              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                <p>Bookings: {filteredLogs.filter((item) => item.type === "Booking").length}</p>
                <p>Orders: {filteredLogs.filter((item) => item.type === "Order").length}</p>
                <p>Payments: {filteredLogs.filter((item) => item.type === "Payment").length}</p>
                <p>Posts: {filteredLogs.filter((item) => item.type === "Post").length}</p>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <CalendarClock className="h-4 w-4 text-emerald-700" /> Latest Event
              </h3>
              {filteredLogs[0] ? (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-slate-800">{filteredLogs[0].title}</p>
                  <p className="mt-1 text-sm text-slate-600">{formatTime(filteredLogs[0].time)}</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No events available.</p>
              )}
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}