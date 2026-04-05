import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Store,
  History,
  ShoppingCart,
  Bookmark,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", to: "/buyer/dashboard", icon: LayoutGrid },
  { name: "Marketplace", to: "/buyer/marketplace", icon: Store },
  { name: "Order History", to: "/buyer/order-history", icon: History },
  { name: "Cart", to: "/buyer/cart", icon: ShoppingCart },
  { name: "Saved Post", to: "/buyer/saved-post", icon: Bookmark },
  { name: "Settings", to: "/buyer/settings", icon: Settings },
];

const bottomNavItems = [
  { name: "Help Center", to: "/help", icon: CircleHelp },
  { name: "Logout", to: "/logout", icon: LogOut },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[#ccd7d3] bg-[#dbe5e2] text-[#0d5a4f]">
      <div className="px-6 pt-8 pb-5">
        <h2 className="text-[24px] font-semibold leading-none tracking-tight">
          Hamro Krishi
        </h2>
      </div>

      <nav className="px-3">
        <ul className="space-y-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`);

            return (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={`flex h-11 items-center gap-3 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#b7dfcb] text-[#0d5a4f]"
                      : "text-[#2e7b6b] hover:bg-[#cbe0d7]"
                  }`}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.4 : 2} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-[#ccd7d3] px-3 py-5">
        <ul className="space-y-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isLogout = item.to === "/logout";

            return (
              <li key={item.name}>
                {isLogout ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-10 w-full items-center gap-3 rounded-full px-4 text-sm font-medium text-[#2e7b6b] transition-colors duration-200 hover:bg-[#cbe0d7]"
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    className="flex h-10 items-center gap-3 rounded-full px-4 text-sm font-medium text-[#2e7b6b] transition-colors duration-200 hover:bg-[#cbe0d7]"
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
