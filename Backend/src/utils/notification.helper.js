import Notification from "../model/notification.js";
import { emitToRole, emitToUser } from "../lib/socket.js";

export const notifyRole = async ({ role, type, title, message, data = {} }) => {
  const notification = await Notification.create({
    recipientRole: role,
    type,
    title,
    message,
    data,
  });

  emitToRole(role, "notification:new", notification);
  return notification;
};

export const notifyUser = async ({ userId, type, title, message, data = {} }) => {
  const notification = await Notification.create({
    recipientUser: userId,
    type,
    title,
    message,
    data,
  });

  emitToUser(String(userId), "notification:new", notification);
  return notification;
};
