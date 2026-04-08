import { ImagePlus, Leaf, PackageSearch, Trash2 } from "lucide-react";
import Topbar from "./components/Topbar";
import SideBar from "./components/Sidebar";

export default function AddNewCrops() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SideBar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <main className="flex h-full min-h-0 w-full flex-col overflow-auto bg-[#f6f8f7] p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl space-y-4 pb-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Add New Crop
              </h1>
              <p className="mt-1 text-sm text-slate-600 md:text-base">
                Publish a crop listing with clean details, pricing, and visuals.
              </p>
            </div>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-700" />
                <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Red Tomatoes"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </label>
                  <select className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white">
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Grains</option>
                    <option>Legumes</option>
                    <option>Herbs and Spices</option>
                    <option>Nuts and Seeds</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Variety
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Roma / Heirloom"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address of Cultivation
                  </label>
                  <select className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white">
                    <option>Kathmandu, Nepal</option>
                    <option>Lalitpur, Nepal</option>
                    <option>Bhaktapur, Nepal</option>
                    <option>Pokhara, Nepal</option>
                    <option>Biratnagar, Nepal</option>
                    <option>Birgunj, Nepal</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9800000000"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <PackageSearch className="h-4 w-4 text-emerald-700" />
                <h2 className="text-lg font-semibold text-slate-900">Pricing and Stock</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price (NPR / KG)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Rs. 0"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock Quantity (KG)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Minimum Order (KG)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="5"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-emerald-700" />
                  <h2 className="text-lg font-semibold text-slate-900">Product Images</h2>
                </div>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Max 5 Photos
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-12">
                <div className="relative overflow-hidden rounded-3xl border border-emerald-100 md:col-span-6">
                  <img
                    src="https://imgs.search.brave.com/NSrzNBrnm41gehaMIiI_00PsvE0vCiOWrNw3F9m7TNc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNDAy/MjA5MS9wZXhlbHMt/cGhvdG8tNDAyMjA5/MS5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA"
                    alt="Primary crop preview"
                    className="h-56 w-full object-cover"
                  />
                  <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-500 shadow-sm transition hover:bg-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 md:col-span-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className="grid h-[110px] place-items-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 text-emerald-700 transition hover:bg-emerald-100/60"
                    >
                      <ImagePlus className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-lg font-semibold text-slate-900">Product Description</h2>
              <p className="mt-1 text-sm text-slate-500">
                Share growing method, soil quality, harvest date, and taste profile.
              </p>

              <textarea
                rows="6"
                placeholder="Describe how these crops were grown, soil health, harvest date, flavor profile, and why buyers should choose this listing..."
                className="mt-3 w-full resize-none rounded-2xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
              />

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
                  Save Draft
                </button>
                <button className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  Publish Crop
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
