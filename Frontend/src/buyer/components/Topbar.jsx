import { NavLink } from "react-router-dom";
import { Search, Bell, Mail } from "lucide-react";

const topNavItems = [
	{ name: "Market Trends", to: "/buyer/market-trends" },
	{ name: "Community", to: "/buyer/community" },
	{ name: "Support", to: "/buyer/support" },
];

function Topbar({
	userName = "Arjun Thapa",
	userRole = "Buyer",
	userAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
}) {
	const initials = String(userName || "Buyer")
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

	return (
		<header className="flex h-16 min-w-0 items-center justify-between border-b border-[#e7e7e7] bg-white px-5">
			<div className="relative min-w-0 w-full max-w-xs">
				<Search
					size={15}
					className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
				/>
				<input
					type="text"
					placeholder="Search fresh produce, seeds..."
					className="h-10 w-full rounded-full bg-[#f3f4f6] pl-9 pr-4 text-sm text-[#374151] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#d3efe6]"
				/>
			</div>

			<nav className="mx-6 hidden h-full items-center gap-2 xl:flex">
				{topNavItems.map((item) => (
					<NavLink
						key={item.name}
						to={item.to}
						className={({ isActive }) =>
							`inline-flex h-full items-center border-b-2 px-3 text-sm font-medium transition-colors ${
								isActive
									? "border-[#18a37a] text-[#0d7f60]"
									: "border-transparent text-[#6b7280] hover:text-[#24695a]"
							}`
						}
					>
						{item.name}
					</NavLink>
				))}
			</nav>

			<div className="ml-auto flex shrink-0 items-center gap-4">
				<button
					type="button"
					aria-label="Notifications"
					className="text-[#6b7280] transition-colors hover:text-[#24695a]"
				>
					<Bell size={16} />
				</button>
				<button
					type="button"
					aria-label="Messages"
					className="text-[#6b7280] transition-colors hover:text-[#24695a]"
				>
					<Mail size={16} />
				</button>

				<div className="flex items-center gap-2 border-l border-[#ececec] pl-3">
					<div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-[#d2eee6] to-[#9fd4c5] p-[2px] shadow-sm">
						<div className="h-full w-full overflow-hidden rounded-full bg-[#dbe8e3]">
							<img
								src={userAvatar}
								alt={userName}
								className="h-full w-full object-cover"
							/>
						</div>
						<span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#22c55e]" />
					</div>
					<div className="hidden sm:block">
						<p className="max-w-[120px] truncate text-xs font-semibold leading-tight text-[#1f2937]">
							{userName || initials}
						</p>
						<span className="mt-1 inline-flex rounded-full bg-[#edf6f2] px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-[#2d7d6b]">
							{userRole}
						</span>
					</div>
				</div>
			</div>
		</header>
	);
}

export default Topbar;
