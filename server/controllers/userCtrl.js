const Users = require("../models/userModel");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("fullname username avatar");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const {
        avatar,
        fullname,
        mobile,
        address,
        story,
        website,
        gender,
        privacy,
        notifications,
        theme,
      } = req.body;

      if (!fullname)
        return res.status(400).json({ msg: "Please add your full name." });

      const updateData = {
        avatar,
        fullname,
        mobile,
        address,
        story,
        website,
        gender,
      };

      // Add theme preference if provided
      if (theme) {
        updateData.theme = theme;
      }

      // Add privacy settings if provided
      if (privacy) {
        updateData.isPrivate = privacy.isPrivate;
        updateData.allowMessages = privacy.allowMessages;
        updateData.showOnline = privacy.showOnline;
        updateData.allowTagging = privacy.allowTagging;
      }

      // Add notification settings if provided (can be expanded later)
      if (notifications) {
        // Store notifications in user model if needed
        // For now, we'll just acknowledge them
      }

      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.user._id },
        updateData,
        { new: true }
      ).select("-password");

      res.json({
        msg: "Update Success!",
        user: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      // Check if already following
      const user = await Users.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0)
        return res.status(500).json({ msg: "You already follow this user." });

      // Check if there's already a pending request
      const existingRequest = await Users.find({
        _id: req.params.id,
        followRequests: req.user._id,
      });
      if (existingRequest.length > 0)
        return res.status(500).json({ msg: "Follow request already sent." });

      // Get target user to check if account is private
      const targetUser = await Users.findById(req.params.id);
      if (!targetUser) return res.status(400).json({ msg: "User not found." });

      // If account is private, send follow request instead of following directly
      if (targetUser.isPrivate) {
        // Add to target user's follow requests
        await Users.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { followRequests: req.user._id } },
          { new: true }
        );

        // Add to current user's pending requests
        await Users.findOneAndUpdate(
          { _id: req.user._id },
          { $push: { pendingRequests: req.params.id } },
          { new: true }
        );

        const updatedUser = await Users.findById(req.params.id).populate(
          "followers following followRequests",
          "-password"
        );

        res.json({
          newUser: updatedUser,
          requestSent: true,
          msg: "Follow request sent!",
        });
      } else {
        // Public account - follow directly
        const newUser = await Users.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { followers: req.user._id } },
          { new: true }
        ).populate("followers following", "-password");

        await Users.findOneAndUpdate(
          { _id: req.user._id },
          { $push: { following: req.params.id } },
          { new: true }
        );

        res.json({ newUser });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      ).populate("followers following", "-password");

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 10;

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Accept follow request
  acceptFollowRequest: async (req, res) => {
    try {
      const requesterId = req.params.id;

      // Check if there's a pending request
      const currentUser = await Users.findById(req.user._id);
      if (!currentUser.followRequests.includes(requesterId)) {
        return res
          .status(400)
          .json({ msg: "No follow request from this user." });
      }

      // Add to followers and following
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { followers: requesterId },
          $pull: { followRequests: requesterId },
        }
      );

      await Users.findOneAndUpdate(
        { _id: requesterId },
        {
          $push: { following: req.user._id },
          $pull: { pendingRequests: req.user._id },
        }
      );

      const updatedUser = await Users.findById(req.user._id).populate(
        "followers following followRequests",
        "-password"
      );

      res.json({
        user: updatedUser,
        msg: "Follow request accepted!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Reject follow request
  rejectFollowRequest: async (req, res) => {
    try {
      const requesterId = req.params.id;

      // Remove from follow requests and pending requests
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { followRequests: requesterId } }
      );

      await Users.findOneAndUpdate(
        { _id: requesterId },
        { $pull: { pendingRequests: req.user._id } }
      );

      const updatedUser = await Users.findById(req.user._id).populate(
        "followers following followRequests",
        "-password"
      );

      res.json({
        user: updatedUser,
        msg: "Follow request rejected!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Get follow requests
  getFollowRequests: async (req, res) => {
    try {
      const user = await Users.findById(req.user._id)
        .populate("followRequests", "fullname username avatar")
        .select("followRequests");

      res.json({ followRequests: user.followRequests });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Cancel follow request
  cancelFollowRequest: async (req, res) => {
    try {
      const targetUserId = req.params.id;

      // Check if there's a pending request
      const currentUser = await Users.findById(req.user._id);
      if (!currentUser.pendingRequests.includes(targetUserId)) {
        return res.status(400).json({ msg: "No pending follow request to this user." });
      }

      // Remove from target user's follow requests
      await Users.findOneAndUpdate(
        { _id: targetUserId },
        { $pull: { followRequests: req.user._id } }
      );

      // Remove from current user's pending requests
      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { pendingRequests: targetUserId } },
        { new: true }
      ).populate("followers following", "-password");

      res.json({
        user: updatedUser,
        msg: "Follow request cancelled!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Update theme preference
  updateTheme: async (req, res) => {
    try {
      const { theme } = req.body;

      if (!theme || !["light", "dark"].includes(theme)) {
        return res.status(400).json({ msg: "Invalid theme value." });
      }

      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.user._id },
        { theme },
        { new: true }
      ).select("-password");

      res.json({
        msg: "Theme updated successfully!",
        user: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
