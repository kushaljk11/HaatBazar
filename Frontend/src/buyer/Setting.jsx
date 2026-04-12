import { useEffect, useState } from "react";
import { Bell, Lock, MapPin, Save, User, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "../utils/axios";

export default function BuyerSetting() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    gender: "other",
    primaryCrop: "other",
  });

  const [preferences, setPreferences] = useState({
    notifyOrder: true,
    notifyWishlist: true,
    notifyPromotions: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token") || storedUser?.token;
  const userId = storedUser?.id || storedUser?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !userId) {
        toast.error("Please login to access settings.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response?.data?.user;
        if (!user) {
          throw new Error("User data not found.");
        }

        setProfile({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          location: user?.location || "",
          gender: user?.gender || "other",
          primaryCrop: user?.primaryCrop || "other",
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, userId]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!token || !userId) {
      toast.error("Please login again.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        gender: profile.gender,
        primaryCrop: profile.primaryCrop,
      };

      const response = await api.put(`/user/update/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = response?.data?.user;
      if (updated) {
        const nextUser = {
          ...(storedUser || {}),
          id: updated._id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          phone: updated.phone,
          location: updated.location,
        };
        localStorage.setItem("user", JSON.stringify(nextUser));
      }

      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (!token || !userId) {
      toast.error("Please login again.");
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please enter current and new password.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setIsPasswordSaving(true);
      await api.put(
        `/user/password/${userId}`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex h-full min-h-0 w-full flex-col">
        <Topbar />
        <main className="h-full w-full overflow-y-auto bg-[#f6f8f7] p-4 md:p-6">
          <h1 className="text-2xl font-semibold text-slate-900">Buyer Settings</h1>
          <p className="mt-1 text-sm text-slate-600 md:text-base">
            Manage profile details, delivery preferences, and account notifications.
          </p>

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
              Loading buyer settings...
            </div>
          ) : (
            <section className="mt-6 grid gap-5 xl:grid-cols-3">
              <div className="space-y-5 xl:col-span-2">
                <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-700" />
                    <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInput}
                        className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInput}
                        className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Gender</label>
                      <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleInput}
                        className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-700" />
                    <h2 className="text-lg font-semibold text-slate-900">Delivery Preferences</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Default Delivery Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleInput}
                        className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Favorite Produce Type</label>
                      <select
                        name="primaryCrop"
                        value={profile.primaryCrop}
                        onChange={handleInput}
                        className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                      >
                        <option value="grains">Grains</option>
                        <option value="fruits">Fruits</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-emerald-700" />
                    <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">Order updates</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifyOrder}
                        onChange={(e) =>
                          setPreferences((prev) => ({ ...prev, notifyOrder: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">Wishlist price alerts</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifyWishlist}
                        onChange={(e) =>
                          setPreferences((prev) => ({ ...prev, notifyWishlist: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">Promotions and offers</span>
                      <input
                        type="checkbox"
                        checked={preferences.notifyPromotions}
                        onChange={(e) =>
                          setPreferences((prev) => ({ ...prev, notifyPromotions: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-700" />
                    <h2 className="text-base font-semibold text-slate-900">Buyer Account</h2>
                  </div>
                  <p className="text-sm text-slate-500">
                    Keep these details accurate for smooth checkout and delivery.
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-700" />
                    <h2 className="text-base font-semibold text-slate-900">Security</h2>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInput}
                      placeholder="Current password"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInput}
                      placeholder="New password"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInput}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePasswordUpdate}
                    disabled={isPasswordSaving}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Lock className="h-4 w-4" />
                    {isPasswordSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save All Changes"}
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
