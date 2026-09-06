import { formatDate } from "../utils/formatDate.js";
import { Bell, Check, Trash2, Calendar, FileText, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getApiError,
} from "../services/api.js";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications);
    } catch (err) {
      setError(getApiError(err, "Could not load notifications"));
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id) {
    try {
      await markNotificationAsRead(id);
      setNotifications((curr) =>
        curr.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      alert(getApiError(err, "Could not mark as read"));
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead();
      setNotifications((curr) => curr.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      alert(getApiError(err, "Could not mark all as read"));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await deleteNotification(id);
      setNotifications((curr) => curr.filter((n) => n.id !== id));
    } catch (err) {
      alert(getApiError(err, "Could not delete notification"));
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type) => {
    if (type.includes("EXAM")) return <Calendar className="h-5 w-5 text-blue-500" />;
    if (type.includes("TASK")) return <FileText className="h-5 w-5 text-amber-500" />;
    return <AlertTriangle className="h-5 w-5 text-slate-500" />;
  };

  if (loading) return <p className="text-sm text-slate-600">Loading notifications...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Bell className="h-6 w-6 text-slate-700" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-600">Stay updated on your upcoming deadlines.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
          <Bell className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-semibold text-slate-900">You're all caught up!</h3>
          <p className="mt-1 text-sm text-slate-500">You have no new notifications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex flex-col sm:flex-row gap-4 rounded-xl border p-4 transition ${
                notif.isRead
                  ? "border-slate-200 bg-white shadow-sm opacity-75 hover:opacity-100"
                  : "border-primary-200 bg-primary-50 shadow-md"
              }`}
            >
              <div className="flex-shrink-0 pt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${notif.isRead ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                    {notif.title}
                  </h3>
                  {!notif.isRead && <span className="h-2 w-2 rounded-full bg-red-500"></span>}
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{notif.message}</p>
                <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-500">
                  <span>{formatDate(notif.targetDate || notif.createdAt)}</span>
                  
                  {notif.relatedEntityType === "Task" && notif.relatedEntityId && (
                    <Link to="/tasks" className="text-primary-600 dark:text-primary-400 hover:underline">
                      View Tasks
                    </Link>
                  )}
                  {notif.relatedEntityType === "Exam" && notif.relatedEntityId && (
                    <Link to="/exams" className="text-primary-600 dark:text-primary-400 hover:underline">
                      View Exams
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-3 sm:pt-0">
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" /> Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="text-xs font-medium text-slate-400 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
