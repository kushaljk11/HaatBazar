import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarCheck,
  CreditCard,
  FileCheck2,
  ShoppingCart,
  UserRound,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

const cardMeta = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "pendingPosts", label: "Pending Posts", icon: FileCheck2 },
  { key: "totalBookings", label: "Bookings", icon: CalendarCheck },
  { key: "totalOrders", label: "Orders", icon: ShoppingCart },
  { key: "totalPayments", label: "Payments", icon: CreditCard },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);

  const formatTime = (value) => {
    if (!value) return "Unknown";
    return new Date(value).toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [dashboardResponse, bookingsResponse, ordersResponse, paymentsResponse, pendingPostsResponse] =
          await Promise.all([
            api.get("/admin/dashboard", { headers }),
            api.get("/admin/bookings", { headers }),
            api.get("/admin/orders", { headers }),
            api.get("/admin/payments", { headers }),
            api.get("/pendingposts", { headers }),
          ]);

        setStats(dashboardResponse?.data || {});

        const recentBookings = (Array.isArray(bookingsResponse?.data) ? bookingsResponse.data : [])
          .slice(0, 5)
          .map((item) => ({
            id: item._id,
            type: "Booking",
            title: `${item?.buyerId?.name || "Buyer"} booked ${item?.postId?.postTitle || "a post"}`,
            status: item?.status || "pending",
            time: item?.createdAt,
          }));

        const recentOrders = (Array.isArray(ordersResponse?.data) ? ordersResponse.data : [])
          .slice(0, 5)
          .map((item) => ({
            id: item._id,
            type: "Order",
            title: `${item?.buyerId?.name || "Buyer"} placed order ${item?.orderId || "N/A"}`,
            status: item?.orderStatus || "placed",
            time: item?.createdAt,
          }));

        const recentPayments = (Array.isArray(paymentsResponse?.data) ? paymentsResponse.data : [])
          .slice(0, 5)
          .map((item) => ({
            id: item._id,
            type: "Payment",
            title: `Payment ${item?.paymentId || "N/A"} via ${item?.method || "wallet"}`,
            status: item?.status || "pending",
            time: item?.paidAt || item?.createdAt,
          }));

        const recentPendingPosts =
          (Array.isArray(pendingPostsResponse?.data?.posts) ? pendingPostsResponse.data.posts : [])
            .slice(0, 5)
            .map((item) => ({
              id: item._id,
              type: "Post",
              title: `Post submitted: ${item?.postTitle || "Untitled"}`,
              status: item?.adminApproval || "Pending",
              time: item?.createdAt,
            }));

        const mergedLogs = [...recentBookings, ...recentOrders, ...recentPayments, ...recentPendingPosts]
          .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
          .slice(0, 10);

        setActivityLogs(mergedLogs);
      } catch {
        setStats({});
        setActivityLogs([]);
      }
    };

    fetchData();
  }, []);

  const healthCards = useMemo(
    () => [
      {
        label: "Farmer Ratio",
        value: `${stats?.totalUsers ? Math.round(((stats?.totalFarmers || 0) / stats.totalUsers) * 100) : 0}%`,
      },
      {
        label: "Buyer Ratio",
        value: `${stats?.totalUsers ? Math.round(((stats?.totalBuyers || 0) / stats.totalUsers) * 100) : 0}%`,
      },
      {
        label: "Total Posts",
        value: Number(stats?.totalPosts || 0),
      },
    ],
    [stats],
  );

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />
        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 p-6 text-white shadow-sm md:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Control Center</p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">Admin Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-emerald-50 md:text-base">
              Monitor users, commerce activity, approvals, and financial flow from one unified workspace.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/admin/log"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                View Full Logs
              </Link>
              <Link
                to="/admin/posts"
                className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Review Pending Posts
              </Link>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cardMeta.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600">{item.label}</p>
                    <Icon className="h-4 w-4 text-emerald-700" />
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{Number(stats?.[item.key] || 0)}</p>
                </article>
              );
            })}
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            {healthCards.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <UserRound className="h-4 w-4 text-emerald-700" />
                  {item.label}
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Activity className="h-5 w-5 text-emerald-700" /> Recent Logs
              </h2>
              <Link to="/admin/log" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Open log page
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {activityLogs.length ? (
                activityLogs.map((item) => (
                  <article key={`${item.type}-${item.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{item.status}</p>
                      <p className="text-xs text-slate-500">{formatTime(item.time)}</p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="px-5 py-6 text-sm text-slate-500">No recent logs to display.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
