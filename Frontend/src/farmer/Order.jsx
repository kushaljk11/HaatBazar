import {
    ArrowRight,
    CircleDollarSign,
    ClipboardCheck,
    Download,
    Package,
    Truck,
} from "lucide-react";
import TopBar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

export default function Orders() {
    const statCards = [
        {
            title: "New Orders",
            value: "04",
            icon: ClipboardCheck,
            tone: "bg-white border-emerald-100",
            iconTone: "bg-emerald-700 text-white",
        },
        {
            title: "Pending Shipments",
            value: "02",
            icon: Truck,
            tone: "bg-white border-emerald-100",
            iconTone: "bg-emerald-700 text-white",
        },
        {
            title: "Total Sales Today",
            value: "Rs 12.4k",
            icon: CircleDollarSign,
            tone: "bg-emerald-900 border-emerald-900",
            iconTone: "bg-white/15 text-white",
            strong: true,
        },
    ];

    const shipments = [
        {
            id: "#ORD-2091",
            customer: "Anjali Sharma",
            initials: "AS",
            product: "Organic Arabica Coffee Beans",
            qty: "5 kg",
            amount: "Rs 4,500",
            status: "Pending",
        },
        {
            id: "#ORD-2088",
            customer: "Binod Karki",
            initials: "BK",
            product: "Mustard Oil (Cold Pressed)",
            qty: "10 Ltr",
            amount: "Rs 3,200",
            status: "Processing",
        },
        {
            id: "#ORD-2085",
            customer: "Sita Maharjan",
            initials: "SM",
            product: "Fresh Himalayan Apples",
            qty: "15 kg",
            amount: "Rs 2,250",
            status: "Shipped",
        },
        {
            id: "#ORD-2079",
            customer: "Prakash Rai",
            initials: "PR",
            product: "Buckwheat Flour (Phapar)",
            qty: "20 kg",
            amount: "Rs 5,000",
            status: "Delivered",
        },
    ];

    const getStatusClass = (status) => {
        if (status === "Pending") return "bg-amber-100 text-amber-800";
        if (status === "Processing") return "bg-sky-100 text-sky-800";
        if (status === "Shipped") return "bg-indigo-100 text-indigo-800";
        return "bg-emerald-100 text-emerald-800";
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <main className="flex h-full min-h-0 w-full flex-col">
                <TopBar />
                <div className="h-full w-full overflow-y-auto bg-[#f9f9f9] p-6">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Orders
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 md:text-base">
                        View and manage your crop orders, track delivery status, and
                        communicate with buyers.
                    </p>
                    <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.title}
                                    className={`rounded-3xl border p-5 shadow-sm ${card.tone}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p
                                                className={`text-xs font-semibold ${
                                                    card.strong ? "text-emerald-100" : "text-slate-500"
                                                }`}
                                            >
                                                {card.title}
                                            </p>
                                            <p
                                                className={`mt-2 text-3xl font-semibold leading-none ${
                                                    card.strong ? "text-white" : "text-emerald-950"
                                                }`}
                                            >
                                                {card.value}
                                            </p>
                                        </div>

                                        <span
                                            className={`grid h-10 w-10 place-items-center rounded-xl ${card.iconTone}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <section className="mt-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Shipments</h2>
                            <div className="flex items-center gap-2">
                                <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
                                    <Download className="h-3.5 w-3.5" />
                                    Export CSV
                                </button>
                                <button className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800">
                                    Filter By Status
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[920px] border-collapse">
                                <thead className="bg-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Order ID</th>
                                        <th className="px-5 py-3 font-semibold">Customer Name</th>
                                        <th className="px-5 py-3 font-semibold">Product</th>
                                        <th className="px-5 py-3 font-semibold">Quantity</th>
                                        <th className="px-5 py-3 font-semibold">Total Amount</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {shipments.map((item) => (
                                        <tr key={item.id} className="hover:bg-emerald-50/40">
                                            <td className="px-5 py-4 text-sm font-semibold text-emerald-800">
                                                {item.id}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
                                                        {item.initials}
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {item.customer}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-700">
                                                {item.product}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-700">{item.qty}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                                {item.amount}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <button className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                            <p>Showing 1 to 4 of 24 results</p>
                            <div className="inline-flex items-center gap-1">
                                <button className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100">
                                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                                </button>
                                <button className="rounded-md bg-emerald-900 px-2.5 py-1 font-semibold text-white">
                                    1
                                </button>
                                <button className="rounded-md px-2.5 py-1 text-slate-600 hover:bg-slate-100">
                                    2
                                </button>
                                <button className="rounded-md px-2.5 py-1 text-slate-600 hover:bg-slate-100">
                                    3
                                </button>
                                <button className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100">
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <p className="text-base font-semibold text-slate-900">Logistics Update</p>
                            <p className="mt-2 text-sm text-slate-600">
                                Route to Mustang is now open. Expect faster delivery for mountain
                                orders this week.
                            </p>
                            <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                                View Logistics Map
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-base font-semibold text-slate-900">Top Demand Items</p>
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                    Trending
                                </span>
                            </div>

                            <div className="mt-4 space-y-3">
                                {[
                                    { name: "Arabica Coffee", width: "72%" },
                                    { name: "Buckwheat Flour", width: "56%" },
                                    { name: "Mustard Oil", width: "44%" },
                                ].map((item) => (
                                    <div key={item.name}>
                                        <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-emerald-700"
                                                style={{ width: item.width }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
        </div>
            </main>
        </div>
    );
}