import User from "../model/user.model.js";
import Post from "../model/post.model.js";

const buyerStateByUser = new Map();

const defaultSettings = {
  profile: {
    fullName: "",
    contactNumber: "",
    email: "",
  },
  farm: {
    farmName: "",
    district: "",
    farmSizeAcres: 0,
    organicCertification: "",
  },
  notifications: {
    smsAlerts: false,
    emailUpdates: false,
    orderNotifications: false,
  },
  security: {
    twoFactorEnabled: false,
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const createInitialState = () => ({
  savedPosts: [],
  orders: [],
  cart: [],
  settings: clone(defaultSettings),
  marketSnapshot: [],
  activities: [],
});

const getUserState = (userId) => {
  if (!buyerStateByUser.has(userId)) {
    buyerStateByUser.set(userId, createInitialState());
  }
  return buyerStateByUser.get(userId);
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeSort = (sort) => {
  const allowed = ["featured", "rating", "price-low", "price-high", "name"];
  return allowed.includes(sort) ? sort : "featured";
};

const computeCartSummary = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.13).toFixed(2));
  const deliveryFee = cartItems.length > 0 ? 150 : 0;
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, tax, deliveryFee, total, itemCount };
};

const getProfileFromDb = async (userId) => {
  const dbUser = await User.findById(userId).select("name role email phone location");
  if (!dbUser) {
    return {
      id: userId,
      name: "Buyer",
      role: "buyer",
      email: "",
      phone: "",
      district: "",
    };
  }

  return {
    id: dbUser._id,
    name: dbUser.name,
    role: dbUser.role,
    email: dbUser.email,
    phone: dbUser.phone,
    district: dbUser.location,
  };
};

const buildPostFilters = (query) => {
  const { search = "", category = "all", region = "all", minPrice, maxPrice } = query;
  const mongoFilter = { status: "active" };

  if (search) {
    const regex = new RegExp(search, "i");
    mongoFilter.$or = [{ title: regex }, { description: regex }, { category: regex }];
  }

  if (String(category).toLowerCase() !== "all") {
    mongoFilter.category = category;
  }

  if (String(region).toLowerCase() !== "all") {
    mongoFilter.region = region;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    mongoFilter.price = {};
    if (minPrice !== undefined && Number.isFinite(Number(minPrice))) {
      mongoFilter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && Number.isFinite(Number(maxPrice))) {
      mongoFilter.price.$lte = Number(maxPrice);
    }

    if (Object.keys(mongoFilter.price).length === 0) {
      delete mongoFilter.price;
    }
  }

  return mongoFilter;
};

const buildSort = (sort) => {
  const normalizedSort = normalizeSort(sort);
  if (normalizedSort === "price-low") return { price: 1 };
  if (normalizedSort === "price-high") return { price: -1 };
  if (normalizedSort === "name") return { title: 1 };
  if (normalizedSort === "rating") return { createdAt: -1 };
  return { createdAt: -1 };
};

const mapPostToMarketplaceItem = (post) => ({
  id: String(post._id),
  name: post.title,
  title: post.title,
  farmer: post.farmerId?.name || "Farmer",
  category: post.category,
  region: post.region,
  price: post.price,
  unit: post.unit || "kg",
  rating: 4.5,
  tag: post.tag || "Fresh",
  stockKg: post.stockKg || 0,
  image: post.image || "",
  description: post.description || "",
  createdAt: post.createdAt,
});

const buildSnapshotFromRecommendations = (recommendations) => {
  return recommendations.slice(0, 3).map((item, idx) => ({
    id: idx + 1,
    crop: item.name,
    region: item.region || "Unknown",
    note: item.tag || "Current listing",
    price: `Rs ${Number(item.price || 0).toLocaleString()} /${item.unit || "unit"}`,
  }));
};

