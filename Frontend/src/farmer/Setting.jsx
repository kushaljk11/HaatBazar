import {
  Bell,
  Camera,
  Lock,
  MapPin,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

export default function Setting() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#f6f8f7]">
        <Topbar />

        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-600 md:text-base">
            Manage your account settings, update your profile, and configure
            your preferences.
          </p>

          <section className="mt-6 grid gap-5 xl:grid-cols-3">
            <div className="space-y-5 xl:col-span-2">
              <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-700" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Profile Information
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Kushal Thapa"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="kushal@hamrokrishi.com"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+977 98XXXXXXXX"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Preferred Language
                    </label>
                    <select className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white">
                      <option>English</option>
                      <option>Nepali</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Farm and Store Details
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Farm Name
                    </label>
                    <input
                      type="text"
                      defaultValue="HamroKrishi Organic Farm"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      District
                    </label>
                    <select className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white">
                      <option>Kathmandu</option>
                      <option>Lalitpur</option>
                      <option>Bhaktapur</option>
                      <option>Chitwan</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Farm Address
                    </label>
                    <input
                      type="text"
                      defaultValue="Ward 5, Tokha Municipality, Kathmandu"
                      className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-700" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Notifications
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    "Order updates via email",
                    "Low stock alerts",
                    "Weekly performance summary",
                    "Promotional announcements",
                  ].map((item, index) => (
                    <label
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-emerald-100 bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked={index < 3}
                        className="h-4 w-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                <h2 className="text-base font-semibold text-slate-900">
                  Profile Photo
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload a clear image to personalize your seller account.
                </p>

                <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-5 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80"
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <h2 className="text-base font-semibold text-slate-900">
                    Security
                  </h2>
                </div>

                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-emerald-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  <Lock className="h-4 w-4" />
                  Update Password
                </button>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  <Save className="h-4 w-4" />
                  Save All Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
