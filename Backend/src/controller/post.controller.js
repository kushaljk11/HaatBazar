import User from "../model/user.model.js";
import Post from "../model/post.js";
import mongoose from "mongoose";

// to create a post
export const createPost = async (req, res) => {
  try {
    const {
      postTitle,
      postDescription,
      postLocation,
      postImage,
      price,
      quantity,
      category,
      variety,
      contactInfo,
      minimumOrder,
      tag,
    } = req.body;
    const userId = req.user.id;

    const newPost = new Post({
      user: userId,
      postTitle,
      postDescription,
      postLocation,
      postImage,
      price,
      quantity,
      category,
      variety,
      contactInfo,
      minimumOrder,
      tag,
    });
    await newPost.save();

    if (newPost) {
      await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });
    }

    if (!newPost) {
      return res.status(400).json({ message: "Failed to create post" });
    }

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.error("Error creating post:", error);
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// to get all the post
export const getAllPosts = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    console.log("Total posts count:", count);

    const posts = await Post.find().populate("user", "name email");

    res.status(200).json({ count, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);

    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


// get post by id
export const GetPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate("user", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

// count the posts of a user
export const getPostCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const count = await Post.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error counting posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to count posts",
    });
  }
};

// get post by user id
export const getPostsByUserId = async (req, res) => {
  try {
    const count = await Post.countDocuments({ user: req.params.userId });
    const userId = req.params.userId;
    const posts = await Post.find({ user: userId }).populate("user", "name email");
    res.status(200).json({ count, posts });
  } catch (error) {
    console.error("Error fetching posts by user id:", error);
    res.status(500).json({ message: "Failed to fetch posts by user id" });
  }
};

// update the post
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// delete the post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully", post: deletedPost });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// get marketplaceposts which are approved
export const getMarketplacePosts = async (req, res) => {
  try {
    const posts = await Post.find({ adminApproval: "Approved" }).populate("user", "name email");

    const count = posts.length;

    if(!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json( { count, posts } );
  } catch (error) {
    console.error("Error fetching marketplace posts:", error);
    res.status(500).json({ message: "Failed to fetch marketplace posts" });
  }
};

// getpendingpost for admin
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ adminApproval: "Pending" }).populate("user", "name email");
    const count = posts.length;

    if(!posts) {
      return res.status(404).json({ message: "No pending posts found" });
    }

    res.status(200).json( { count, posts } );
  } catch (error) {
    console.error("Error fetching pending posts:", error);
    res.status(500).json({ message: "Failed to fetch pending posts" });
  }
};

// update the post approval
export const updatePostApproval = async (req, res) => {
  try {
    const postId = req.params.id;
    const { adminApproval } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(postId, { adminApproval }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if(adminApproval === "Approved") {
      await User.findByIdAndUpdate(updatedPost.user, { $push: { approvedPosts: updatedPost._id } });
    }

    res.status(200).json({ message: "Post approval updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post approval:", error);
    res.status(500).json({ message: "Failed to update post approval" });
  }
};

//update the post status to sold out
export const updatePostStatus = async (req, res) => {
  try {
    const postId = req.params.id;
    const { status } = req.body;
    const updatedPost = await Post.findByIdAndUpdate
    (postId, { status }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (status === "Sold Out") {
      await User.findByIdAndUpdate(updatedPost.user, { $push: { soldOutPosts: updatedPost._id } });
    }
    if (status !== "Sold Out" && status !== "Available" && status !== "Pending") {
      return res.status(400).json({ message: "Invalid post status" });
    }
    res.status(200).json({ message: "Post status updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post status:", error);
    res.status(500).json({ message: "Failed to update post status" });
  }
};

//keyword matching searchposts
export const searchPosts = async (req, res) => {
    try {
        const { keyword } = req.query;
        const posts = await Post.find({
            $or: [
                { postTitle: { $regex: keyword, $options: "i" } },
                { postDescription: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
                { variety: { $regex: keyword, $options: "i" } },
                { tag: { $regex: keyword, $options: "i" } },
            ],
            adminApproval: "Approved",
        }).populate("user", "name email");
        res.status(200).json({ message: "Posts found", posts });
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).json({ message: "Failed to search posts" });
    }
};

// get recent log of user
export const getRecentUserLogs = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const posts = await Post.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("postTitle status adminApproval createdAt updatedAt")
      .lean();

    const logs = posts.map((post) => ({
      id: post._id,
      action: `Post \"${post.postTitle}\" is ${post.adminApproval}`,
      message: `Status: ${post.status}`,
      timestamp: post.updatedAt || post.createdAt,
    }));

    res.status(200).json({ message: "Recent logs found", logs });
  } catch (error) {
    console.error("Error fetching recent user logs:", error);
    res.status(500).json({ message: "Failed to fetch recent user logs" });
  }
};
