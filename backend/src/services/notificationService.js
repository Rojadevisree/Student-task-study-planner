import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import Exam from "../models/Exam.js";
import { AppError } from "../utils/AppError.js";

// Helper to generate missing reminders dynamically
export async function generateReminders(userId) {
  const now = new Date();
  
  // Tasks
  const tasks = await Task.find({ user: userId, status: { $ne: "Completed" } });
  for (const task of tasks) {
    if (!task.dueDate) continue;
    
    const timeDiff = new Date(task.dueDate) - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 0) {
      // Overdue
      await Notification.updateOne(
        { user: userId, type: "TASK_OVERDUE", relatedEntityId: task._id },
        { 
          $setOnInsert: {
            user: userId,
            type: "TASK_OVERDUE",
            title: "Task Overdue",
            message: `"${task.title}" was due on ${new Date(task.dueDate).toLocaleDateString()} and is still pending.`,
            relatedEntityType: "Task",
            relatedEntityId: task._id,
          }
        },
        { upsert: true }
      );
    } else if (hoursDiff <= 24) {
      // Due soon
      await Notification.updateOne(
        { user: userId, type: "TASK_DUE_SOON", relatedEntityId: task._id },
        { 
          $setOnInsert: {
            user: userId,
            type: "TASK_DUE_SOON",
            title: "Task Due Soon",
            message: `"${task.title}" is due soon.`,
            relatedEntityType: "Task",
            relatedEntityId: task._id,
          }
        },
        { upsert: true }
      );
    }
  }

  // Exams
  const exams = await Exam.find({ user: userId, status: { $ne: "Completed" } });
  for (const exam of exams) {
    if (!exam.examDate) continue;

    const timeDiff = new Date(exam.examDate) - now;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff >= 0 && daysDiff <= 1) {
      // Exam today or very soon
      await Notification.updateOne(
        { user: userId, type: "EXAM_TODAY", relatedEntityId: exam._id },
        { 
          $setOnInsert: {
            user: userId,
            type: "EXAM_TODAY",
            title: "Exam Today",
            message: `"${exam.title}" is scheduled for today or very soon.`,
            relatedEntityType: "Exam",
            relatedEntityId: exam._id,
          }
        },
        { upsert: true }
      );
    } else if (daysDiff > 1 && daysDiff <= 3) {
      // Exam coming up
      await Notification.updateOne(
        { user: userId, type: "EXAM_UPCOMING", relatedEntityId: exam._id },
        { 
          $setOnInsert: {
            user: userId,
            type: "EXAM_UPCOMING",
            title: "Exam Coming Up",
            message: `"${exam.title}" is scheduled in ${Math.ceil(daysDiff)} days.`,
            relatedEntityType: "Exam",
            relatedEntityId: exam._id,
          }
        },
        { upsert: true }
      );
    }
  }
}

export async function getNotifications(userId) {
  // Generate reminders on-the-fly right before fetching
  await generateReminders(userId);
  
  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(100);
  
  return notifications.map((n) => n.toSafeObject());
}

export async function getUnreadCount(userId) {
  // Optionally generate reminders here too, or skip it for performance if checked often
  await generateReminders(userId);
  return await Notification.countDocuments({ user: userId, isRead: false });
}

export async function markAsRead(userId, notificationId) {
  const notif = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
  if (!notif) throw new AppError("Notification not found", 404);
  return notif.toSafeObject();
}

export async function markAllAsRead(userId) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  return true;
}

export async function deleteNotification(userId, notificationId) {
  const notif = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  if (!notif) throw new AppError("Notification not found", 404);
  return true;
}
