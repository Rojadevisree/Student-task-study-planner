import { BookOpen, LogOut, UserRound, Bell, Sun, Moon, Menu, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useState, useEffect } from "react";
import { getUnreadNotificationCount } from "../services/api.js";

const linkClass = ({ isActive }) =>
  `rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap transition ${
    isActive ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-3 text-sm font-medium transition ${
    isActive ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
  }`;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const NavLinks = ({ mobile = false }) => {
    const cls = mobile ? mobileLinkClass : linkClass;
    return (
      <>
        <NavLink to="/dashboard" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Dashboard</NavLink>
        <NavLink to="/subjects" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Subjects</NavLink>
        <NavLink to="/tasks" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Tasks</NavLink>
        <NavLink to="/exams" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Exams</NavLink>
        <NavLink to="/calendar" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Calendar</NavLink>
        <NavLink to="/study-sessions" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Study Sessions</NavLink>
        <NavLink to="/analytics" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Analytics</NavLink>
        <NavLink to="/notifications" onClick={() => mobile && setIsMenuOpen(false)} className={({ isActive }) => `${cls({ isActive })} relative`}>
          Notifications
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/profile" onClick={() => mobile && setIsMenuOpen(false)} className={cls}>Profile</NavLink>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo Area */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-500" />
            <p className="font-semibold dark:text-white whitespace-nowrap hidden sm:block">Student Planner</p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center justify-center gap-1 flex-1">
            <NavLinks />
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <span className="hidden items-center gap-1 text-sm text-slate-500 dark:text-slate-400 sm:inline-flex">
              <UserRound className="h-4 w-4" />
              <span className="truncate max-w-[120px]">{user?.name}</span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <LogOut className="h-4 w-4 hidden sm:block" />
              Logout
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <nav className="flex flex-col gap-1 px-4 py-3">
              <NavLinks mobile={true} />
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
