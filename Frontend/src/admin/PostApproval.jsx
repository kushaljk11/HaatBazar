import { useEffect, useState } from "react";
import { CircleCheck, Clock3, FileWarning } from "lucide-react";
import { toast } from "react-hot-toast";
import AdminSidebar from "./components/Sidebar";
import AdminTopbar from "./components/Topbar";
import api from "../utils/axios";

export default function PostApproval() {
  const [posts, setPosts] = useState([]);

  const totalValue = posts.reduce((sum, item) => sum + Number(item?.price || 0), 0);

  const fetchPendingPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await api.get("/pendingposts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(Array.isArray(response?.data?.posts) ? response.data.posts : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load pending posts");
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const updateApproval = async (id, adminApproval) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.put(
        `/updateapproval/${id}`,
        { adminApproval },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Post ${adminApproval.toLowerCase()}`);
      fetchPendingPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update approval");
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-100">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <AdminTopbar />
        <main className="w-full p-4 md:p-6">
          <section className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-800 via-orange-700 to-rose-700 p-6 text-white shadow-sm md:p-7">
            <h1 className="text-2xl font-semibold md:text-3xl">Post Approval Queue</h1>
            <p className="mt-2 text-sm text-orange-50 md:text-base">
              Review incoming market listings, verify quality, and publish trusted inventory.
            </p>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><Clock3 className="h-4 w-4 text-amber-700" />Pending Posts</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{posts.length}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><FileWarning className="h-4 w-4 text-amber-700" />Estimated Value</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">NPR {totalValue.toLocaleString()}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm text-slate-500"><CircleCheck className="h-4 w-4 text-amber-700" />Review Status</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">Live</p>
            </article>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <img src={post.postImage} alt={post.postTitle} className="h-40 w-full rounded-xl object-cover" />
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{post.postTitle}</h3>
                <p className="text-sm text-slate-600">Farmer: {post?.user?.name || "Unknown"}</p>
                <p className="text-sm text-slate-600">Location: {post?.postLocation || "N/A"}</p>
                <p className="text-sm text-slate-600">NPR {Number(post.price || 0).toLocaleString()}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => updateApproval(post._id, "Approved")} className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
                  <button type="button" onClick={() => updateApproval(post._id, "Rejected")} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700">Reject</button>
                </div>
              </article>
            ))}

            {posts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-emerald-200 bg-white p-6 text-sm text-slate-500">
                No pending posts.
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}
