import { ImagePlus, Leaf, PackageSearch, Trash2 } from "lucide-react";
import Topbar from "./components/Topbar";
import SideBar from "./components/Sidebar";
import { useMemo, useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import {
  getAllCities,
  getDistrictsByProvince,
  getMunicipalitiesByDistrict,
  getProvinces,
} from "../utils/locationUtils";
import CityAutocomplete from "../components/CityAutocomplete";

export default function AddNewCrops() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("vegetables");
  const [tag, setTag] = useState("vegetables");
  const [variety, setVariety] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [postImage, setPostImage] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provinces = useMemo(() => getProvinces(), []);
  const districts = useMemo(() => getDistrictsByProvince(province), [province]);

  const cityOptions = useMemo(() => {
    if (district) {
      return getMunicipalitiesByDistrict(district);
    }

    return getAllCities();
  }, [district]);

  const fetchCreatePost = async () => {
    if (isSubmitting) return;

    if (
      !title.trim() ||
      !description.trim() ||
      !location.trim() ||
      !district.trim() ||
      !variety.trim() ||
      !contactInfo.trim() ||
      !postImage.trim() ||
      !price ||
      !quantity ||
      !minimumOrder
    ) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");
      const userId = storedUser?.id;

      if (!userId) {
        return;
      }
      const toastId = toast.loading("Publishing crop...");

      const postData = {
        postTitle: title.trim(),
        postDescription: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        postLocation: `${location.trim()}, ${district.trim()}`,
        city: location.trim(),
        district: district.trim(),
        category,
        variety: variety.trim(),
        contactInfo: contactInfo.trim(),
        minimumOrder: Number(minimumOrder),
        postImage: postImage.trim(),
        tag,
      };

      const response = await api.post("/create", postData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      toast.success("Post created successfully!", { id: toastId });
      console.log("Post created successfully:", response.data);

      setTitle("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setLocation("");
      setProvince("");
      setDistrict("");
      setCategory("vegetables");
      setTag("vegetables");
      setVariety("");
      setContactInfo("");
      setMinimumOrder("");
      setPostImage("");

      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (err) {
      console.error("Error creating post:", err);
      const message =
        err?.response?.data?.message ||
        "Failed to create post. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsImageUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response?.data?.imageUrl;
      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      setPostImage(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (uploadError) {
      const message =
        uploadError?.response?.data?.message ||
        uploadError?.response?.data?.error ||
        "Failed to upload image";
      setError(message);
      toast.error(message);
    } finally {
      setIsImageUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SideBar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <main className="flex h-full min-h-0 w-full flex-col overflow-auto bg-[#f6f8f7] p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl space-y-4 pb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Add New Crop
              </h1>
              <p className="mt-1 text-sm text-slate-600 md:text-base">
                Publish a crop listing with clean details, pricing, and visuals.
              </p>
            </div>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-700" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Basic Information
                </h2>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="poultry">Poultry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tag
                  </label>
                  <select
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="poultry">Poultry</option>
                    <option value="other">Other</option>
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
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Province
                  </label>
                  <select
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setDistrict("");
                      setLocation("");
                    }}
                  >
                    <option value="">Select province</option>
                    {provinces.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    District
                  </label>
                  <select
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setLocation("");
                    }}
                    disabled={!province}
                  >
                    <option value="">Select district</option>
                    {districts.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    City / Municipality
                  </label>
                  <CityAutocomplete
                    value={location}
                    onChange={setLocation}
                    options={cityOptions}
                    placeholder="Type city name"
                    inputClassName="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9800000000"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <PackageSearch className="h-4 w-4 text-emerald-700" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Pricing and Stock
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price (NPR / KG)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="NPR 0"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-emerald-700" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Product Images
                  </h2>
                </div>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Max 5 Photos
                </span>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Primary Image URL or Upload
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/crop-image.jpg"
                  className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                />
                <div className="mt-2 flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {isImageUploading ? "Uploading..." : "Upload from device"}
                  </label>
                  <span className="text-xs text-slate-500">Uses Cloudinary storage</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-12">
                <div className="relative overflow-hidden rounded-3xl border border-emerald-100 md:col-span-6">
                  <img
                    src={
                      postImage.trim()
                        ? postImage
                        : "https://images.pexels.com/photos/4022091/pexels-photo-4022091.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    }
                    alt="Primary crop preview"
                    className="h-56 w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-500 shadow-sm transition hover:bg-white"
                    onClick={() => setPostImage("")}
                  >
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
              <h2 className="text-lg font-semibold text-slate-900">
                Product Description
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Share growing method, soil quality, harvest date, and taste
                profile.
              </p>

              <textarea
                rows="6"
                placeholder="Describe how these crops were grown, soil health, harvest date, flavor profile, and why buyers should choose this listing..."
                className="mt-3 w-full resize-none rounded-2xl border border-emerald-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {error ? (
                <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting || isImageUploading}
                  onClick={fetchCreatePost}
                >
                  {isSubmitting ? "Publishing..." : isImageUploading ? "Waiting for image..." : "Publish Crop"}
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
