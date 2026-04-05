import { useEffect, useState } from "react";
import { UserRound, LandPlot, Bell, ShieldCheck, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import BuyerLayout from "../components/BuyerLayout";
import api from "../../utils/axios";

const tabs = [
  { key: "profile", label: "Profile Information", icon: UserRound },
  { key: "farm", label: "Farm Details", icon: LandPlot },
  { key: "notify", label: "Notification Preferences", icon: Bell },
  { key: "security", label: "Security", icon: ShieldCheck },
];

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    profile: {
      fullName: "",
      contactNumber: "",
      email: "",
    },
    farm: {
      farmName: "",
      district: "Kaski",
      farmSizeAcres: "",
      organicCertification: "",
    },
    notifications: {
      smsAlerts: true,
      emailUpdates: true,
      orderNotifications: false,
    },
    security: {
      twoFactorEnabled: true,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get("/buyer/settings");
        if (data.settings) {
          setForm((prev) => ({
            profile: { ...prev.profile, ...data.settings.profile },
            farm: { ...prev.farm, ...data.settings.farm },
            notifications: { ...prev.notifications, ...data.settings.notifications },
            security: { ...prev.security, ...data.settings.security },
          }));
        }
      } catch {
        toast.error("Failed to load settings");
      }
    };

    loadSettings();
  }, []);

  const updateSection = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/buyer/settings", form);
      toast.success("Settings updated successfully");
    } catch {
      toast.error("Could not save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BuyerLayout
      title="Farmer Settings"
      subtitle="Manage your account credentials, farm details and notification preferences."
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <aside className="xl:col-span-3">
          <div className="rounded-3xl bg-white p-3 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`mb-2 flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-semibold transition ${
                    active ? "bg-[#014d40] text-white" : "text-[#334155] hover:bg-[#f1f5f3]"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-5 xl:col-span-9">
          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#143d35]">Profile Information</h2>
            <p className="mb-5 text-sm text-[#64748b]">Update your personal contact details</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                className="rounded-xl bg-[#f5f7f6] px-4 py-3"
                value={form.profile.fullName}
                onChange={(e) => updateSection("profile", "fullName", e.target.value)}
              />
              <input
                className="rounded-xl bg-[#f5f7f6] px-4 py-3"
                value={form.profile.contactNumber}
                onChange={(e) => updateSection("profile", "contactNumber", e.target.value)}
              />
              <input
                className="rounded-xl bg-[#f5f7f6] px-4 py-3 md:col-span-2"
                value={form.profile.email}
                onChange={(e) => updateSection("profile", "email", e.target.value)}
              />
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#143d35]">Farm Details</h2>
            <p className="mb-5 text-sm text-[#64748b]">Physical location and operational certifications</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                className="rounded-xl bg-[#f5f7f6] px-4 py-3"
                value={form.farm.farmName}
                onChange={(e) => updateSection("farm", "farmName", e.target.value)}
              />
              <select
                className="rounded-xl bg-[#f5f7f6] px-4 py-3"
                value={form.farm.district}
                onChange={(e) => updateSection("farm", "district", e.target.value)}
              >
                <option>Kaski</option>
                <option>Mustang</option>
                <option>Ilam</option>
              </select>
              <input
                className="rounded-xl bg-[#f5f7f6] px-4 py-3"
                value={form.farm.farmSizeAcres}
                onChange={(e) => updateSection("farm", "farmSizeAcres", e.target.value)}
              />
              <input
                className="rounded-xl bg-[#f5f7f6] px-4 py-3"
                value={form.farm.organicCertification}
                onChange={(e) => updateSection("farm", "organicCertification", e.target.value)}
              />
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#143d35]">Notification Preferences</h2>
            <p className="mb-5 text-sm text-[#64748b]">Control how you receive system alerts</p>
            <div className="space-y-3">
              {[
                { key: "smsAlerts", label: "SMS Alerts" },
                { key: "emailUpdates", label: "Email Updates" },
                { key: "orderNotifications", label: "Order Notifications" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] p-3">
                  <div>
                    <p className="font-semibold text-[#1f2937]">{item.label}</p>
                    <p className="text-xs text-[#64748b]">Instant updates for critical buyer events</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSection("notifications", item.key, !form.notifications[item.key])}
                    className={`h-6 w-11 rounded-full ${
                      form.notifications[item.key] ? "bg-[#65a30d]" : "bg-[#cbd5d1]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#143d35]">Security</h2>
            <p className="mb-5 text-sm text-[#64748b]">Manage your password and authentication</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button className="inline-flex items-center justify-between rounded-full border border-[#cfd8d4] px-4 py-3 text-sm font-semibold text-[#1f2937]">
                Change Password
                <ChevronRight size={15} />
              </button>
              <div className="rounded-xl border border-[#d4cdc2] bg-[#f4eee7] p-4 text-sm text-[#4b5563]">
                Strong passwords and two-factor authentication protect your account and transactions.
              </div>
            </div>
          </article>

          <div className="flex justify-end gap-3">
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-[#475569]">Discard</button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-[#014d40] px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>
    </BuyerLayout>
  );
}

export default Settings;
