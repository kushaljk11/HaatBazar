import { useEffect, useState } from "react";
import { Shield, UserCheck, UserX, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const summary = {
    total: users.length,
    active: users.filter((item) => (item.status || "active") === "active").length,
    inactive: users.filter((item) => item.status === "inactive").length,
    admins: users.filter((item) => item.role === "admin").length,
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await api.get("/users", { headers: { Authorization: `Bearer ${token}` } });
      setUsers(Array.isArray(response?.data?.users) ? response.data.users : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (id, payload) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.put(`/admin/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User updated");
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />
        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 p-6 text-white shadow-sm md:p-7">
            <h1 className="text-2xl font-semibold md:text-3xl">User Management</h1>
            <p className="mt-2 text-sm text-emerald-50 md:text-base">
              Manage roles, account status, and platform access control from one secure screen.
            </p>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><Users className="h-4 w-4 text-emerald-700" />Total Users</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.total}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><UserCheck className="h-4 w-4 text-emerald-700" />Active</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.active}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><UserX className="h-4 w-4 text-emerald-700" />Inactive</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.inactive}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><Shield className="h-4 w-4 text-emerald-700" />Admins</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.admins}</p>
            </article>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-800 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateUser(user._id, { role: e.target.value })}
                          className="rounded-lg border border-slate-300 px-2 py-1"
                        >
                          <option value="buyer">buyer</option>
                          <option value="farmer">farmer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.status || "active"}
                          onChange={(e) => updateUser(user._id, { status: e.target.value })}
                          className="rounded-lg border border-slate-300 px-2 py-1"
                        >
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => updateUser(user._id, { status: "inactive" })}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
