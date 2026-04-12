import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { CalendarCheck, Heart, ShoppingCart, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const actioncards = [
    {
      title: "Active Orders",
      description: "View and manage your current active orders.",
      icon: ShoppingCart,
      route: "/buyer/orders",
      value: "View Orders",
    },
    {
      title: "View Bookings",
      description: "Manage your upcoming bookings",
      icon: CalendarCheck,
      route: "/buyer/bookings",
      value: "Open Bookings",
    },
    {
      title: "Explore Marketplace",
      description: "Discover fresh produce.",
      icon: Store,
      route: "/buyer/marketplace",
      value: "Explore Now",
    },
    {
      title: "Wishlist",
      description: "View and manage your saved items",
      icon: Heart,
      route: "/buyer/wishlist",
      value: "See Wishlist",
    },
  ];

  const marketplace = [
    {
      title: "Fresh Vegetables",
      description:
        "Discover a variety of fresh vegetables directly from local farmers.",
      image:
        "https://imgs.search.brave.com/pxdVAreT2FOJX1mmwoJarbgOq6Xke56IKExxFPYAtdk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2xhcmdlLXByZXZp/ZXdzL2U1MC9mcmVz/aC1jb2xvcmZ1bC12/ZWdldGFibGVzLTA0/MTAtNTcwNjc2Mi5q/cGc_Zm10",
      icon: Store,
      price: "$20 - $50 per kg",
      location: "Kathmandu, Nepal",
      buttonText: "Add to Cart",
      tags: ["Vegetables", "Fresh", "Organic"],
    },
    {
      title: "Seasonal Fruits",
      description:
        "Explore a wide range of seasonal fruits sourced directly from local farmers.",
      image:
        "https://imgs.search.brave.com/Ebn0Mkq9W7lge1NUz8oItKfiFqnYHnL6Z6HZaCzIChw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waWNu/aWN0aW1lcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjUv/MDcvc2Vhc29uYWwt/ZnJ1aXQtYXNzb3J0/bWVudC5qcGc",
      icon: Store,
      price: "$15 - $40 per kg",
      location: "Pokhara, Nepal",
      buttonText: "Add to Cart",
      tags: ["Fruits", "Seasonal", "Fresh"],
    },
    {
      title: "Dairy Products",
      description:
        "Find high-quality dairy products from trusted local farmers.",
      image:
        "https://imgs.search.brave.com/UOduUl7Ct1WSDI1aegxg0fTYovvITAQTwOfD1ecvNWw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzYv/NTM0LzYzMi9zbWFs/bC9haS1nZW5lcmF0/ZWQtaG9tZW1hZGUt/ZGFpcnktcHJvZHVj/dC1vbi1ibHVlLWJh/Y2tncm91bmRzLXBo/b3RvLmpwZw",
      icon: Store,
      price: "$10 - $30 per liter",
      location: "Lalitpur, Nepal",
      buttonText: "Add to Cart",
      tags: ["Dairy", "Fresh", "Local"],
    },
    {
      title: "Organic Grains",
      description:
        "Discover a variety of organic grains sourced directly from local farmers.",
      image:
        "https://imgs.search.brave.com/5LPtg2GgrRpLZmXGHCcGondBiDrxCFmVqc-NdPDJSNE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dHJhZGlub3JnYW5p/Yy5jb20vX25leHQv/aW1hZ2U_dXJsPWh0/dHBzOi8vd3d3LnRy/YWRpbm9yZ2FuaWMu/Y29tL21lZGlhL2Zp/bGVyX3B1YmxpYy83/Ny84Yy83NzhjMjRj/ZC01MmI4LTQzNWMt/YjQ3OC1iNzFmZmY4/MDQwMTAvb3JnYW5p/Y19ncmFpbnMxLmpw/ZyZ3PTM4NDAmcT03/NQ",
      icon: Store,
      price: "$5 - $20 per kg",
      location: "Bhaktapur, Nepal",
      buttonText: "Add to Cart",
      tags: ["Grains", "Organic", "Fresh"],
    },
  ];

  const recentlod = [
    {
      title: "Order #12345",
      description: "2 kg of Fresh Vegetables",
      date: "2024-06-15",
      status: "Delivered",
    },
    {
      title: "Order #12346",
      description: "1 kg of Seasonal Fruits",
      date: "2024-06-18",
      status: "In Transit",
    },
    {
      title: "Order #12347",
      description: "3 liters of Dairy Products",
      date: "2024-06-20",
      status: "Processing",
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <div className="h-full overflow-auto p-4 md:p-6">
          <section className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">
              Welcome to your Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Here you can manage your orders, explore the marketplace, and
              update your profile.
            </p>
          </section>

          <section className="actioncard">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {actioncards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    type="button"
                    onClick={() => navigate(card.route)}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
                  >
                    <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-50 transition group-hover:bg-emerald-100" />

                    <div className="relative flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] font-semibold text-slate-500">
                          {card.title}
                        </p>
                        <h3 className="mt-2 text-[24px] font-semibold leading-none text-slate-900">
                          {card.value}
                        </h3>
                      </div>
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white transition group-hover:bg-emerald-800">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="relative mt-2 text-[12px] leading-6 text-slate-600">
                      {card.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="marketplace">
            <h2 className="mb-6 mt-6 text-2xl font-semibold text-slate-800">
              Explore <span className="text-emerald-800">Marketplace</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 cursor-pointer">
              {marketplace.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-emerald-100 bg-white shadow-sm -translate-y-2 transition hover:shadow-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-40 w-full rounded-t-2xl object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-700">
                      {item.price}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <h2 className="mb-3 mt-3 text-2xl font-semibold text-slate-800">
            Recommendations
          </h2>

          <section className="Airecommendations flex gap-4">
            {/* AI Recommendation - 70% */}
            <div className="w-[70%]">
              <div className="flex flex-wrap gap-4">
                {marketplace.slice(0, 2).map((item) => (
                  <div
                    key={item.title}
                    className="w-[48%] cursor-pointer rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-40 w-full rounded-t-2xl object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.description}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-emerald-700">
                        {item.price}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Log - 30% */}
            <div className="w-[30%]  rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer">
                <h1 className="text-lg mb-2 font-semibold text-slate-900">Recent Orders</h1>
              <div className="space-y-4">
                {recentlod.map((order) => (
                  <div
                    key={order.title}
                    className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <h3 className="text-md font-semibold text-slate-900">
                      {order.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {order.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Date: {order.date}
                    </p>
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "In Transit"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    >
                      Status: {order.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
