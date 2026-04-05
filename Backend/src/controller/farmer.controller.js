import Post from "../model/post.model.js";
import User from "../model/user.model.js";

const ensureFarmerRole = (req, res) => {
  if (req.user?.role !== "farmer") {
    res.status(403).json({ message: "Only farmers can manage marketplace posts" });
    return false;
  }
  return true;
};

const mapPost = (post, farmerName = "Farmer") => ({
  id: String(post._id),
  farmerId: String(post.farmerId),
  farmer: farmerName,
  name: post.title,
  title: post.title,
  description: post.description,
  category: post.category,
  region: post.region,
  price: post.price,
  unit: post.unit,
  stockKg: post.stockKg,
  image: post.image,
  tag: post.tag,
  status: post.status,
  createdAt: post.createdAt,
});

export const getFarmerDashboard = async (req, res) => {
  try {
    if (!ensureFarmerRole(req, res)) return;

    const [farmer, posts] = await Promise.all([
      User.findById(req.user.id).select("name email phone location role status primaryCrop"),
      Post.find({ farmerId: req.user.id }).sort({ createdAt: -1 }),
    ]);

    const totalListings = posts.length;
    const activeListings = posts.filter((post) => post.status === "active").length;
    const soldListings = posts.filter((post) => post.status === "sold").length;
    const inventoryKg = posts.reduce((sum, post) => sum + Number(post.stockKg || 0), 0);

    return res.status(200).json({
      profile: farmer,
      stats: {
        totalListings,
        activeListings,
        soldListings,
        inventoryKg,
      },
      recentPosts: posts.slice(0, 6).map((post) => mapPost(post, farmer?.name || "Farmer")),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load farmer dashboard", error: error.message });
  }
};

export const getFarmerProfile = async (req, res) => {
  try {
    if (!ensureFarmerRole(req, res)) return;

    const farmer = await User.findById(req.user.id).select(
      "name email phone location role status gender primaryCrop createdAt"
    );

    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    return res.status(200).json({ profile: farmer });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load farmer profile", error: error.message });
  }
};

export const updateFarmerProfile = async (req, res) => {
  try {
    if (!ensureFarmerRole(req, res)) return;

    const allowedFields = ["name", "phone", "location", "gender", "primaryCrop"];
    const payload = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    const farmer = await User.findByIdAndUpdate(req.user.id, payload, { new: true }).select(
      "name email phone location role status gender primaryCrop"
    );

    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    return res.status(200).json({ message: "Profile updated", profile: farmer });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update farmer profile", error: error.message });
  }
};

export const createFarmerPost = async (req, res) => {
  try {
    if (!ensureFarmerRole(req, res)) return;

    const {
      title,
      description = "",
      category = "Other",
      region = "Unknown",
      price,
      unit = "kg",
      stockKg = 0,
      image = "",
      tag = "Fresh",
      status = "active",
    } = req.body;

    if (!title || price === undefined || price === null) {
      return res.status(400).json({ message: "title and price are required" });
    }

    const post = await Post.create({
      farmerId: req.user.id,
      title,
      description,
      category,
      region,
      price,
      unit,
      stockKg,
      image,
      tag,
      status,
    });

    const farmer = await User.findById(req.user.id).select("name");
    return res.status(201).json({
      message: "Post created",
      post: mapPost(post, farmer?.name || "Farmer"),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

export const getFarmerMyPosts = async (req, res) => {
  try {
    if (!ensureFarmerRole(req, res)) return;

    const posts = await Post.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
    const farmer = await User.findById(req.user.id).select("name");

    return res.status(200).json({
      total: posts.length,
      posts: posts.map((post) => mapPost(post, farmer?.name || "Farmer")),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load farmer posts", error: error.message });
  }
};

export const updateFarmerPost = async (req, res) => {
  try {
    if (!ensureFarmerRole(req, res)) return;

    const allowed = [
      "title",
      "description",
      "category",
      "region",
      "price",
      "unit",
      "stockKg",
      "image",
      "tag",
      "status",
    ];

    const payload = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId, farmerId: req.user.id },
      payload,
      { new: true }
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    const farmer = await User.findById(req.user.id).select("name");
    return res.status(200).json({ message: "Post updated", post: mapPost(post, farmer?.name || "Farmer") });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

export const deleteFarmerPost = async (req, res) => {
  try {
    if (!ensureFarmerRole(req, res)) return;

    const post = await Post.findOneAndDelete({ _id: req.params.postId, farmerId: req.user.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};
