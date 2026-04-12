import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import api from "../utils/axios";
import { getAllCities } from "../utils/locationUtils";
import CityAutocomplete from "../components/CityAutocomplete";

export default function MarketPlace() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [marketPosts, setMarketPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const cityOptions = useMemo(() => getAllCities(), []);

  const filteredPosts = useMemo(() => {
    if (!cityFilter.trim()) return marketPosts;
    return marketPosts.filter((item) =>
      String(item?.postLocation || "").toLowerCase().includes(cityFilter.toLowerCase()),
    );
  }, [cityFilter, marketPosts]);

  // Fetch marketplace posts from the backend
  useEffect(() => {
    const fetchMarketPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Invalid user session. Please login again.");
          return;
        }

        const response = await api.get("/marketplace", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMarketPosts(response?.data?.posts ?? []);
      } catch (error) {
        console.error("Error fetching marketplace posts:", error);
      }
    };
    fetchMarketPosts();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Please Login to access the marketplace.");
          return;
        }
        const response = await api.get("/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: { keyword: searchQuery },
        });
        setMarketPosts(response?.data?.posts ?? []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchQuery.trim() !== "") {
      fetchSearchResults();
    } else {
      // If search query is empty, refetch all marketplace posts
      const fetchMarketPosts = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Please Login to access the marketplace.");
            return;
          }
          const response = await api.get("/marketplace", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMarketPosts(response?.data?.posts ?? []);
        } catch (error) {
          console.error("Error fetching marketplace posts:", error);
        }
      };
      fetchMarketPosts();
    }
  }, [searchQuery]);

  const quickFilters = [
    "Fresh",
    "Organic",
    "In Stock",
    "High Demand",
    "Nearby",
  ];

  function Card() {
    return (
      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPosts.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <img
              src={item.postImage}
              alt={item.postTitle}
              className="h-48 w-full rounded-t-2xl object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-800">
                {item.postTitle}
              </h3>
              <p className="text-sm text-slate-600">{item.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xl font-bold text-emerald-700">
                  Rs {item.price}
                </span>
                <span className="text-sm text-slate-500">
                  Qty: {item.quantity} kg
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Location: {item.postLocation}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full rounded-2xl border border-emerald-100 bg-white p-6 text-center text-slate-600">
            No marketplace posts found.
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <main className="h-full w-full overflow-y-auto bg-[#f9f9f9] p-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Market Place
            </h1>
            <p className="mt-1 text-gray-600">
              Explore the market place and manage your crops effectively.
            </p>
          </div>
          <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid w-full gap-3 xl:max-w-4xl xl:grid-cols-12">
                <div className="relative xl:col-span-6">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700/70" />
                  <input
                    type="text"
                    placeholder="Search crops, sellers, location..."
                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select className="rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 xl:col-span-3">
                  <option>Category: All</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                  <option>Dairy</option>
                </select>

                <CityAutocomplete
                  value={cityFilter}
                  onChange={setCityFilter}
                  options={cityOptions}
                  placeholder="City: All"
                  showAllOption
                  allOptionLabel="City: All"
                  containerClassName="xl:col-span-3"
                  inputClassName="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                />
              </div>

              <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
                <select className="rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500">
                  <option>Sort: Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>

                <button
                  type="button"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 whitespace-nowrap"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showAdvanced ? "Hide Advanced" : "Advanced Filters"}
                </button>
              </div>
            </div>

            {/* <div className="mt-4 flex flex-wrap gap-2">
                            {quickFilters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                                >
                                    {filter}
                                </button>
                            ))}
                        </div> */}

            {showAdvanced && (
              <div className="mt-5 grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Crop Type
                  </label>
                  <select className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500">
                    <option>All Types</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Grains</option>
                    <option>Dairy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Availability
                  </label>
                  <select className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500">
                    <option>Any Status</option>
                    <option>In Stock</option>
                    <option>Limited Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Min Price (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Max Price (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2 xl:col-span-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    District
                  </label>
                  <select className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500">
                    <option>All Districts</option>
                    <option>Kathmandu</option>
                    <option>Lalitpur</option>
                    <option>Bhaktapur</option>
                    <option>Chitwan</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2 xl:col-span-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Certification
                  </label>
                  <select className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500">
                    <option>All</option>
                    <option>Organic Certified</option>
                    <option>Local Verified</option>
                    <option>Premium Quality</option>
                  </select>
                </div>

                <div className="md:col-span-2 xl:col-span-2 flex flex-wrap items-end justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* marketplace items grid */}
          <Card />

          <button
            type="button"
            className="mt-6 block mx-auto rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Load More
          </button>
        </main>
      </div>
    </div>
  );
}
