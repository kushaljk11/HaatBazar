import { LayoutGrid, Menu, Search, ShieldCheck, ShoppingCart, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../components/NotificationBell";
import UserMenu from "../../components/UserMenu";

export default function AdminTopbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 w-full items-center gap-3 px-4 md:gap-6 md:px-6">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("toggle-admin-sidebar"))}
          className="grid h-9 w-9 place-items-center rounded-full border border-emerald-200 text-emerald-800 md:hidden"
          aria-label="Open admin menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="relative w-full max-w-[420px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users, posts, bookings..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-100 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <NotificationBell />
          <UserMenu />
        </div>
      </div>

      <div className="grid grid-cols-4 border-t border-slate-100 px-2 py-1 md:hidden">
        <button type="button" onClick={() => navigate("/admin/dashboard")} className="grid place-items-center p-2 text-emerald-800">
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => navigate("/admin/posts")} className="grid place-items-center p-2 text-emerald-800">
          <ShieldCheck className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => navigate("/admin/orders")} className="grid place-items-center p-2 text-emerald-800">
          <ShoppingCart className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => navigate("/profile")} className="grid place-items-center p-2 text-emerald-800">
          <UserCircle2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
