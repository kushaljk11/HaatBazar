import { useEffect, useMemo, useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { CalendarCheck, Heart, ShoppingCart, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token") || storedUser?.token;
  const userId = storedUser?.id || storedUser?._id || storedUser?.userId;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersResponse, bookingsResponse, marketplaceResponse, wishlistResponse] =
          await Promise.all([
            api.get("/orders/my", { headers }),
            api.get(`/bookings/user/${userId}`, { headers }),
            api.get("/marketplace", { headers }),
            api.get("/wishlist", { headers }),
          ]);

        setOrders(Array.isArray(ordersResponse?.data) ? ordersResponse.data : []);
        setBookings(Array.isArray(bookingsResponse?.data) ? bookingsResponse.data : []);
        setMarketplace(
          Array.isArray(marketplaceResponse?.data?.posts)
            ? marketplaceResponse.data.posts
            : [],
        );
        setWishlistCount(Array.isArray(wishlistResponse?.data) ? wishlistResponse.data.length : 0);
      } catch {
        setOrders([]);
        setBookings([]);
        setMarketplace([]);
        setWishlistCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, userId]);

  const activeOrdersCount = useMemo(
    () => orders.filter((item) => ["placed", "confirmed", "packed", "shipped"].includes(item?.orderStatus)).length,
    [orders],
  );

  const recentlod = useMemo(
    () =>
      orders.slice(0, 3).map((item, index) => ({
        title: item?.orderId || `Order #${index + 1}`,
        description: `${Number(item?.quantity || 0)} kg of ${item?.postId?.postTitle || "produce"}`,
        date: new Date(item?.createdAt || Date.now()).toISOString().slice(0, 10),
        status: item?.orderStatus || "placed",
      })),
    [orders],
  );

  const actioncards = [
    {
      title: "Active Orders",
      description: "View and manage your current active orders.",
      icon: ShoppingCart,
      route: "/buyer/orders",
      value: isLoading ? "Loading..." : String(activeOrdersCount),
    },
    {
      title: "View Bookings",
      description: "Manage your upcoming bookings",
      icon: CalendarCheck,
      route: "/buyer/bookings",
      value: isLoading ? "Loading..." : String(bookings.length),
    },
    {
      title: "Explore Marketplace",
      description: "Discover fresh produce.",
      icon: Store,
      route: "/buyer/marketplace",
      value: isLoading ? "Loading..." : String(marketplace.length),
    },
    {
      title: "Wishlist",
      description: "View and manage your saved items",
      icon: Heart,
      route: "/buyer/wishlist",
      value: isLoading ? "Loading..." : String(wishlistCount),
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <div className="h-full overflow-auto p-4 md:p-6">
          <section className="mb-6 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 rounded-2xl border border-emerald-100 p-5 text-white shadow-sm">
            <h1 className="text-2xl font-semibold text-white">
              Welcome back Mr. {storedUser?.name || "Buyer"}!
            </h1>
            <p className="mt-2 text-sm text-white">
              Here you can manage your orders, explore the marketplace, and
              update your profile.
            </p>
          </section>

          <section className="actioncard">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 cursor-pointer">
              {marketplace.map((item) => (
                <div
                  key={item._id || item.title}
                  onClick={() => navigate(`/buyer/marketplace/${item._id}`, { state: { post: item } })}
                  className="rounded-2xl border border-emerald-100 bg-white shadow-sm -translate-y-2 transition hover:shadow-lg"
                >
                  <img
                    src={item.postImage}
                    alt={item.postTitle}
                    className="h-40 w-full rounded-t-2xl object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.postTitle}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.postDescription?.slice(0, 70) || "Fresh produce from verified farmers."}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-700">
                      NPR {Number(item.price || 0).toLocaleString()} / kg
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.postLocation || "Unknown location"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <h2 className="mb-3 mt-3 text-2xl font-semibold text-slate-800">
            Recommendations
          </h2>

          <section className="Airecommendations grid gap-4 lg:grid-cols-10">
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4">
                {marketplace.slice(0, 2).map((item) => (
                  <div
                    key={item._id || item.title}
                    onClick={() => navigate(`/buyer/marketplace/${item._id}`, { state: { post: item } })}
                    className="cursor-pointer rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <img
                      src={item.postImage}
                      alt={item.postTitle}
                      className="h-40 w-full rounded-t-2xl object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.postTitle}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.postDescription?.slice(0, 70) || "Fresh produce from local farms."}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-emerald-700">
                        NPR {Number(item.price || 0).toLocaleString()} / kg
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.postLocation || "Unknown location"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer lg:col-span-3">
                <h1 className="text-lg mb-2 font-semibold text-slate-900">Recent Orders</h1>
              <div className="space-y-4">
                {recentlod.length ? recentlod.map((order) => (
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
                          ? "text-emerald-800"
                          : order.status === "In Transit"
                            ? "text-emerald-800"
                            : "text-emerald-800"
                      }`}
                    >
                      Status: {order.status}
                    </p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500">No recent orders found.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
