import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, MapPin, Package, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "../utils/axios";

const statusClass = {
  pending: "bg-emerald-100 text-emerald-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-emerald-100 text-emerald-800",
};

export default function FarmerBooking() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState("");

  const fetchBookings = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token") || storedUser?.token;
    const farmerId = storedUser?.id || storedUser?._id;

    if (!token || !farmerId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/bookings/farmer/${farmerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const acceptBooking = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setAcceptingId(id);
      await api.put(
        `/bookings/${id}/farmer-accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Booking accepted");
      await fetchBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept booking");
    } finally {
      setAcceptingId("");
    }
  };

  const pendingCount = useMemo(
    () => bookings.filter((item) => item?.status === "pending").length,
    [bookings],
  );

  const confirmedCount = useMemo(
    () => bookings.filter((item) => item?.status === "confirmed").length,
    [bookings],
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <main className="h-full w-full overflow-y-auto bg-[#f6f8f7] p-4 md:p-6">
          <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-800">Booking Requests</h1>
            <p className="mt-1 text-sm text-slate-600">Review buyer booking requests and accept them.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-800">Pending Requests</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingCount}</p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-800">Accepted</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{confirmedCount}</p>
              </article>
              <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-800">Total Requests</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{bookings.length}</p>
              </article>
            </div>
          </section>

          <section className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading booking requests...</div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">No booking requests yet.</div>
            ) : (
              bookings.map((item) => (
                <article key={item._id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.bookingId}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">{item?.postId?.postTitle || "Produce"}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[item?.status] || "bg-emerald-100 text-emerald-800"}`}>
                      {item?.status || "pending"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
                    <p className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-emerald-800" /> {item?.buyerId?.name || "Buyer"}</p>
                    <p className="inline-flex items-center gap-2"><Package className="h-4 w-4 text-emerald-800" /> {Number(item?.quantity || 0)} kg</p>
                    <p className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-800" /> {item?.pickupTime ? new Date(item.pickupTime).toISOString().slice(0, 10) : "TBD"} ({item?.timeInterval || "N/A"})</p>
                    <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-800" /> {item?.pickupLocation || item?.deliveryAddress || "Location not set"}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">NPR {Number(item?.totalPrice || 0).toLocaleString()}</p>
                    <button
                      type="button"
                      onClick={() => acceptBooking(item._id)}
                      disabled={item?.status !== "pending" || acceptingId === item._id}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {acceptingId === item._id ? "Accepting..." : item?.status === "pending" ? "Accept Booking" : "Accepted"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
