import { useEffect, useMemo, useRef, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "US";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function UserMenu() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const user = useMemo(() => getUserFromStorage(), []);
  const userName = user?.name || "User";
  const initials = getInitials(userName);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800"
        aria-label="Open user menu"
      >
        {initials}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-11 z-40 min-w-[190px] overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-lg">
          <div className="border-b border-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">User Name</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{userName}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/profile");
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-emerald-50"
          >
            <User className="h-4 w-4 text-emerald-700" />
            Profile
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
