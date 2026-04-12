import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";

const parseTokenPayload = (token) => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const getDashboardPath = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "farmer") return "/farmer/dashboard";
  return "/buyer/dashboard";
};

const navItemClass = ({ isActive }) =>
  [
    "pb-1 text-[13px] transition",
    isActive
      ? "border-b-2 border-emerald-700 font-semibold text-emerald-800"
      : "border-b-2 border-transparent font-medium text-stone-500 hover:text-emerald-700",
  ].join(" ");

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token") || storedUser?.token;

  const payload = token ? parseTokenPayload(token) : null;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const hasValidToken = Boolean(token) && Boolean(payload?.exp) && payload.exp > nowInSeconds;
  const dashboardPath = getDashboardPath(storedUser?.role || payload?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2.5 lg:px-7">
        <Link
          to="/"
          className="inline-flex items-center"
        >
          <img src={logo} alt="HaatBazar" className="h-8 w-auto" />
          <span className="ml-2 text-xl font-semibold text-emerald-900">HaatBazar</span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation text-lg"
        >
          <NavLink to="/" end className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/aboutus" className={navItemClass}>
            About
          </NavLink>
          <NavLink to="/marketplace" className={navItemClass}>
            Marketplace
          </NavLink>
          <NavLink to="/contact" className={navItemClass}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {hasValidToken ? (
            <Link
              to={dashboardPath}
              className="rounded-full bg-emerald-900 px-6 py-2 text-[15px] font-semibold text-white transition hover:bg-emerald-800"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-1 text-[15px] font-medium text-stone-500 transition hover:text-emerald-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-emerald-900 px-6 py-2 text-[15px] font-semibold text-white transition hover:bg-emerald-800"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to={hasValidToken ? dashboardPath : "/login"}
            className="grid h-10 w-10 place-items-center rounded-full bg-emerald-900 text-white"
            aria-label={hasValidToken ? "Open dashboard" : "Open login"}
          >
            <UserRound className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-full border border-emerald-200 text-emerald-900"
            aria-label="Toggle mobile navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/30"
            aria-label="Close mobile menu overlay"
          />

          <aside className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] border-l border-emerald-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Menu</p>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-emerald-200 text-emerald-900"
                aria-label="Close mobile menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 px-5 py-4" aria-label="Mobile navigation">
              <NavLink
                to="/"
                end
                className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/aboutus"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/marketplace"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/contact"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
              {!hasValidToken ? (
                <Link
                  to="/register"
                  className="mt-2 rounded-full bg-emerald-900 px-4 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              ) : null}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
