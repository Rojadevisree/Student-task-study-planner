import { Play, Pause, Square, SkipForward, Save, CheckCircle2, LayoutList } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  createStudySession,
  getStudySessions,
  getSubjects,
  getTasks,
  getApiError,
} from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const MODE_WORK = "WORK";
const MODE_SHORT_BREAK = "SHORT_BREAK";
const MODE_LONG_BREAK = "LONG_BREAK";

export default function StudySessionsPage() {
  const { user } = useAuth();
  
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [subjectFilter, setSubjectFilter] = useState("All");
  
  // Pomodoro settings
  const settings = user?.pomodoroSettings || {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsUntilLongBreak: 4,
  };
  
  // Timer State
  const [mode, setMode] = useState(MODE_WORK);
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Form/Session State
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  
  const [savingSession, setSavingSession] = useState(false);
  const [saveError, setSaveError] = useState("");
  
  // Timer interval ref
  const timerRef = useRef(null);

  useEffect(() => {
    loadData();
    // Cleanup timer on unmount
    return () => clearInterval(timerRef.current);
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [sesRes, subRes, taskRes] = await Promise.all([
        getStudySessions(),
        getSubjects(),
        getTasks()
      ]);
      setSessions(sesRes.data.studySessions);
      
      const loadedSubjects = subRes.data.subjects;
      setSubjects(loadedSubjects);
      setTasks(taskRes.data.tasks);
      
      if (loadedSubjects.length > 0) {
        setSelectedSubject(loadedSubjects[0].id);
      }
    } catch (err) {
      setError(getApiError(err, "Could not load data"));
    } finally {
      setLoading(false);
    }
  }

  // --- Timer Logic ---
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getDurationForMode = (m) => {
    switch (m) {
      case MODE_WORK: return settings.workMinutes * 60;
      case MODE_SHORT_BREAK: return settings.shortBreakMinutes * 60;
      case MODE_LONG_BREAK: return settings.longBreakMinutes * 60;
      default: return 25 * 60;
    }
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    
    if (mode === MODE_WORK) {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      
      // Attempt to save the session
      if (selectedSubject) {
        setSavingSession(true);
        try {
          const payload = {
            subject: selectedSubject,
            task: selectedTask || undefined,
            date: new Date().toISOString(),
            startTime: new Date(Date.now() - settings.workMinutes * 60000).toISOString(),
            endTime: new Date().toISOString(),
            durationMinutes: settings.workMinutes,
            notes: sessionNotes || `Completed pomodoro session`,
          };
          const res = await createStudySession(payload);
          setSessions([res.data.studySession, ...sessions]);
          setSessionNotes(""); // Clear notes for next session
        } catch (err) {
          setSaveError(getApiError(err, "Failed to save session"));
        } finally {
          setSavingSession(false);
        }
      }
      
      // Move to break
      if (newCompleted % settings.sessionsUntilLongBreak === 0) {
        setMode(MODE_LONG_BREAK);
        setTimeLeft(settings.longBreakMinutes * 60);
      } else {
        setMode(MODE_SHORT_BREAK);
        setTimeLeft(settings.shortBreakMinutes * 60);
      }
    } else {
      // Break is over, go back to work
      setMode(MODE_WORK);
      setTimeLeft(settings.workMinutes * 60);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, completedPomodoros, selectedSubject, selectedTask, sessionNotes]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTimeLeft(getDurationForMode(mode));
  };

  const skipPhase = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    if (mode === MODE_WORK) {
      // When skipping work, we don't save the session, just move to break
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      if (newCompleted % settings.sessionsUntilLongBreak === 0) {
        setMode(MODE_LONG_BREAK);
        setTimeLeft(settings.longBreakMinutes * 60);
      } else {
        setMode(MODE_SHORT_BREAK);
        setTimeLeft(settings.shortBreakMinutes * 60);
      }
    } else {
      setMode(MODE_WORK);
      setTimeLeft(settings.workMinutes * 60);
    }
  };

  const getModeLabel = (m) => {
    switch (m) {
      case MODE_WORK: return "Focus Session";
      case MODE_SHORT_BREAK: return "Short Break";
      case MODE_LONG_BREAK: return "Long Break";
      default: return "";
    }
  };
  
  const getModeColor = (m) => {
    switch (m) {
      case MODE_WORK: return "text-primary-600 bg-primary-50 border-primary-200";
      case MODE_SHORT_BREAK: return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case MODE_LONG_BREAK: return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "";
    }
  };

  // --- Render ---

  if (loading) return <p className="text-sm text-slate-600">Loading study sessions...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const filteredSessions = subjectFilter === "All" 
    ? sessions 
    : sessions.filter(s => s.subject?.id === subjectFilter);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Study Sessions</h1>
        <p className="mt-1 text-sm text-slate-600">Track and manage your focused study time.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Pomodoro Timer */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pomodoro Timer</h2>
            <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${getModeColor(mode)}`}>
              {getModeLabel(mode)}
            </div>
          </div>
          
          <div className="py-6 text-center">
            <span className="text-6xl font-bold tracking-tight text-slate-900 font-mono">
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleTimer}
              className={`flex h-12 w-32 items-center justify-center gap-2 rounded-xl font-medium text-white transition ${
                isRunning ? "bg-slate-800 hover:bg-slate-700" : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {isRunning ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5 ml-1" /> Start</>}
            </button>
            <button
              onClick={resetTimer}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              title="Reset"
            >
              <Square className="h-5 w-5" />
            </button>
            <button
              onClick={skipPhase}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              title="Skip"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Session Configuration
            </p>
            
            {saveError && (
              <p className="rounded text-xs text-red-600">{saveError}</p>
            )}

            <label className="block text-sm font-medium">
              Subject
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500 bg-white"
                disabled={isRunning}
              >
                {subjects.length === 0 && <option value="" disabled>No subjects available</option>}
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Task (Optional)
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500 bg-white"
                disabled={isRunning || !selectedSubject}
              >
                <option value="">No task selected</option>
                {tasks
                  .filter((t) => t.subject?.id === selectedSubject || t.subject === selectedSubject)
                  .map((task) => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Notes (Optional)
              <input
                type="text"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="What are you focusing on?"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500 bg-white"
                disabled={isRunning}
              />
            </label>
          </div>
          
          <div className="mt-2 text-center text-sm font-medium text-slate-600">
            Completed Pomodoros: <span className="text-slate-900">{completedPomodoros}</span>
          </div>
        </div>

        {/* Study Sessions History */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-lg font-semibold">Session History</h2>
            
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
            >
              <option value="All">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No study sessions yet</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Start your first pomodoro session to track your study time automatically.
              </p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No sessions match your filter.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
              {filteredSessions.map((session) => (
                <div key={session.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{session.subject?.name || "Unknown Subject"}</h3>
                      {session.task && (
                        <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3" /> {session.task.title}
                        </p>
                      )}
                      {session.notes && (
                        <p className="text-sm text-slate-500 mt-1">{session.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{session.durationMinutes} min</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                    </div>
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
