import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import Exam from "../models/Exam.js";
import { AppError } from "../utils/AppError.js";

// Helper to generate missing reminders dynamically
export async function generateReminders(userId) {
  const now = new Date();
  
  // 1. Fetch valid active Tasks and Exams
  const tasks = await Task.find({ user: userId, status: { $ne: "Completed" } });
  const exams = await Exam.find({ user: userId, status: { $ne: "Completed" } });

  const validTaskIds = tasks.map(t => String(t._id));
  const validExamIds = exams.map(e => String(e._id));

  // 2. Delete any notifications for Tasks/Exams that no longer exist or are completed
  await Notification.deleteMany({
    user: userId,
    relatedEntityType: "Task",
    relatedEntityId: { $nin: validTaskIds }
  });
  
  await Notification.deleteMany({
    user: userId,
    relatedEntityType: "Exam",
    relatedEntityId: { $nin: validExamIds }
  });

  // 3. Process each active task
  for (const task of tasks) {
    if (!task.dueDate) continue;
    
    const timeDiff = new Date(task.dueDate) - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    let desiredType = null;
    let title = "";
    let message = "";

    if (hoursDiff < 0) {
      desiredType = "TASK_OVERDUE";
      title = "Task Overdue";
      message = `"${task.title}" was due on ${new Date(task.dueDate).toLocaleDateString()} and is still pending.`;
    } else if (hoursDiff <= 24) {
      desiredType = "TASK_DUE_SOON";
      title = "Task Due Soon";
      message = `"${task.title}" is due within 24 hours.`;
    } else {
      desiredType = "TASK_UPCOMING";
      title = "Upcoming Task";
      message = `"${task.title}" is scheduled for ${new Date(task.dueDate).toLocaleDateString()}.`;
    }

    if (desiredType) {
      // Clean up any other type of notification generated for this specific task
      await Notification.deleteMany({
        user: userId,
        relatedEntityType: "Task",
        relatedEntityId: task._id,
        type: { $ne: desiredType }
      });

      // Upsert the desired type, updating title/message/targetDate if they changed
      await Notification.updateOne(
        { user: userId, type: desiredType, relatedEntityId: task._id },
        { 
          $set: {
            title,
            message,
            targetDate: task.dueDate
          },
          $setOnInsert: {
            user: userId,
            type: desiredType,
            relatedEntityType: "Task",
            relatedEntityId: task._id,
            isRead: false
          }
        },
        { upsert: true }
      );
    } else {
      // (This block is not reached currently since all pending tasks get a notification, but included for completeness)
      await Notification.deleteMany({
        user: userId,
        relatedEntityType: "Task",
        relatedEntityId: task._id
      });
    }
  }

  // 4. Process each active exam
  for (const exam of exams) {
    if (!exam.examDate) continue;

    const timeDiff = new Date(exam.examDate) - now;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    let desiredType = null;
    let title = "";
    let message = "";

    // For past exams (daysDiff < 0 or somewhat less depending on timezone, let's say < -1 to give some leeway for same-day completion)
    if (daysDiff < -1) {
      desiredType = null; // Will trigger deletion
    } else if (daysDiff <= 1) {
      desiredType = "EXAM_TODAY";
      title = "Exam Today";
      message = `"${exam.title}" is scheduled for today or tomorrow.`;
    } else {
      desiredType = "EXAM_UPCOMING";
      title = "Upcoming Exam";
      message = `"${exam.title}" is scheduled for ${new Date(exam.examDate).toLocaleDateString()}.`;
    }

    if (desiredType) {
      await Notification.deleteMany({
        user: userId,
        relatedEntityType: "Exam",
        relatedEntityId: exam._id,
        type: { $ne: desiredType }
      });

      await Notification.updateOne(
        { user: userId, type: desiredType, relatedEntityId: exam._id },
        { 
          $set: {
            title,
            message,
            targetDate: exam.examDate
          },
          $setOnInsert: {
            user: userId,
            type: desiredType,
            relatedEntityType: "Exam",
            relatedEntityId: exam._id,
            isRead: false
          }
        },
        { upsert: true }
      );
    } else {
      // Past exam
      await Notification.deleteMany({
        user: userId,
        relatedEntityType: "Exam",
        relatedEntityId: exam._id
      });
    }
  }
}

export async function getNotifications(userId) {
  // Generate reminders on-the-fly right before fetching
  await generateReminders(userId);
  
  const notifications = await Notification.find({ user: userId })
    .limit(100);
  
  const safeNotifs = notifications.map((n) => n.toSafeObject());

  // Sort ALL notifications strictly by targetDate ASCENDING (earliest first)
  safeNotifs.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

  return safeNotifs;
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
