import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome back, {user?.name}. Your academic planner is ready for the next modules.</p>
      <p className="mt-4 text-sm text-slate-500">
        Subjects, tasks, calendar, and analytics will appear here in later phases. You can update your name, timezone,
        and Pomodoro defaults on your profile.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/subjects"
          className="inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Manage Subjects
        </Link>
        <Link
          to="/tasks"
          className="inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Manage Tasks
        </Link>
        <Link
          to="/calendar"
          className="inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Open Calendar
        </Link>
        <Link
          to="/study-sessions"
          className="inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Study Sessions
        </Link>
        <Link
          to="/profile"
          className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Open profile
        </Link>
      </div>
    </section>
  );
}
