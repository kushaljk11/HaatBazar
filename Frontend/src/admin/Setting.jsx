import { useEffect, useState } from "react";
import { Lock, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

export default function AdminSetting() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token") || storedUser?.token;
  const userId = storedUser?.id || storedUser?._id;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    gender: "other",
    primaryCrop: "other",
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !userId) return;

      try {
        const response = await api.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response?.data?.user;
        if (user) {
          setProfile({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "",
            gender: user.gender || "other",
            primaryCrop: user.primaryCrop || "other",
          });
        }
      } catch {
        // no-op
      }
    };

    fetchProfile();
  }, [token, userId]);

  const updateProfile = async () => {
    if (!token || !userId) return;

    try {
      await api.put(`/user/update/${userId}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  const updatePassword = async () => {
    if (!token || !userId) return;

    try {
      await api.put(`/user/password/${userId}`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password updated");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />
        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-slate-300 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-sm md:p-7">
            <h1 className="text-2xl font-semibold md:text-3xl">Admin Settings</h1>
            <p className="mt-2 text-sm text-slate-100 md:text-base">Manage profile details, account security, and control panel identity.</p>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <UserCircle2 className="h-5 w-5 text-emerald-700" /> Profile
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" />
                <input className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-sm text-slate-500" value={profile.email} disabled placeholder="Email" />
                <input className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={profile.phone} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" />
                <input className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={profile.location} onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" />
                <button type="button" onClick={updateProfile} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save Profile</button>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Lock className="h-5 w-5 text-emerald-700" /> Password
              </h2>
              <div className="mt-4 grid gap-3">
                <input type="password" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={passwordData.currentPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))} placeholder="Current password" />
                <input type="password" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" value={passwordData.newPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))} placeholder="New password" />
                <button type="button" onClick={updatePassword} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Update Password</button>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-700" /> Account Security
              </h2>
              <p className="mt-2 text-sm text-slate-600">Use strong passwords and keep admin access limited to trusted devices.</p>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
