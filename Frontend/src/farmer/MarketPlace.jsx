import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

export default function MarketPlace() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const quickFilters = [
    "Fresh",
    "Organic",
    "In Stock",
    "High Demand",
    "Nearby",
  ];

  const marketItems = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      price: 120,
      unit: "per kg",
      location: "Kathmandu",
      availability: "In Stock",
      image:
        "https://imgs.search.brave.com/NSrzNBrnm41gehaMIiI_00PsvE0vCiOWrNw3F9m7TNc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNDAy/MjA5MS9wZXhlbHMt/cGhvdG8tNDAyMjA5/MS5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA",
    },
    {
      id: 2,
      name: "Organic Apples",
      category: "Fruits",
      price: 150,
      unit: "per kg",
      location: "Lalitpur",
      availability: "Limited Stock",
      image:
        "https://imgs.search.brave.com/1bv117TUZi6O6IemZ6omEIzw9PMaN8-pzDpvQPiv9Oc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/MDA2MjYzMzMzOTIt/NTlhMjBlNjQ2ZDk3/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1qQjhmR0Z3/Y0d4bGMzeGxibnd3/Zkh3d2ZIeDhNQT09",
    },
    {
      id: 3,
      name: "High-Quality Rice",
      category: "Grains",
      price: 80,
      unit: "per kg",
      location: "Bhaktapur",
      availability: "In Stock",
      image:
        "https://imgs.search.brave.com/3mlE9edr2RDPoZ3mttCu8N8nskPIQlPFqrrnlZw0Fo8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9wYXJi/b2lsZWQtcmljZS1i/b2lsZWQtc2FsZS1y/ZXRhaWwtc2hvcC10/b3AtYW5nbGUtZGF5/LTMwNTMzODQ1NS5q/cGc",
    },
    {
      id: 4,
      name: "Fresh Milk",
      category: "Dairy",
      price: 60,
      unit: "per liter",
      location: "Pokhara",
      availability: "Out of Stock",
      image:
        "https://imgs.search.brave.com/4XrSQz2zHoa9lNvDhTcJhZGDMl1UMvj-HeYwKJ6Bumw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzEv/OTkwLzk0My9zbWFs/bC9mcmVzaC1jb3Vu/dHJ5LW1pbGstaW4t/YS1nbGFzcy1vbi10/aGUtdGFibGUtcGhv/dG8uanBn",
    },
  ];

  function Card() {
    return (
      <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {marketItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
              <p className="text-sm text-slate-600">{item.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-emerald-700">
                  ₹{item.price}
                </span>
                <span className="text-sm text-slate-500">{item.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-500">
                  Location: {item.location}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${item.availability === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {item.availability}
                </span>
              </div>
            </div>
          </div>
        ))}
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
                  />
                </div>

                <select className="rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 xl:col-span-3">
                  <option>Category: All</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                  <option>Dairy</option>
                </select>

                <select className="rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 xl:col-span-3">
                  <option>City: All</option>
                  <option>Kathmandu</option>
                  <option>Lalitpur</option>
                  <option>Bhaktapur</option>
                  <option>Pokhara</option>
                  <option>Chitwan</option>
                </select>
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
          <Card />
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
