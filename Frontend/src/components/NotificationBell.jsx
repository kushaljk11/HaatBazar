import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import api from "../utils/axios";
import { connectSocket } from "../utils/socket";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await api.get("/notifications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id || user?._id;
    const role = user?.role;
    const socket = connectSocket({ userId, role });

    if (!socket) {
      return;
    }

    const handler = (payload) => {
      setItems((prev) => [payload, ...prev].slice(0, 100));
    };

    socket.on("notification:new", handler);

    return () => {
      socket.off("notification:new", handler);
    };
  }, []);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      await api.put(
        "/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch {
      // no-op
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-800"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 rounded-full bg-emerald-800 px-1.5 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[320px] rounded-xl border border-emerald-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-emerald-100 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">Notifications</p>
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="p-3 text-xs text-slate-500">No notifications yet.</p>
            ) : (
              items.map((item) => (
                <div key={item._id} className={`border-b border-emerald-50 px-3 py-2 ${item.isRead ? "bg-white" : "bg-emerald-50/40"}`}>
                  <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{item.message}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
