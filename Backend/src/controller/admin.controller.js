import User from "../model/user.model.js";
import Post from "../model/post.model.js";

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildUserFilter = ({ role, search }) => {
  const filter = {};

  if (role) filter.role = String(role).toLowerCase();

  if (search) {
    const regex = new RegExp(String(search), "i");
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }, { location: regex }];
  }

  return filter;
};

const buildPostFilter = ({ status, search }) => {
  const filter = {};

  if (status) filter.status = String(status).toLowerCase();

  if (search) {
    const regex = new RegExp(String(search), "i");
    filter.$or = [{ title: regex }, { category: regex }, { region: regex }, { description: regex }];
  }

  return filter;
};

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBuyers,
      totalFarmers,
      totalAdmins,
      totalPosts,
      activePosts,
      latestUsers,
      latestPosts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "admin" }),
      Post.countDocuments(),
      Post.countDocuments({ status: "active" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role status createdAt"),
      Post.find().sort({ createdAt: -1 }).limit(5).populate("farmerId", "name").select("title category region price status createdAt farmerId"),
    ]);

    return res.status(200).json({
      stats: {
        users: { total: totalUsers, buyers: totalBuyers, farmers: totalFarmers, admins: totalAdmins },
        posts: { total: totalPosts, active: activePosts, inactive: totalPosts - activePosts },
      },
      latestUsers,
      latestPosts: latestPosts.map((post) => ({
        id: String(post._id),
        title: post.title,
        category: post.category,
        region: post.region,
        price: post.price,
        status: post.status,
        farmer: post.farmerId?.name || "Farmer",
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load admin dashboard", error: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 20);
    const filter = buildUserFilter(req.query);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("name email role phone location status createdAt"),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      users,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load users", error: error.message });
  }
};

export const updateAdminUserStatus = async (req, res) => {
  try {
    const normalizedStatus = String(req.body.status || "").toLowerCase();
    if (!["active", "inactive"].includes(normalizedStatus)) {
      return res.status(400).json({ message: "status must be active or inactive" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: normalizedStatus },
      { new: true }
    ).select("name email role status");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User status updated", user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};

export const getAdminPosts = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 20);
    const filter = buildPostFilter(req.query);

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("farmerId", "name email")
        .select("title description category region price unit stockKg status tag image createdAt farmerId"),
      Post.countDocuments(filter),
    ]);

    return res.status(200).json({
      posts: posts.map((post) => ({
        id: String(post._id),
        title: post.title,
        description: post.description,
        category: post.category,
        region: post.region,
        price: post.price,
        unit: post.unit,
        stockKg: post.stockKg,
        status: post.status,
        tag: post.tag,
        image: post.image,
        farmer: post.farmerId?.name || "Farmer",
        farmerEmail: post.farmerId?.email || "",
        createdAt: post.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load posts", error: error.message });
  }
};

export const updateAdminPostStatus = async (req, res) => {
  try {
    const normalizedStatus = String(req.body.status || "").toLowerCase();
    if (!["active", "inactive", "sold"].includes(normalizedStatus)) {
      return res.status(400).json({ message: "status must be active, inactive, or sold" });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { status: normalizedStatus },
      { new: true }
    )
      .populate("farmerId", "name")
      .select("title status farmerId");

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({
      message: "Post status updated",
      post: {
        id: String(post._id),
        title: post.title,
        status: post.status,
        farmer: post.farmerId?.name || "Farmer",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update post status", error: error.message });
  }
};

export const deleteAdminPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({ message: "Post deleted by admin" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};
