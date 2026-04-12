import Notification from "../model/notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    const notifications = await Notification.find({
      $or: [{ recipientUser: userId }, { recipientRole: role }],
    })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        $or: [{ recipientUser: userId }, { recipientRole: role }],
      },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json(notification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    await Notification.updateMany(
      {
        $or: [{ recipientUser: userId }, { recipientRole: role }],
        isRead: false,
      },
      { isRead: true },
    );

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
