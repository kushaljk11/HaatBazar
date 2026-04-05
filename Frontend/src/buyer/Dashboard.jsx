import {
  Heart,
  ShoppingCart,
  MapPin,
  ShieldCheck,
  Package,
  Cloud,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const stats = [
  {
    title: "Active Orders",
    value: "12",
    accent: "text-[#1f6b3f]",
    icon: Package,
  },
  { title: "Wishlist", value: "48", accent: "text-[#0f5f53]", icon: Heart },
  {
    title: "Total Spent",
    value: "24.5k",
    accent: "text-[#0f5f53]",
    icon: ShieldCheck,
  },
];

const recommendedProducts = [
  {
    id: 1,
    name: "Mustang Russet Potatoes",
    location: "Mustang, NP",
    stock: "500kg Stock",
    price: "120",
    unit: "/kg",
    tag: "Organic",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Manang Royal Apples",
    location: "Manang, NP",
    stock: "200kg Stock",
    price: "350",
    unit: "/kg",
    tag: "Premium",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80",
  },
];

const activities = [
  {
    id: 1,
    message: "Price dropped for Buckwheat by 15% in your region.",
    time: "2 hrs ago",
    tone: "bg-[#e3f2de] text-[#417530]",
  },
  {
    id: 2,
    message: "Seller Ramesh Organic Farm uploaded new certifications.",
    time: "Yesterday",
    tone: "bg-[#d9efe9] text-[#2f7e68]",
  },
  {
    id: 3,
    message: "Added Alpaca wool to your favorites list.",
    time: "3 days ago",
    tone: "bg-[#f5e8d9] text-[#9a6a2a]",
  },
];

const orderHistory = [
  {
    id: 1,
    status: "Delivered",
    item: "25kg Organic Honey + 50kg Ginger",
    meta: "Order #HK-92834 • May 24, 2024",
    total: "42,000",
    action: "Reorder",
    color: "bg-[#4b7c19]",
  },
  {
    id: 2,
    status: "In Transit",
    item: "100kg Ilam Orthodox Tea",
    meta: "Order #HK-92831 • May 20, 2024",
    total: "15,500",
    action: "Track",
    color: "bg-[#d8a15d]",
  },
];

const marketHighlights = [
  {
    id: 1,
    crop: "Ilam Orthodox Tea",
    region: "Ilam",
    note: "Weekly average",
    price: "Rs 1,550 /kg",
  },
  {
    id: 2,
    crop: "Mustang Potato",
    region: "Mustang",
    note: "Stable this week",
    price: "Rs 120 /kg",
  },
  {
    id: 3,
    crop: "Jumla Beans",
    region: "Jumla",
    note: "Weekly average",
    price: "Rs 280 /kg",
  },
];

function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="h-32 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-3 p-4">
        <span className="inline-flex rounded-full bg-[#ebf4e8] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#5f7b45]">
          {product.tag}
        </span>
        <div>
          <h3 className="text-xl font-semibold leading-tight text-[#1f2937]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-[#6b7280]">
            <MapPin className="mr-1 inline-block" size={13} />
            {product.location}
            <span className="mx-2">•</span>
            {product.stock}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold leading-none text-[#0f5f53]">
            {product.price}
            <span className="ml-1 text-base font-medium text-[#6b7280]">
              {product.unit}
            </span>
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#014d40] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#066454]"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

function BuyerDashboard() {
  return (
    <div className="flex min-h-screen bg-[#edf0ee] text-[#1f2937]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="grid flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-12">
          <section className="space-y-6 xl:col-span-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight text-[#143d35]">
                Namaste, Arjun!
              </h1>
              <p className="text-sm text-[#6b7280]">
                Your local harvest insights are ready for today.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article
                      key={card.title}
                      className="rounded-3xl border border-[#67ffab] bg-[#f2f3f2] p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                        {card.title}
                      </p>
                      <div className="mt-3 flex items-end justify-between">
                        <p
                          className={`text-3xl font-semibold leading-none ${card.accent}`}
                        >
                          {card.value}
                        </p>
                        <Icon size={18} className={card.accent} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#263238]">
                  Recommended for You
                </h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#2d7d6b] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {recommendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold text-[#263238]">
                Order History
              </h2>
              <div className="space-y-5">
                {orderHistory.map((order) => (
                  <article
                    key={order.id}
                    className="flex flex-col gap-4 border-l border-[#d9e4de] pl-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-2 h-2.5 w-2.5 rounded-full ${order.color}`}
                      />
                      <div>
                        <p className="text-xs font-semibold tracking-[0.14em] text-[#6b7280]">
                          {order.status}
                        </p>
                        <h3 className="text-lg font-semibold text-[#1f2937]">
                          {order.item}
                        </h3>
                        <p className="text-xs text-[#9ca3af]">{order.meta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-semibold text-[#0f5f53]">
                        Rs {order.total}
                      </p>
                      <button
                        type="button"
                        className="rounded-full border border-[#d3d9d7] px-4 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#f5f7f6]"
                      >
                        {order.action}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-5 xl:col-span-4">
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#1f2937]">Market Snapshot</h2>
                  <p className="text-xs text-[#9ca3af]">Current rates for your preferred crops</p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#eef4f1] px-3 py-1 text-[11px] font-semibold text-[#2d7d6b]"
                >
                  This Week
                </button>
              </div>

              <div className="space-y-3">
                {marketHighlights.map((item) => {
                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-[#e4ece8] bg-[#f8fbf9] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-[#1f2937]">{item.crop}</h3>
                          <p className="mt-0.5 text-xs text-[#94a3b8]">{item.region}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#0f5f53]">{item.price}</p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-[#edf3f0] px-2 py-1 text-[11px] font-semibold text-[#5f6f68]">
                          {item.note}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-semibold text-[#2d7d6b] hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-[#1f2937]">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <article key={activity.id} className="flex gap-3">
                    <span
                      className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${activity.tone}`}
                    >
                      •
                    </span>
                    <div>
                      <p className="text-sm text-[#475569]">
                        {activity.message}
                      </p>
                      <p className="mt-1 text-xs text-[#9ca3af]">
                        {activity.time}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-full bg-[#f6f8f7] py-2 text-xs font-semibold text-[#64748b] transition-colors hover:bg-[#eef2f1]"
              >
                Clear All Notifications
              </button>
            </section>

            {/* <section className="rounded-3xl bg-[#0f5f53] p-5 text-white shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b7dbd1]">
                Today&apos;s Forecast
              </p>
              <div className="mt-2 flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Kathmandu</h3>
                <Cloud size={20} className="text-[#9fdfca]" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl font-semibold leading-none">24°C</p>
                <p className="text-sm text-[#d8efe8]">
                  Humidity
                  <br />
                  <span className="text-xl font-semibold text-white">65%</span>
                </p>
              </div>
              <p className="mt-2 text-xs text-[#b7dbd1]">
                Optimal for leaf delivery
              </p>
            </section> */}
          </aside>
        </main>
      </div>
    </div>
  );
}

export default BuyerDashboard;
