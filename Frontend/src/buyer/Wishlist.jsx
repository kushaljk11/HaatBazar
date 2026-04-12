import { useEffect, useMemo, useState } from "react";
import { Heart, MapPin, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "../utils/axios";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your wishlist.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalized = (Array.isArray(response?.data) ? response.data : [])
          .map((entry) => ({
            id: entry?._id,
            postId: entry?.postId?._id,
            title: entry?.postId?.postTitle || "Untitled Produce",
            category: entry?.postId?.category || "General",
            location: entry?.postId?.postLocation || "Location unavailable",
            image:
              entry?.postId?.postImage ||
              "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80",
            price: Number(entry?.postId?.price || 0),
            quantity: Number(entry?.postId?.quantity || 0),
            seller: entry?.postId?.user?.name || "Local Farmer",
          }))
          .filter((item) => item.postId);

        setWishlistItems(normalized);
      } catch (fetchError) {
        const message =
          fetchError?.response?.data?.message ||
          "Failed to load wishlist items.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const visibleItems = useMemo(() => {
    return wishlistItems.filter((item) => {
      const searchable = `${item.title} ${item.category} ${item.location} ${item.seller}`.toLowerCase();
      return searchable.includes(searchQuery.toLowerCase());
    });
  }, [wishlistItems, searchQuery]);

  const removeFromWishlist = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token || !postId) {
      return;
    }

    try {
      await api.delete(`/wishlist/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems((prev) => prev.filter((item) => item.postId !== postId));
    } catch {
      setError("Unable to remove item from wishlist.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />

        <main className="h-full w-full overflow-y-auto bg-[#f6f8f7] p-4 md:p-6">
          <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-800">My Wishlist</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Keep your favorite produce in one place and open details anytime.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                {wishlistItems.length} saved items
              </div>
            </div>

            <div className="mt-4 relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search saved produce, seller, location..."
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>

            {error ? (
              <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
            ) : null}
          </section>

          <section className="mt-6">
            {isLoading ? (
              <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                Loading wishlist...
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-base font-semibold text-slate-700">No wishlist items found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Explore marketplace and save crops you want to buy later.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/buyer/marketplace")}
                  className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-44 w-full object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-800">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">Seller: {item.seller}</p>

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="font-semibold text-emerald-700">NPR {item.price}</span>
                        <span className="text-slate-500">{item.quantity} kg</span>
                      </div>

                      <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/buyer/marketplace/${item.postId}`)}
                          className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                        >
                          View Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.postId)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
