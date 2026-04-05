import {
  Heart,
  ShoppingCart,
  MapPin,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BuyerLayout from "../components/BuyerLayout";
import { useCart } from "../../context/CartContext";
import api from "../../utils/axios";

function ProductCard({ product, onAdd }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="h-32 w-full overflow-hidden">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <span className="inline-flex rounded-full bg-[#ebf4e8] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#5f7b45]">
          {product.tag}
        </span>
        <div>
          <h3 className="text-lg font-semibold leading-tight text-[#1f2937]">{product.name}</h3>
          <p className="mt-1 text-lg text-[#6b7280]">
            <MapPin className="mr-1 inline-block" size={13} />
            {product.location}
            <span className="mx-2">•</span>
            {product.stock}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-lg font-semibold leading-none text-[#0f5f53]">
            {product.price}
            <span className="ml-1 text-lg font-medium text-[#6b7280]">/{product.unit}</span>
          </p>
          <button
            onClick={() => onAdd(product)}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#014d40] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#066454]"
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
  const { addItem } = useCart();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/buyer/dashboard");
        setDashboardData(data || null);
      } catch {
        toast.error("Failed to load dashboard data");
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Active Orders",
      value: String(dashboardData?.stats?.activeOrders || 0),
      accent: "text-[#1f6b3f]",
      icon: Package,
    },
    {
      title: "Wishlist",
      value: String(dashboardData?.stats?.wishlist || 0),
      accent: "text-[#0f5f53]",
      icon: Heart,
    },
    {
      title: "Total Spent",
      value: `${Number(dashboardData?.stats?.totalSpentNpr || 0).toLocaleString()}`,
      accent: "text-[#0f5f53]",
      icon: ShieldCheck,
    },
  ];

  const recommendedProducts = (dashboardData?.recommendations || []).slice(0, 2).map((item) => ({
    id: item.id,
    name: item.name,
    location: item.region,
    stock: `${item.stockKg || 0}kg Stock`,
    price: item.price,
    unit: item.unit,
    tag: item.tag || "Fresh",
    vendor: item.farmer,
    image: item.image,
  }));

  const orderHistory = (dashboardData?.orderHistory || []).slice(0, 2).map((order) => ({
    id: order.id,
    status: String(order.status || "").replace("-", " "),
    item: order.title,
    meta: `Order #${order.id} • ${new Date(order.placedOn).toLocaleDateString()}`,
    total: Number(order.totalNpr || 0).toLocaleString(),
    action: order.status === "in-transit" ? "Track" : "Reorder",
    color: order.status === "in-transit" ? "bg-[#d8a15d]" : "bg-[#4b7c19]",
  }));

  const marketSnapshot = dashboardData?.marketSnapshot || [];
  const activities = dashboardData?.activities || [];

  const handleAdd = async (product) => {
    try {
      await addItem(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Could not add item to cart");
    }
  };

  return (
    <BuyerLayout
      title={`Namaste, ${dashboardData?.profile?.name || "Buyer"}!`}
      subtitle="Your local harvest insights are ready for today."
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="space-y-6 xl:col-span-8">
          {isLoading && (
            <article className="rounded-3xl bg-white p-4 text-sm text-[#64748b] shadow-sm">
              Loading dashboard data...
            </article>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="rounded-3xl border border-[#95e7bc] bg-[#f2f3f2] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#64748b]">{card.title}</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className={`text-3xl font-semibold leading-none ${card.accent}`}>{card.value}</p>
                    <Icon size={18} className={`${card.accent} mb-1`} />
                  </div>
                </article>
              );
            })}
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#263238]">Recommended for You</h2>
              <button type="button" className="text-lg font-semibold text-[#2d7d6b] hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={handleAdd} />
              ))}

              {!isLoading && recommendedProducts.length === 0 && (
                <article className="rounded-3xl bg-white p-4 text-sm text-[#64748b] shadow-sm md:col-span-2">
                  No recommended products available right now.
                </article>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-[#263238]">Order History</h2>
            <div className="space-y-5">
              {orderHistory.map((order) => (
                <article
                  key={order.id}
                  className="flex flex-col gap-4 border-l border-[#d9e4de] pl-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-2 h-2.5 w-2.5 rounded-full ${order.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#6b7280]">{order.status}</p>
                      <h3 className="text-sm font-semibold text-[#1f2937]">{order.item}</h3>
                      <p className="text-lg text-[#9ca3af]">{order.meta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-[#0f5f53]">Rs {order.total}</p>
                    <button
                      type="button"
                      className="rounded-full border border-[#d3d9d7] px-4 py-1 text-lg font-semibold text-[#334155] transition-colors hover:bg-[#f5f7f6]"
                    >
                      {order.action}
                    </button>
                  </div>
                </article>
              ))}

              {!isLoading && orderHistory.length === 0 && (
                <article className="rounded-2xl border border-[#e2e8f0] p-4 text-sm text-[#64748b]">
                  No recent orders available.
                </article>
              )}
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
              <span className="rounded-full bg-[#eef4f1] px-3 py-1 text-[11px] font-semibold text-[#2d7d6b]">
                This Week
              </span>
            </div>
            <div className="space-y-3">
              {marketSnapshot.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#e4ece8] bg-[#f8fbf9] p-3">
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
                    <button type="button" className="text-xs font-semibold text-[#2d7d6b] hover:underline">
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#1f2937]">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <article key={activity.id} className="flex gap-3">
                  <span
                    className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${activity.tone}`}
                  >
                    •
                  </span>
                  <div>
                    <p className="text-sm text-[#475569]">{activity.message}</p>
                    <p className="mt-1 text-xs text-[#9ca3af]">{activity.time}</p>
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
        </aside>
      </div>
    </BuyerLayout>
  );
}

export default BuyerDashboard;
