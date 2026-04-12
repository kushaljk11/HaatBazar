import { Bell, Mail, Search } from "lucide-react";

const tabs = [
    { label: "Market Trends", active: true },
    { label: "Community", active: false },
    { label: "Support", active: false },
];

export default function Topbar() {
    return (
        <header className="w-full border-b border-slate-200 bg-white">
            <div className="flex h-16 w-full items-center gap-3 px-4 md:gap-6 md:px-6">
                <div className="relative w-full max-w-[420px] flex-1">
                    <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        placeholder="Search orders, crops, or trends..."
                        className="h-10 w-full rounded-full border border-slate-200 bg-slate-100 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none"
                    />
                </div>

                {/* <nav className="hidden items-center gap-6 md:flex" aria-label="Dashboard navigation">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            type="button"
                            className={[
                                "border-b-2 pb-1 text-sm font-medium transition",
                                tab.active
                                    ? "border-emerald-500 text-emerald-700"
                                    : "border-transparent text-slate-500 hover:text-emerald-700",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav> */}

                <div className="ml-auto flex items-center gap-2 md:gap-3">
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Notifications"
                    >
                        <Bell className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Messages"
                    >
                        <Mail className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700"
                        aria-label="User profile"
                    >
                        KB
                    </button>
                </div>
            </div>
        </header>
    );
}