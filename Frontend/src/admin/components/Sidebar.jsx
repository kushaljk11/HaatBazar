import {
  CalendarCheck,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutGrid,
  LogOut,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, route: "/admin/dashboard" },
  { label: "Users", icon: Users, route: "/admin/users" },
  { label: "Post Approval", icon: ShieldCheck, route: "/admin/posts" },
  { label: "Bookings", icon: CalendarCheck, route: "/admin/bookings" },
  { label: "Orders", icon: ShoppingCart, route: "/admin/orders" },
  { label: "Payments", icon: CreditCard, route: "/admin/payments" },
  { label: "Logs", icon: FileText, route: "/admin/log" },
  { label: "Settings", icon: Settings, route: "/admin/settings" },
];

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const currentPath = window.location.pathname;

  useEffect(() => {
    const toggleSidebar = () => setIsMobileOpen((prev) => !prev);
    const closeSidebar = () => setIsMobileOpen(false);

    window.addEventListener("toggle-admin-sidebar", toggleSidebar);
    window.addEventListener("close-admin-sidebar", closeSidebar);

    return () => {
      window.removeEventListener("toggle-admin-sidebar", toggleSidebar);
      window.removeEventListener("close-admin-sidebar", closeSidebar);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
    {isMobileOpen ? (
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-900/30 md:hidden"
        onClick={() => setIsMobileOpen(false)}
        aria-label="Close sidebar overlay"
      />
    ) : null}

    <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 md:static md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-2 flex items-center justify-end md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="rounded-lg border border-emerald-200 p-2 text-emerald-800"
          aria-label="Close admin menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-6">
        <p className="text-[22px] font-semibold leading-5 text-slate-900">HamroKrishi</p>
        <p className="text-[11px] text-slate-500">Admin Panel</p>
      </div>

      <hr className="mb-6 border-slate-200" />

      <nav className="space-y-1" aria-label="Admin sidebar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.route || currentPath.startsWith(`${item.route}/`);

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setIsMobileOpen(false);
                window.location.href = item.route;
              }}
              className={[
                "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                isActive
                  ? "bg-emerald-800 font-semibold text-white"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => (window.location.href = "/contact")}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          <CircleHelp className="h-4 w-4" />
          <span>Help Center</span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}
