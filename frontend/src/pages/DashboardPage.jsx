import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { getDashboardSummary, getApiError } from "../services/api.js";
import { BookOpen, CheckCircle2, Clock, Calendar as CalendarIcon, CheckSquare, Layers } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getDashboardSummary();
        setData(res.data);
      } catch (err) {
        setError(getApiError(err, "Failed to load dashboard data"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-slate-600">Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <section className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
        <p className="mt-1 text-slate-600">Here is your academic overview for today.</p>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/analytics" className="inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            View Full Analytics
          </Link>
          <Link to="/tasks" className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Manage Tasks
          </Link>
          <Link to="/study-sessions" className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Start Studying
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><BookOpen className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Subjects</p>
              <p className="text-2xl font-bold text-slate-900">{data.summary.totalSubjects}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600"><CheckSquare className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{data.summary.pendingTasks}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-red-600"><CalendarIcon className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Upcoming Exams</p>
              <p className="text-2xl font-bold text-slate-900">{data.summary.upcomingExams}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><Clock className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Study Today</p>
              <p className="text-2xl font-bold text-slate-900">
                {Math.floor(data.studyActivity.studyTimeToday / 60)}h {data.studyActivity.studyTimeToday % 60}m
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
            <h2 className="font-semibold text-slate-800">Upcoming Tasks</h2>
            <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="p-0">
            {data.upcomingTasks.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">No upcoming tasks pending.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.upcomingTasks.map(task => (
                  <li key={task.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-slate-800">{task.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{task.subject?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 uppercase tracking-wide">
                          {task.status}
                        </span>
                        {task.dueDate && (
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
            <h2 className="font-semibold text-slate-800">Upcoming Exams</h2>
            <Link to="/exams" className="text-sm font-medium text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="p-0">
            {data.upcomingExams.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">No upcoming exams scheduled.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.upcomingExams.map(exam => {
                  const daysLeft = Math.ceil((new Date(exam.examDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <li key={exam.id} className="p-4 hover:bg-slate-50 transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-slate-800">{exam.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{exam.subject?.name} • {exam.examType}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-semibold ${daysLeft <= 3 ? 'text-red-600' : 'text-slate-600'}`}>
                            {daysLeft === 0 ? "Today" : daysLeft < 0 ? "Overdue" : `In ${daysLeft} days`}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
          <h2 className="font-semibold text-slate-800">Subject Progress</h2>
        </div>
        <div className="p-6">
          {data.subjectProgress.length === 0 ? (
             <p className="text-sm text-slate-500 text-center">Add topics to your subjects to see progress here.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.subjectProgress.map((sub, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <h4 className="font-medium text-slate-800">{sub.subjectName}</h4>
                    <span className="text-xs font-semibold text-slate-600">{sub.percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-primary-500 transition-all" style={{ width: `${sub.percentage}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {sub.completed} / {sub.total} topics completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