const buildActivityFromUserState = (state) => {
  const activity = [];

  if (state.orders.length > 0) {
    const latestOrder = state.orders[0];
    activity.push({
      id: `order-${latestOrder.id}`,
      message: `Order ${latestOrder.id} is currently ${String(latestOrder.status || "processing").replace("-", " ")}.`,
      time: latestOrder.latestUpdateAt ? new Date(latestOrder.latestUpdateAt).toLocaleString() : "Recently",
      tone: "bg-[#d9efe9] text-[#2f7e68]",
    });
  }

  if (state.savedPosts.length > 0) {
    activity.push({
      id: `saved-${state.savedPosts[0].id}`,
      message: `${state.savedPosts.length} item(s) currently in your saved list.`,
      time: "Now",
      tone: "bg-[#e3f2de] text-[#417530]",
    });
  }

  if (state.cart.length > 0) {
    activity.push({
      id: `cart-${state.cart[0].id}`,
      message: `${state.cart.length} item type(s) currently in your cart.`,
      time: "Now",
      tone: "bg-[#f5e8d9] text-[#9a6a2a]",
    });
  }

  return activity;
};

export const getBuyerDashboard = async (req, res) => {
  try {
    const state = getUserState(req.user.id);
    const profile = await getProfileFromDb(req.user.id);

    const posts = await Post.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("farmerId", "name");

    const recommendations = posts.map(mapPostToMarketplaceItem);
    const marketSnapshot = state.marketSnapshot.length
      ? state.marketSnapshot
      : buildSnapshotFromRecommendations(recommendations);
    const activities = state.activities.length ? state.activities : buildActivityFromUserState(state);

    return res.status(200).json({
      profile,
      stats: {
        activeOrders: state.orders.filter((order) => order.status !== "delivered").length,
        wishlist: state.savedPosts.length,
        totalSpentNpr: state.orders.reduce((sum, order) => sum + order.totalNpr, 0),
      },
      recommendations,
      orderHistory: state.orders,
      savedPosts: state.savedPosts,
      marketSnapshot,
      activities,
      cartSummary: computeCartSummary(state.cart),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load buyer dashboard",
      error: error.message,
    });
  }
};

export const getMarketplaceProducts = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 12);

    const mongoFilter = buildPostFilters(req.query);
    const sort = buildSort(req.query.sort || "featured");

    const [rows, total] = await Promise.all([
      Post.find(mongoFilter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("farmerId", "name"),
      Post.countDocuments(mongoFilter),
    ]);

    const products = rows.map(mapPostToMarketplaceItem);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      products,
      pagination: { page, limit, total, totalPages },
      filters: {
        search: req.query.search || "",
        category: req.query.category || "all",
        region: req.query.region || "all",
        minPrice: req.query.minPrice || null,
        maxPrice: req.query.maxPrice || null,
        sort: normalizeSort(req.query.sort || "featured"),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load marketplace", error: error.message });
  }
};

export const getOrderTimeline = (req, res) => {
  const state = getUserState(req.user.id);
  const firstActive = state.orders.find((order) => order.status !== "delivered") || state.orders[0];
  const etaDate = firstActive?.latestUpdateAt
    ? new Date(new Date(firstActive.latestUpdateAt).getTime() + 24 * 60 * 60 * 1000)
    : null;

  return res.status(200).json({
    activeShipments: state.orders.filter((order) => order.status !== "delivered").length,
    completed: state.orders.filter((order) => order.status === "delivered").length,
    statusSteps: ["Placed", "Shipped", "In Transit", "Delivered"],
    meta: {
      estimatedArrival: etaDate ? etaDate.toLocaleString() : "No active shipment",
      supportTitle: "Issue with an order?",
      supportDescription: "Our specialized agro-support team is ready to help 24/7.",
      supportAction: "CONTACT HELP CENTER",
    },
    orders: state.orders,
  });
};

