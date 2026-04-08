import {
  AlertTriangle,
  Archive,
  Leaf,
  Pencil,
  Plus,
  Sprout,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import TopBar from "./components/Topbar";
import SideBar from "./components/Sidebar";

export default function MyCrops() {
  const crops = [
    {
      id: "CRP-2041",
      name: "Himalayan Vine Tomatoes",
      variety: "Grade A Organic",
      region: "Terai Region",
      image:
        "https://imgs.search.brave.com/NSrzNBrnm41gehaMIiI_00PsvE0vCiOWrNw3F9m7TNc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNDAy/MjA5MS9wZXhlbHMt/cGhvdG8tNDAyMjA5/MS5qcGVnP2F1dG89/Y29tcHJlc3MmY3M9/dGlueXNyZ2ImZHBy/PTEmdz01MDA",
      price: 120,
      quantity: 450,
      status: "Active",
      utilization: 72,
    },
    {
      id: "CRP-2042",
      name: "Organic Baby Carrots",
      variety: "Sweet Crunch",
      region: "Kathmandu Valley",
      image:
        "https://imgs.search.brave.com/GNhDSNCYG4PsT1awAuRq3JQPiQSJPblPeD_Kibh3FpA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c3RvY2tzbmFwLmlv/L2ltZy10aHVtYnMv/MjgwaC9jYXJyb3Rz/LXNvaWxfN1NXTEdI/TTc1Qi5qcGc",
      price: 85,
      quantity: 1200,
      status: "Pending Moderation",
      utilization: 48,
    },
    {
      id: "CRP-2043",
      name: "Green Crown Broccoli",
      variety: "Premium Export",
      region: "Nagarkot",
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1000&q=80",
      price: 180,
      quantity: 0,
      status: "Sold Out",
      utilization: 0,
    },
    {
      id: "CRP-2044",
      name: "Red River Potatoes",
      variety: "Starch Content 18%",
      region: "Palpa",
      image:
        "https://imgs.search.brave.com/Esmr46adpo2cONX8GSi0bBp26E7W2gf5xwQUdhFjYR4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Bo/b3RvLTE2ODE4MjY3/ODU4NjgtNzMyNWM4/ZjBlNDE2P2ZtPWpw/ZyZxPTYwJnc9MzAw/MCZpeGxpYj1yYi00/LjEuMCZpeGlkPU0z/d3hNakEzZkRCOE1I/eHpaV0Z5WTJoOE5Y/eDhjRzkwWVhSdmMz/eGxibnd3Zkh3d2ZI/eDhNQT09",
      price: 45,
      quantity: 830,
      status: "Active",
      utilization: 63,
    },
  ];

  const summaryCards = [
    {
      label: "Total Listings",
      value: "14",
      note: "+2 this month",
      icon: Sprout,
      tone: "bg-white border-emerald-100",
      noteTone: "text-emerald-700",
    },
    {
      label: "Total Stock",
      value: "2,480",
      note: "kg total",
      icon: Warehouse,
      tone: "bg-white border-emerald-100",
      noteTone: "text-slate-500",
    },
    {
      label: "Potential Revenue",
      value: "Rs. 84k",
      note: "Estimated",
      icon: TrendingUp,
      tone: "bg-white border-emerald-100",
      noteTone: "text-emerald-700",
    },
    {
      label: "Urgent Actions",
      value: "03",
      note: "Restock needed",
      icon: AlertTriangle,
      tone: "bg-emerald-100/80 border-emerald-200",
      noteTone: "text-emerald-800",
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "bg-emerald-100 text-emerald-800";
    }

    if (status === "Pending Moderation") {
      return "bg-amber-100 text-amber-800";
    }

    return "bg-rose-100 text-rose-800";
  };

  const getInventoryBarClass = (quantity) => {
    if (quantity === 0) {
      return "bg-rose-500";
    }

    if (quantity < 500) {
      return "bg-emerald-600";
    }

    return "bg-emerald-700";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SideBar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <TopBar />
        <main className="flex h-full min-h-0 w-full flex-col overflow-auto ">
          <section className="border border-emerald-100/80 bg-[#f6f8f7] p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  My Crops
                </h1>
                <p className="mt-2 text-sm text-slate-600 md:text-base">
                  Manage your active crop listings and track stock levels across
                  all farm regions.
                </p>
              </div>

              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm">
                  Active (4)
                </button>
                <button className="rounded-lg px-4 py-2 text-sm text-slate-500 transition hover:text-slate-700">
                  <Archive className="mr-1 inline h-4 w-4" />
                  Archived
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className={`rounded-2xl border p-4 ${card.tone}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-500">
                        {card.label}
                      </p>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-700 text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-2xl font-semibold leading-none text-slate-900">
                        {card.value}
                      </p>
                      <p
                        className={`pb-1 text-xs font-semibold ${card.noteTone}`}
                      >
                        {card.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[860px] w-full border-collapse">
                  <thead className="bg-slate-100/90 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Crop Name</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Price (Kg)</th>
                      <th className="px-5 py-4 font-semibold">Inventory</th>
                      <th className="px-5 py-4 font-semibold text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {crops.map((crop) => (
                      <tr key={crop.id} className="hover:bg-emerald-50/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={crop.image}
                              alt={crop.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-base font-semibold text-slate-900">
                                {crop.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {crop.variety} • {crop.region}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(crop.status)}`}
                          >
                            {crop.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          Rs. {crop.price}
                        </td>

                        <td className="px-5 py-4">
                          <div className="max-w-[180px]">
                            <p
                              className={`text-right text-sm font-semibold ${
                                crop.quantity === 0
                                  ? "text-rose-600"
                                  : "text-slate-800"
                              }`}
                            >
                              {crop.quantity} kg
                            </p>
                            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${getInventoryBarClass(crop.quantity)}`}
                                style={{ width: `${crop.utilization}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="rounded-lg border border-emerald-200 p-2 text-emerald-700 transition hover:bg-emerald-50">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button className="rounded-lg border border-emerald-200 p-2 text-emerald-700 transition hover:bg-emerald-50">
                              <Leaf className="h-4 w-4" />
                            </button>
                            <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                <p className="uppercase tracking-wide">
                  Showing 1-4 of 14 listings
                </p>
                <div className="inline-flex items-center gap-1">
                  <button className="rounded-md bg-white px-3 py-1.5 text-slate-600 transition hover:bg-slate-100">
                    Prev
                  </button>
                  <button className="rounded-md bg-emerald-900 px-3 py-1.5 font-semibold text-white">
                    1
                  </button>
                  <button className="rounded-md bg-white px-3 py-1.5 text-slate-700 transition hover:bg-slate-100">
                    2
                  </button>
                  <button className="rounded-md bg-white px-3 py-1.5 text-slate-700 transition hover:bg-slate-100">
                    3
                  </button>
                  <button className="rounded-md bg-white px-3 py-1.5 text-slate-700 transition hover:bg-slate-100">
                    Next
                  </button>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
