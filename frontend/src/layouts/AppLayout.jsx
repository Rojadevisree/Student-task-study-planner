import { BookOpen, LogOut, UserRound, Bell } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import { getUnreadNotificationCount } from "../services/api.js";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await getUnreadNotificationCount();
        setUnreadCount(res.data.count);
      } catch (err) {
        // ignore for layout
      }
    }
    fetchCount();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary-600" />
            <p className="font-semibold">Student Planner</p>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/subjects" className={linkClass}>
              Subjects
            </NavLink>
            <NavLink to="/topics" className={linkClass}>
              Topics
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
            <NavLink to="/exams" className={linkClass}>
              Exams
            </NavLink>
            <NavLink to="/calendar" className={linkClass}>
              Calendar
            </NavLink>
            <NavLink to="/study-sessions" className={linkClass}>
              Study Sessions
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `${linkClass({ isActive })} relative`}>
              <Bell className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1 text-sm text-slate-500 sm:inline-flex">
              <UserRound className="h-4 w-4" />
              {user?.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
