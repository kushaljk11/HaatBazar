
import {
    BarChart3,
    CircleHelp,
    LayoutGrid,
    Leaf,
    LogOut,
    PlusCircle,
    Settings,
    ShoppingCart,
    Store,
} from "lucide-react";
import logo from "../../assets/logo.png";

const navItems = [
    { label: "Dashboard", icon: LayoutGrid, Link: "/farmer/dashboard" },
    { label: "Marketplace", icon: Store, Link: "/farmer/marketplace" },
    { label: "Add New Crop", icon: PlusCircle, Link: "/farmer/list-crop" },
    { label: "My Crops", icon: Leaf, Link: "/farmer/my-crops" },
    { label: "Orders", icon: ShoppingCart, Link: "/farmer/orders" },
    { label: "Settings", icon: Settings, Link: "/farmer/settings" },
];

export default function Sidebar() {
    const currentPath = window.location.pathname;

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-emerald-100 bg-white px-4 py-5">
            <div className="mb-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-emerald-800/10">
                    <img src={logo} alt="HamroKrishi" className="h-7 w-7 object-contain" />
                </div>
                <div>
                    <p className="text-[22px] font-semibold leading-5 text-emerald-900">HamroKrishi</p>
                    <p className="text-[11px] text-emerald-700/75">Modern Agronomist</p>
                </div>
            </div>

            <hr className="mb-6 border-emerald-100" />

            <nav className="space-y-1" aria-label="Farmer sidebar">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        currentPath === item.Link ||
                        (item.Link !== "/farmer/dashboard" && currentPath.startsWith(`${item.Link}/`));

                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => (window.location.href = item.Link)}
                            className={[
                                "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                                isActive
                                    ? "bg-emerald-700 font-semibold text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                                    : "text-emerald-700 hover:bg-emerald-100/70",
                            ].join(" ")}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-3 border-t border-emerald-100 pt-4">
                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(4,72,52,0.25)] transition hover:bg-emerald-800"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>List New Crop</span>
                </button>

                <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-emerald-800/80 transition hover:bg-emerald-500 hover:text-white"
                >
                    <CircleHelp className="h-4 w-4" />
                    <span>Help Center</span>
                </button>

                <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-emerald-800/80 transition hover:bg-emerald-100/70"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}