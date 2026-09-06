import { formatDate } from "../utils/formatDate.js";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle, FileText, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiError, getTasks, getExams } from "../services/api.js";

const PRIORITY_COLORS = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
};

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [tasksRes, examsRes] = await Promise.all([getTasks(), getExams()]);
      setTasks(tasksRes.data.tasks || []);
      setExams(examsRes.data.exams || examsRes.data || []);
    } catch (err) {
      setError(getApiError(err, "Could not load calendar data"));
    } finally {
      setLoading(false);
    }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day) => {
    const dayTasks = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getFullYear() === year && taskDate.getMonth() === month && taskDate.getDate() === day;
    }).map(t => ({ ...t, type: 'Task' }));

    const dayExams = exams.filter((exam) => {
      const examDate = new Date(exam.examDate);
      return examDate.getFullYear() === year && examDate.getMonth() === month && examDate.getDate() === day;
    }).map(e => ({ ...e, type: 'Exam' }));

    return [...dayExams, ...dayTasks];
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return <p className="text-sm text-slate-600">Loading calendar...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="mt-1 text-sm text-slate-600">Track your academic deadlines visually.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-slate-200 bg-white">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              title="Previous Month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="w-32 text-center text-sm font-semibold text-slate-900">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              title="Next Month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3 border-r border-slate-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)] text-sm">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="border-b border-r border-slate-100 bg-slate-50/50" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const todayStyles = isToday(day)
              ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white font-semibold"
              : "flex h-7 w-7 items-center justify-center font-medium text-slate-700 dark:text-slate-300";

            return (
              <div
                key={day}
                className="group border-b border-r border-slate-100 dark:border-slate-800 p-2 last:border-r-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-end mb-1">
                  <span className={todayStyles}>{day}</span>
                </div>
                <div className="space-y-1">
                  {dayEvents.map((evt) => {
                    const isExam = evt.type === 'Exam';
                    const isCompleted = evt.status === 'Completed';
                    const baseStyle = isCompleted ? "opacity-60 line-through bg-slate-100 dark:bg-slate-800 text-slate-500" : (isExam ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300");
                    const icon = isExam ? <GraduationCap className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />;
                    return (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`w-full flex items-center overflow-hidden rounded px-1.5 py-1 text-left text-[11px] font-medium transition hover:brightness-95 ${baseStyle}`}
                        title={evt.title}
                      >
                        {icon}
                        <span className="truncate">{evt.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            );
          })}
          
          {/* Fill remaining cells to complete the grid */}
          {Array.from({ length: (7 - ((startDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
            <div key={`empty-end-${i}`} className="border-b border-r border-slate-100 bg-slate-50/50" />
          ))}
        </div>
      </div>

      {(tasks.length === 0 && exams.length === 0) && !loading && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">Your calendar is clear</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            You don't have any tasks or exams scheduled yet.
          </p>
        </div>
      )}

      {/* Task/Exam Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${selectedEvent.type === 'Exam' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedEvent.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 pr-4">{selectedEvent.title}</h3>
                <p className="mt-1 text-sm font-medium text-primary-600">{selectedEvent.subject?.name || "Unknown Subject"}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              {selectedEvent.description && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedEvent.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedEvent.type === 'Exam' ? 'Exam Date' : 'Due Date'}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {formatDate(selectedEvent.type === 'Exam' ? selectedEvent.examDate : selectedEvent.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {selectedEvent.type === 'Exam' ? 'Format & Status' : 'Priority & Status'}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                    {selectedEvent.type === 'Task' && (
                      <span className={`flex items-center gap-1 ${
                        selectedEvent.priority === "High" ? "text-red-700" :
                        selectedEvent.priority === "Medium" ? "text-amber-700" : "text-emerald-700"
                      }`}>
                        <div className={`h-2 w-2 rounded-full ${PRIORITY_COLORS[selectedEvent.priority] || PRIORITY_COLORS.Medium}`} />
                        {selectedEvent.priority}
                      </span>
                    )}
                    {selectedEvent.type === 'Exam' && (
                      <span className="text-purple-700">{selectedEvent.format || "Standard"}</span>
                    )}
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{selectedEvent.status}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <Link
                to={selectedEvent.type === 'Exam' ? '/exams' : '/tasks'}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Go to {selectedEvent.type === 'Exam' ? 'Exams' : 'Tasks'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