export const getOrderById = (req, res) => {
  const state = getUserState(req.user.id);
  const order = state.orders.find((item) => item.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.status(200).json({ order });
};

export const getSavedPosts = (req, res) => {
  const state = getUserState(req.user.id);

  return res.status(200).json({
    total: state.savedPosts.length,
    savedPosts: state.savedPosts,
  });
};

export const removeSavedPost = (req, res) => {
  const state = getUserState(req.user.id);
  const idx = state.savedPosts.findIndex((item) => item.id === req.params.savedPostId);
  if (idx === -1) return res.status(404).json({ message: "Saved post not found" });

  state.savedPosts.splice(idx, 1);
  return res.status(200).json({ message: "Saved post removed", total: state.savedPosts.length });
};

export const getCart = (req, res) => {
  const state = getUserState(req.user.id);

  return res.status(200).json({
    items: state.cart,
    summary: computeCartSummary(state.cart),
  });
};

export const addToCart = async (req, res) => {
  try {
    const state = getUserState(req.user.id);
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const post = await Post.findById(productId).populate("farmerId", "name");
    const sourceProduct = post ? mapPostToMarketplaceItem(post) : state.savedPosts.find((item) => item.id === productId);

    if (!sourceProduct) return res.status(404).json({ message: "Product not found" });

    const qty = parsePositiveInt(quantity, 1);
    const existing = state.cart.find((item) => item.id === sourceProduct.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      state.cart.push({
        id: sourceProduct.id,
        name: sourceProduct.name,
        image: sourceProduct.image,
        price: sourceProduct.price,
        unit: sourceProduct.unit || "item",
        vendor: sourceProduct.farmer || "Saved Supplier",
        quantity: qty,
      });
    }

    return res.status(201).json({
      message: "Item added to cart",
      items: state.cart,
      summary: computeCartSummary(state.cart),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
};

export const updateCartItemQuantity = (req, res) => {
  const state = getUserState(req.user.id);
  const { quantity } = req.body;
  const qty = parsePositiveInt(quantity, 1);
  const item = state.cart.find((entry) => entry.id === req.params.itemId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });

  item.quantity = qty;

  return res.status(200).json({
    message: "Cart item updated",
    items: state.cart,
    summary: computeCartSummary(state.cart),
  });
};

export const removeCartItem = (req, res) => {
  const state = getUserState(req.user.id);
  const idx = state.cart.findIndex((item) => item.id === req.params.itemId);
  if (idx === -1) return res.status(404).json({ message: "Cart item not found" });

  state.cart.splice(idx, 1);
  return res.status(200).json({
    message: "Cart item removed",
    items: state.cart,
    summary: computeCartSummary(state.cart),
  });
};

export const clearCart = (req, res) => {
  const state = getUserState(req.user.id);
  state.cart = [];
  return res.status(200).json({
    message: "Cart cleared",
    items: state.cart,
    summary: computeCartSummary(state.cart),
  });
};

export const getBuyerSettings = async (req, res) => {
  try {
    const state = getUserState(req.user.id);
    const profile = await getProfileFromDb(req.user.id);

    return res.status(200).json({
      settings: {
        ...state.settings,
        profile: {
          ...state.settings.profile,
          fullName: profile.name || state.settings.profile.fullName,
          email: profile.email || state.settings.profile.email,
          contactNumber: profile.phone || state.settings.profile.contactNumber,
        },
        farm: {
          ...state.settings.farm,
          district: profile.district || state.settings.farm.district,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load buyer settings",
      error: error.message,
    });
  }
};

export const updateBuyerSettings = (req, res) => {
  const state = getUserState(req.user.id);
  const { profile, farm, notifications, security } = req.body;

  if (profile) state.settings.profile = { ...state.settings.profile, ...profile };
  if (farm) state.settings.farm = { ...state.settings.farm, ...farm };
  if (notifications) {
    state.settings.notifications = {
      ...state.settings.notifications,
      ...notifications,
    };
  }
  if (security) state.settings.security = { ...state.settings.security, ...security };

  return res.status(200).json({
    message: "Buyer settings updated",
    settings: state.settings,
  });
};

export const getBuyerMeta = async (req, res) => {
  try {
    const [categories, regions] = await Promise.all([
      Post.distinct("category", { status: "active" }),
      Post.distinct("region", { status: "active" }),
    ]);

    return res.status(200).json({
      categories: categories.filter(Boolean),
      regions: regions.filter(Boolean),
      sortOptions: ["featured", "rating", "price-low", "price-high", "name"],
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load buyer meta", error: error.message });
  }
};
