import {
  AlertTriangle,
  Archive,
  Leaf,
  Pencil,
  Plus,
  Sprout,
  Trash2,
  TrendingUp,
  Warehouse,
  X,
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
  const [editingCrop, setEditingCrop] = useState(null);
  const [editForm, setEditForm] = useState({
    postTitle: "",
    postDescription: "",
    postLocation: "",
    price: "",
    quantity: "",
    variety: "",
    minimumOrder: "",
  });

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
      value: `NPR ${potentialRevenue.toLocaleString()}`,
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

  const openEditModal = (crop) => {
    setEditingCrop(crop);
    setEditForm({
      postTitle: crop?.postTitle || "",
      postDescription: crop?.postDescription || "",
      postLocation: crop?.postLocation || "",
      price: String(crop?.price || ""),
      quantity: String(crop?.quantity || ""),
      variety: crop?.variety || "",
      minimumOrder: String(crop?.minimumOrder || ""),
    });
  };

  const closeEditModal = () => {
    setEditingCrop(null);
    setEditForm({
      postTitle: "",
      postDescription: "",
      postLocation: "",
      price: "",
      quantity: "",
      variety: "",
      minimumOrder: "",
    });
  };

  const handleEditInput = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCrop = async () => {
    if (!editingCrop?._id || !token) {
      toast.error("Unable to update crop. Please login again.");
      return;
    }

    try {
      const payload = {
        postTitle: editForm.postTitle.trim(),
        postDescription: editForm.postDescription.trim(),
        postLocation: editForm.postLocation.trim(),
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
        variety: editForm.variety.trim(),
        minimumOrder: Number(editForm.minimumOrder),
      };

      const response = await api.put(`/updatepost/${editingCrop._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = response?.data?.post;
      if (updated) {
        setCrops((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      }

      toast.success("Crop updated successfully");
      closeEditModal();
    } catch (updateError) {
      toast.error(updateError?.response?.data?.message || "Failed to update crop");
    }
  };

  const handleDeleteCrop = async (crop) => {
    if (!crop?._id || !token) {
      toast.error("Unable to delete crop. Please login again.");
      return;
    }

    const isConfirmed = window.confirm(`Delete \"${crop?.postTitle || "this crop"}\"?`);
    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(`/deletepost/${crop._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCrops((prev) => prev.filter((item) => item._id !== crop._id));
      setTotalListing((prev) => Math.max(0, prev - 1));
      toast.success("Crop deleted successfully");
    } catch (deleteError) {
      toast.error(deleteError?.response?.data?.message || "Failed to delete crop");
    }
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
                        const isOwner =
                          String(crop?.user?._id || crop?.user || "") === String(userId || "");
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
                          NPR {Number(crop?.price || 0)}
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
                            <button
                              className="rounded-lg border border-emerald-200 p-2 text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() => openEditModal(crop)}
                              disabled={!isOwner}
                              title="Edit crop"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded-lg border border-emerald-200 p-2 text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={!isOwner}
                              title="Toggle action"
                            >
                              <Leaf className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                              onClick={() => handleDeleteCrop(crop)}
                              disabled={!isOwner}
                              title="Delete crop"
                            >
                              <Trash2 className="h-4 w-4" />
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

          {editingCrop ? (
            <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
              <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Edit Crop</h3>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    name="postTitle"
                    value={editForm.postTitle}
                    onChange={handleEditInput}
                    placeholder="Crop title"
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                  <input
                    name="variety"
                    value={editForm.variety}
                    onChange={handleEditInput}
                    placeholder="Variety"
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                  <input
                    name="postLocation"
                    value={editForm.postLocation}
                    onChange={handleEditInput}
                    placeholder="Location"
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={editForm.price}
                    onChange={handleEditInput}
                    placeholder="Price"
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={editForm.quantity}
                    onChange={handleEditInput}
                    placeholder="Quantity"
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                  <input
                    type="number"
                    name="minimumOrder"
                    min="1"
                    value={editForm.minimumOrder}
                    onChange={handleEditInput}
                    placeholder="Minimum order"
                    className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <textarea
                  name="postDescription"
                  rows="4"
                  value={editForm.postDescription}
                  onChange={handleEditInput}
                  placeholder="Description"
                  className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateCrop}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
