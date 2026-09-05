import { sendSuccess } from "../utils/apiResponse.js";
import * as notificationService from "../services/notificationService.js";

export async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getNotifications(req.user.id);
    return sendSuccess(res, { statusCode: 200, message: "Notifications retrieved", data: { notifications } });
  } catch (error) { next(error); }
}

export async function getUnreadCount(req, res, next) {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    return sendSuccess(res, { statusCode: 200, message: "Unread count retrieved", data: { count } });
  } catch (error) { next(error); }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);
    return sendSuccess(res, { statusCode: 200, message: "Notification marked as read", data: { notification } });
  } catch (error) { next(error); }
}

export async function markAllAsRead(req, res, next) {
  try {
    await notificationService.markAllAsRead(req.user.id);
    return sendSuccess(res, { statusCode: 200, message: "All notifications marked as read", data: null });
  } catch (error) { next(error); }
}

export async function deleteNotification(req, res, next) {
  try {
    await notificationService.deleteNotification(req.user.id, req.params.id);
    return sendSuccess(res, { statusCode: 200, message: "Notification deleted", data: null });
  } catch (error) { next(error); }
}
