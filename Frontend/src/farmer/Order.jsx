import { CheckCircle2, CircleDollarSign, ClipboardCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import TopBar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import api from "../utils/axios";

const statusClass = {
    placed: "bg-emerald-100 text-emerald-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    packed: "bg-emerald-100 text-emerald-800",
    shipped: "bg-emerald-100 text-emerald-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-emerald-100 text-emerald-800",
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [acceptingOrderId, setAcceptingOrderId] = useState("");

    const fetchOrders = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const token = localStorage.getItem("token") || storedUser?.token;
        const farmerId = storedUser?.id || storedUser?._id;

        if (!token || !farmerId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.get(`/orders/farmer/${farmerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load farmer orders");
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const acceptOrder = async (orderId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        try {
            setAcceptingOrderId(orderId);
            await api.put(
                `/orders/${orderId}/farmer-accept`,
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            );
            toast.success("Order accepted successfully");
            await fetchOrders();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to accept order");
        } finally {
            setAcceptingOrderId("");
        }
    };

    const pendingCount = useMemo(
        () => orders.filter((item) => item?.orderStatus === "placed").length,
        [orders],
    );
    const acceptedCount = useMemo(
        () => orders.filter((item) => item?.orderStatus === "confirmed").length,
        [orders],
    );
    const totalValue = useMemo(
        () => orders.reduce((sum, item) => sum + Number(item?.totalPrice || 0), 0),
        [orders],
    );

    const statCards = [
        {
            title: "Pending Requests",
            value: String(pendingCount).padStart(2, "0"),
            icon: ClipboardCheck,
            tone: "bg-white border-emerald-100",
            iconTone: "bg-emerald-700 text-white",
        },
        {
            title: "Accepted Orders",
            value: String(acceptedCount).padStart(2, "0"),
            icon: Truck,
            tone: "bg-white border-emerald-100",
            iconTone: "bg-emerald-700 text-white",
        },
        {
            title: "Total Order Value",
            value: `NPR ${totalValue.toLocaleString()}`,
            icon: CircleDollarSign,
            tone: "bg-emerald-900 border-emerald-900",
            iconTone: "bg-white/15 text-white",
            strong: true,
        },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <main className="flex h-full min-h-0 w-full flex-col">
                <TopBar />
                <div className="h-full w-full overflow-y-auto bg-[#f9f9f9] p-6">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Order Requests</h1>
                    <p className="mt-2 text-sm text-slate-600 md:text-base">
                        Review orders from buyers and accept requests to confirm processing.
                    </p>

                    <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div key={card.title} className={`rounded-3xl border p-5 shadow-sm ${card.tone}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className={`text-xs font-semibold ${card.strong ? "text-emerald-100" : "text-slate-500"}`}>
                                                {card.title}
                                            </p>
                                            <p className={`mt-2 text-3xl font-semibold leading-none ${card.strong ? "text-white" : "text-emerald-950"}`}>
                                                {card.value}
                                            </p>
                                        </div>
                                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${card.iconTone}`}>
                                            <Icon className="h-5 w-5" />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <section className="mt-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">Incoming Orders</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[920px] border-collapse">
                                <thead className="bg-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Order ID</th>
                                        <th className="px-5 py-3 font-semibold">Customer</th>
                                        <th className="px-5 py-3 font-semibold">Product</th>
                                        <th className="px-5 py-3 font-semibold">Quantity</th>
                                        <th className="px-5 py-3 font-semibold">Amount</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {!isLoading && orders.map((item) => (
                                        <tr key={item._id} className="hover:bg-emerald-50/40">
                                            <td className="px-5 py-4 text-sm font-semibold text-emerald-800">{item.orderId}</td>
                                            <td className="px-5 py-4 text-sm text-slate-700">{item?.buyerId?.name || "Buyer"}</td>
                                            <td className="px-5 py-4 text-sm text-slate-700">{item?.postId?.postTitle || "Produce"}</td>
                                            <td className="px-5 py-4 text-sm text-slate-700">{Number(item?.quantity || 0)} kg</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">NPR {Number(item?.totalPrice || 0).toLocaleString()}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[item?.orderStatus] || "bg-emerald-100 text-emerald-800"}`}>
                                                    {item?.orderStatus || "placed"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => acceptOrder(item._id)}
                                                    disabled={item?.orderStatus !== "placed" || acceptingOrderId === item._id}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    {acceptingOrderId === item._id ? "Accepting..." : item?.orderStatus === "placed" ? "Accept" : "Accepted"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {isLoading ? <div className="p-6 text-center text-sm text-slate-500">Loading orders...</div> : null}
                            {!isLoading && orders.length === 0 ? <div className="p-6 text-center text-sm text-slate-500">No orders received yet.</div> : null}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}