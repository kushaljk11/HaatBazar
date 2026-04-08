import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import {
  FaCalendar,
  FaClock,
  FaFileExport,
  FaMoneyBillWave,
  FaShoppingCart,
} from "react-icons/fa";

export default function FarmerDashboard() {
  const actionButtons = [
    {
      label: "Total Earnings",
      icon: FaMoneyBillWave,
      primary: false,
      value: "$12,345",
      description: "Earnings in the last 30 days",
    },
    {
      label: "Active Listing",
      icon: FaFileExport,
      primary: true,
      value: "8 Crops",
      description: "Crops currently listed in the marketplace",
    },
    {
      label: "Active Orders",
      icon: FaShoppingCart,
      primary: true,
      value: "5 Orders",
      description: "Orders currently in progress",
    },
    {
      label: "Pending Approval",
      icon: FaClock,
      primary: false,
      value: "3 Requests",
      description: "Requests awaiting approval",
    },
  ];

  const chartData = [
    { day: "Mon", orders: 18, revenue: 420 },
    { day: "Tue", orders: 24, revenue: 560 },
    { day: "Wed", orders: 21, revenue: 500 },
    { day: "Thu", orders: 31, revenue: 740 },
    { day: "Fri", orders: 27, revenue: 680 },
    { day: "Sat", orders: 36, revenue: 860 },
    { day: "Sun", orders: 29, revenue: 710 },
  ];

  const maxOrders = Math.max(...chartData.map((item) => item.orders));
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const trendPoints = chartData
    .map((item, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = 92 - (item.orders / maxOrders) * 72;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex min-h-screen bg-[#f4f6f6]">
      <Sidebar />

      <main className="flex-1">
        <Topbar />
        <section className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="font-semibold text-2xl">Welcome back, User!</h1>
            <p className="text-slate-600">
              Manage your crops and orders from here.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm transition hover:bg-emerald-100">
              <FaCalendar />
              <span>Last 30 Days</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white hover:text-emerald-700">
              <FaFileExport />
              <span>Export Data</span>
            </button>
          </div>
        </section>


        <section className="px-6 pb-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {actionButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <div
                  key={btn.label}
                  className={`group cursor-pointer rounded-2xl border p-5 hover:shadow-lg ${
                    btn.primary
                      ? "bg-emerald-700 text-white border-emerald-600"
                      : "bg-white text-slate-900 border-slate-200"
                  }`}
                >
                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          btn.primary ? "text-emerald-100" : "text-slate-500"
                        }`}
                      >
                        {btn.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{btn.value}</p>
                    </div>

                    <div
                      className={`rounded-xl p-3 transition-all duration-300 ${
                        btn.primary
                          ? "bg-white group-hover:bg-emerald-300"
                          : "bg-emerald-700 group-hover:bg-emerald-700"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          btn.primary ? "text-emerald-700" : "text-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bottom Description */}
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      btn.primary ? "text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    {btn.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-6 pb-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Weekly Performance</h2>
                  <p className="text-sm text-slate-500">Orders trend with total weekly revenue.</p>
                </div>

                <div className="flex gap-4">
                  <div className="rounded-xl bg-emerald-50 px-3 py-2">
                    <p className="text-xs text-emerald-700">Total Orders</p>
                    <p className="text-lg font-semibold text-emerald-900">
                      {chartData.reduce((sum, item) => sum + item.orders, 0)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-3 py-2">
                    <p className="text-xs text-slate-600">Revenue</p>
                    <p className="text-lg font-semibold text-slate-900">${totalRevenue}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4">
                <svg viewBox="0 0 100 100" className="h-44 w-full" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#d1d5db" strokeWidth="0.4" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="#d1d5db" strokeWidth="0.4" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="#d1d5db" strokeWidth="0.4" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#d1d5db" strokeWidth="0.4" />

                  <polyline
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trendPoints}
                  />
                </svg>

                <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                  {chartData.map((item) => (
                    <div key={item.day}>{item.day}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Recent Log</h2>
                <p className="text-sm text-slate-500">Latest activity from your farm account.</p>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-800">Order #HBZ-1042 confirmed</p>
                  <p className="mt-1 text-xs text-slate-500">12 minutes ago</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-800">Tomato listing updated</p>
                  <p className="mt-1 text-xs text-slate-500">1 hour ago</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-800">Payout of $240 processed</p>
                  <p className="mt-1 text-xs text-slate-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
