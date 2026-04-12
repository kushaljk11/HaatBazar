
import { useEffect, useMemo, useState } from "react";
import {
    CalendarClock,
    CheckCircle2,
    Clock3,
    Filter,
    MapPin,
    Package,
    Search,
    Truck,
    XCircle,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "../utils/axios";

const statusStyle = {
    Upcoming: "bg-emerald-100 text-emerald-800",
    Confirmed: "bg-emerald-100 text-emerald-800",
    Delivered: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-emerald-100 text-emerald-800",
};

const normalizeStatus = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "confirmed") {
        return "Confirmed";
    }

    if (normalized === "delivered") {
        return "Delivered";
    }

    if (normalized === "cancelled") {
        return "Cancelled";
    }

    return "Upcoming";
};

const formatDateLabel = (value) => {
    if (!value) {
        return "TBD";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "TBD";
    }

    return date.toISOString().slice(0, 10);
};

const normalizeBooking = (booking, index) => {
    const safeQuantity = Number(booking?.quantity || 0);
    const safePrice = Number(booking?.totalPrice || 0);

    return {
        id: booking?.bookingId || booking?._id || `BK-${index + 1}`,
        item:
            booking?.postId?.postTitle ||
            booking?.postId?.title ||
            "Booked Produce",
        farmer: booking?.postId?.user?.name || "Farmer Unavailable",
        quantity: `${safeQuantity} kg`,
        price: safePrice,
        pickupDate: formatDateLabel(
            booking?.pickupTime || booking?.deliveryTime || booking?.createdAt,
        ),
        location:
            booking?.pickupLocation ||
            booking?.deliveryAddress ||
            "Location Pending",
        status: normalizeStatus(booking?.status),
    };
};

export default function Booking() {
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "null");
            const token = localStorage.getItem("token") || storedUser?.token;
            const userId = storedUser?.id || storedUser?._id || storedUser?.userId;

            if (!userId) {
                setError("Please login to view your bookings.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const response = await api.get(`/bookings/user/${userId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const rawBookings = Array.isArray(response?.data) ? response.data : [];
                const normalizedBookings = rawBookings.map(normalizeBooking);
                setBookings(normalizedBookings);
            } catch (fetchError) {
                const message =
                    fetchError?.response?.data?.message ||
                    "Failed to fetch bookings from backend.";
                setError(message);
                setBookings([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchStatus =
                statusFilter === "All" || booking.status === statusFilter;
            const searchable = [
                booking.item,
                booking.farmer,
                booking.location,
                booking.id,
            ]
                .join(" ")
                .toLowerCase();
            const matchSearch =
                searchQuery.trim() === "" ||
                searchable.includes(searchQuery.toLowerCase());

            return matchStatus && matchSearch;
        });
    }, [bookings, searchQuery, statusFilter]);

    const upcomingCount = bookings.filter((b) => b.status === "Upcoming").length;
    const confirmedCount = bookings.filter(
        (b) => b.status === "Confirmed"
    ).length;
    const deliveredCount = bookings.filter(
        (b) => b.status === "Delivered"
    ).length;

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="flex h-full min-h-0 w-full flex-col">
                <Topbar />
                <main className="h-full w-full overflow-y-auto bg-[#f6f8f7] p-4 md:p-6">
                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <h1 className="text-2xl font-semibold text-slate-800">My Bookings</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Track upcoming produce pickups, confirm schedules, and review
                            completed bookings.
                        </p>

                        {error ? (
                            <p className="mt-3 text-sm font-medium text-emerald-800">{error}</p>
                        ) : null}

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <article className="rounded-xl border border-emerald-100 bg-emerald-700 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-white">Upcoming</p>
                                    <CalendarClock className="h-4 w-4 text-white" />
                                </div>
                                <p className="mt-2 text-3xl font-semibold text-white">{upcomingCount}</p>
                            </article>

                            <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-emerald-700">Confirmed</p>
                                    <Clock3 className="h-4 w-4 text-emerald-700" />
                                </div>
                                <p className="mt-2 text-3xl font-semibold text-emerald-700">{confirmedCount}</p>
                            </article>

                            <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-emerald-700">Delivered</p>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                                </div>
                                <p className="mt-2 text-3xl font-semibold text-slate-900">{deliveredCount}</p>
                            </article>

                            <article className="rounded-xl border border-slate-200 bg-emerald-700 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-white">Total Bookings</p>
                                    <Package className="h-4 w-4 text-white" />
                                </div>
                                <p className="mt-2 text-3xl font-semibold text-white">
                                    {bookings.length}
                                </p>
                            </article>
                        </div>
                    </section>

                    <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                            <label className="relative block">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by booking ID, crop, farmer, or location..."
                                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                                />
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                            >
                                <option value="All">All Status</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>
                        </div>

                        <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_1fr]">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-800">Upcoming Schedule</h2>

                                {isLoading && (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                                        Loading bookings...
                                    </div>
                                )}

                                {!isLoading &&
                                    filteredBookings
                                    .filter((item) => item.status === "Upcoming" || item.status === "Confirmed")
                                    .map((booking) => (
                                        <article
                                            key={booking.id}
                                            className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        {booking.id}
                                                    </p>
                                                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                                                        {booking.item}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">Farmer: {booking.farmer}</p>
                                                </div>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[booking.status]}`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                                                <p className="inline-flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-emerald-700" />
                                                    {booking.quantity}
                                                </p>
                                                <p className="inline-flex items-center gap-2">
                                                    <CalendarClock className="h-4 w-4 text-emerald-700" />
                                                    Pickup: {booking.pickupDate}
                                                </p>
                                                <p className="inline-flex items-center gap-2 sm:col-span-2">
                                                    <MapPin className="h-4 w-4 text-emerald-700" />
                                                    {booking.location}
                                                </p>
                                            </div>
                                        </article>
                                    ))}

                                {!isLoading &&
                                    filteredBookings.filter(
                                    (item) => item.status === "Upcoming" || item.status === "Confirmed"
                                ).length === 0 && (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                                        No upcoming or confirmed bookings found for this filter.
                                    </div>
                                )}
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <h2 className="text-lg font-semibold text-slate-800">Booking History</h2>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                                <th className="py-2 pr-3 font-semibold">Booking</th>
                                                <th className="py-2 pr-3 font-semibold">Amount</th>
                                                <th className="py-2 pr-3 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!isLoading && filteredBookings.map((booking) => (
                                                <tr key={booking.id} className="border-b border-slate-100">
                                                    <td className="py-3 pr-3">
                                                        <p className="font-semibold text-slate-800">{booking.id}</p>
                                                        <p className="text-xs text-slate-500">{booking.item}</p>
                                                    </td>
                                                    <td className="py-3 pr-3 font-medium text-slate-700">
                                                        NPR {booking.price.toLocaleString()}
                                                    </td>
                                                    <td className="py-3 pr-3">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[booking.status]}`}
                                                        >
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {isLoading && (
                                        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                                            Loading booking history...
                                        </div>
                                    )}

                                    {!isLoading && filteredBookings.length === 0 && (
                                        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                                            No bookings match your search.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                                <Truck className="h-4 w-4" />
                                Request Reschedule
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                <XCircle className="h-4 w-4" />
                                Cancel Booking
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Confirm Pickup
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}