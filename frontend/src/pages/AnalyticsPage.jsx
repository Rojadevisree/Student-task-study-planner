import { useEffect, useState } from "react";
import { getAnalyticsSummary, getApiError } from "../services/api.js";
import { BarChart3, Clock, CheckCircle2, AlertTriangle, Calendar as CalendarIcon, BookOpen, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getAnalyticsSummary();
        setData(res.data);
      } catch (err) {
        setError(getApiError(err, "Failed to load analytics"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-slate-600">Loading analytics...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <section className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary-600" />
          Academic Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">Detailed overview of your academic progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Overall Progress</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{data.overallProgress}%</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-primary-500" style={{ width: `${data.overallProgress}%` }}></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Task Completion
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{data.taskAnalytics.completionPercentage}%</div>
          <p className="mt-1 text-xs text-slate-500">
            {data.taskAnalytics.completedTasks} / {data.taskAnalytics.totalTasks} tasks completed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Clock className="h-4 w-4 text-amber-500" /> Total Study Time
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{Math.round(data.studyAnalytics.totalStudyTime / 60)}h {data.studyAnalytics.totalStudyTime % 60}m</div>
          <p className="mt-1 text-xs text-slate-500">Across {data.studyAnalytics.totalSessions} sessions</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <AlertTriangle className="h-4 w-4 text-red-500" /> Overdue Tasks
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{data.taskAnalytics.overdueTasks}</div>
          <p className="mt-1 text-xs text-slate-500">Requires immediate attention</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-500" /> Subject Performance
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {data.subjectPerformance.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No subject data available.</p>
            ) : (
              data.subjectPerformance.map((sub, idx) => (
                <div key={idx} className="flex flex-col gap-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-end">
                    <h4 className="font-medium text-slate-800">{sub.name}</h4>
                    <span className="text-xs font-semibold text-primary-600">{sub.taskPercentage}% Tasks</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-primary-500" style={{ width: `${sub.taskPercentage}%` }}></div>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500 mt-1">
                    <span>{sub.completedTasks}/{sub.tasks} Tasks</span>
                    <span>{Math.round(sub.studyTime / 60)}h {sub.studyTime % 60}m Studied</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-center p-6 text-center">
            <h3 className="font-medium text-slate-600 mb-2">Exams Overview</h3>
            <div className="flex justify-center gap-8 mt-2">
              <div>
                <div className="text-3xl font-bold text-amber-500">{data.examOverview.upcomingExams}</div>
                <div className="text-sm text-slate-500 mt-1">Upcoming</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-500">{data.examOverview.completedExams}</div>
                <div className="text-sm text-slate-500 mt-1">Completed</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-center p-6 text-center">
            <h3 className="font-medium text-slate-600 mb-2">Study Time This Week</h3>
            <div className="text-4xl font-bold text-primary-600">
              {Math.round(data.studyAnalytics.studyTimeThisWeek / 60)}h {data.studyAnalytics.studyTimeThisWeek % 60}m
            </div>
            <Link to="/study-sessions" className="text-sm text-primary-600 hover:underline mt-4">
              View study history
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
