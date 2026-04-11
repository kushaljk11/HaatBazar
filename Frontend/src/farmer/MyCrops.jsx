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
import { toast } from "react-hot-toast";
import api from "../utils/axios";
import { useEffect, useMemo, useState } from "react";

export default function MyCrops() {
  const [totalListing, setTotalListing] = useState(0);
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token") || storedUser?.token;
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (!userId || !token) {
        setError("Please login to view your crops.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const headers = { Authorization: `Bearer ${token}` };
        const [listingRes, postsRes] = await Promise.all([
          api.get(`/count/${userId}`, { headers }),
          api.get(`/myposts/${userId}`, { headers }),
        ]);

        setTotalListing(listingRes?.data?.count || 0);
        setCrops(postsRes?.data?.posts || []);
      } catch (fetchError) {
        const message =
          fetchError?.response?.data?.message ||
          "Failed to fetch your crop listings.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, [token, userId]);

  const totalStock = useMemo(
    () => crops.reduce((sum, crop) => sum + Number(crop?.quantity || 0), 0),
    [crops],
  );

  const potentialRevenue = useMemo(
    () =>
      crops.reduce(
        (sum, crop) =>
          sum +
          Number(crop?.price || 0) * Number(crop?.quantity || 0),
        0,
      ),
    [crops],
  );

  const urgentActions = useMemo(
    () =>
      crops.filter(
        (crop) =>
          Number(crop?.quantity || 0) === 0 || crop?.adminApproval !== "Approved",
      ).length,
    [crops],
  );

  const activeCropsCount = useMemo(
    () => crops.filter((crop) => crop?.status !== "Sold Out").length,
    [crops],
  );

  const archivedCropsCount = useMemo(
    () => crops.filter((crop) => crop?.status === "Sold Out").length,
    [crops],
  );

  const maxQuantity = useMemo(
    () => Math.max(...crops.map((crop) => Number(crop?.quantity || 0)), 1),
    [crops],
  );

  const summaryCards = [
    {
      label: "Total Listings",
      value: totalListing,
      note: `${activeCropsCount} active`,
      icon: Sprout,
      tone: "bg-white border-emerald-100",
      noteTone: "text-emerald-700",
    },
    {
      label: "Total Stock",
      value: totalStock.toLocaleString(),
      note: "kg total",
      icon: Warehouse,
      tone: "bg-white border-emerald-100",
      noteTone: "text-slate-500",
    },
    {
      label: "Potential Revenue",
      value: `Rs. ${potentialRevenue.toLocaleString()}`,
      note: "Estimated",
      icon: TrendingUp,
      tone: "bg-white border-emerald-100",
      noteTone: "text-emerald-700",
    },
    {
      label: "Urgent Actions",
      value: String(urgentActions).padStart(2, "0"),
      note: "Needs attention",
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

    if (status === "Rejected") {
      return "bg-rose-100 text-rose-800";
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

  const getStatusLabel = (crop) => {
    if (crop?.adminApproval === "Pending") {
      return "Pending Moderation";
    }

    if (crop?.adminApproval === "Rejected") {
      return "Rejected";
    }

    if (crop?.status === "Sold Out") {
      return "Sold Out";
    }

    return "Active";
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
                  Active ({activeCropsCount})
                </button>
                <button className="rounded-lg px-4 py-2 text-sm text-slate-500 transition hover:text-slate-700">
                  <Archive className="mr-1 inline h-4 w-4" />
                  Archived ({archivedCropsCount})
                </button>
              </div>
            </div>

            {error ? (
              <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>
            ) : null}

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
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-8 text-center text-sm text-slate-500"
                        >
                          Loading your crops...
                        </td>
                      </tr>
                    ) : null}

                    {!isLoading && crops.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-8 text-center text-sm text-slate-500"
                        >
                          No crop listings found. Add a new crop to get started.
                        </td>
                      </tr>
                    ) : null}

                    {!isLoading &&
                      crops.map((crop) => {
                        const statusLabel = getStatusLabel(crop);
                        const quantity = Number(crop?.quantity || 0);
                        const utilization = Math.min(
                          100,
                          Math.round((quantity / maxQuantity) * 100),
                        );

                        return (
                      <tr key={crop._id} className="hover:bg-emerald-50/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                crop?.postImage ||
                                "https://images.pexels.com/photos/4022091/pexels-photo-4022091.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                              }
                              alt={crop?.postTitle || "Crop image"}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-base font-semibold text-slate-900">
                                {crop?.postTitle}
                              </p>
                              <p className="text-xs text-slate-500">
                                {crop?.variety} • {crop?.postLocation}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(statusLabel)}`}
                          >
                            {statusLabel}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          Rs. {Number(crop?.price || 0)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="max-w-[180px]">
                            <p
                              className={`text-right text-sm font-semibold ${
                                quantity === 0
                                  ? "text-rose-600"
                                  : "text-slate-800"
                              }`}
                            >
                              {quantity} kg
                            </p>
                            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${getInventoryBarClass(quantity)}`}
                                style={{ width: `${utilization}%` }}
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
                    );})}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                <p className="uppercase tracking-wide">
                  {crops.length > 0
                    ? `Showing 1-${crops.length} of ${totalListing} listings`
                    : "Showing 0 listings"}
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
