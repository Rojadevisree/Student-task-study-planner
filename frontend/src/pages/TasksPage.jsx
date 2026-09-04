import { CheckCircle2, Clock, Edit, Plus, Trash2, Calendar, LayoutList } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getApiError,
  getSubjects,
  getTasks,
  updateTask,
} from "../services/api.js";

const PRIORITY_COLORS = {
  High: "text-red-700 bg-red-50 border-red-200",
  Medium: "text-amber-700 bg-amber-50 border-amber-200",
  Low: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

const STATUS_LABELS = ["Pending", "In Progress", "Completed"];
const PRIORITY_LABELS = ["Low", "Medium", "High"];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    subject: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [tasksRes, subRes] = await Promise.all([getTasks(), getSubjects()]);
      setTasks(tasksRes.data.tasks);
      setSubjects(subRes.data.subjects);
    } catch (err) {
      setError(getApiError(err, "Could not load data"));
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setForm({
      subject: subjects.length > 0 ? subjects[0].id : "",
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "Medium",
      status: "Pending",
    });
    setEditingId(null);
    setIsEditing(true);
    setFormError("");
  }

  function handleEdit(task) {
    setForm({
      subject: task.subject?.id || task.subject || "",
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
    });
    setEditingId(task.id);
    setIsEditing(true);
    setFormError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((curr) => curr.filter((t) => t.id !== id));
    } catch (err) {
      alert(getApiError(err, "Could not delete task"));
    }
  }

  async function handleStatusChange(task, newStatus) {
    try {
      const result = await updateTask(task.id, { status: newStatus });
      setTasks((curr) => curr.map((t) => (t.id === task.id ? result.data.task : t)));
    } catch (err) {
      alert(getApiError(err, "Could not update status"));
    }
  }

  function updateField(field) {
    return (event) => setForm((curr) => ({ ...curr, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.subject || !form.dueDate) {
      setFormError("Title, Subject, and Due Date are required.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        subject: form.subject,
        description: form.description.trim() || undefined,
        dueDate: new Date(form.dueDate).toISOString(),
        priority: form.priority,
        status: form.status,
      };

      if (editingId) {
        const result = await updateTask(editingId, payload);
        setTasks((curr) => curr.map((t) => (t.id === editingId ? result.data.task : t)));
      } else {
        const result = await createTask(payload);
        setTasks((curr) => {
          const newTasks = [result.data.task, ...curr];
          // sort by due date basic
          return newTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        });
      }
      setIsEditing(false);
    } catch (err) {
      setFormError(getApiError(err, "Could not save task"));
    } finally {
      setFormLoading(false);
    }
  }

  const isOverdue = (task) => {
    if (task.status === "Completed") return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return due < now;
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus !== "All" && t.status !== filterStatus) return false;
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    if (filterSubject !== "All" && (t.subject?.id || t.subject) !== filterSubject) return false;
    return true;
  });

  if (loading) return <p className="text-sm text-slate-600">Loading tasks...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (subjects.length === 0 && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
        <LayoutList className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-sm font-semibold text-slate-900">No subjects yet</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          You need to add a subject before creating a task.
        </p>
        <Link
          to="/subjects"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Go to Subjects
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your academic assignments and tasks.</p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Task" : "New Task"}</h2>
          <form className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            {formError && (
              <p className="col-span-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </p>
            )}

            <label className="block text-sm font-medium col-span-full">
              Title *
              <input
                type="text"
                value={form.title}
                onChange={updateField("title")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Subject *
              <select
                value={form.subject}
                onChange={updateField("subject")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
                required
              >
                <option value="" disabled>Select a subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Due Date *
              <input
                type="date"
                value={form.dueDate}
                onChange={updateField("dueDate")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Priority
              <select
                value={form.priority}
                onChange={updateField("priority")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                {PRIORITY_LABELS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Status
              <select
                value={form.status}
                onChange={updateField("status")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              >
                {STATUS_LABELS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium col-span-full">
              Description
              <textarea
                value={form.description}
                onChange={updateField("description")}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </label>

            <div className="col-span-full flex gap-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {formLoading ? "Saving..." : "Save Task"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={formLoading}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {tasks.length > 0 && (
            <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
              >
                <option value="All">All Status</option>
                {STATUS_LABELS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
              >
                <option value="All">All Priorities</option>
                {PRIORITY_LABELS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-primary-500"
              >
                <option value="All">All Subjects</option>
                {subjects.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
              </select>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">No tasks yet</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                You have no tasks created. Add your first task to get started.
              </p>
              <button
                type="button"
                onClick={handleAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No tasks match your current filters.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-semibold text-slate-900 ${task.status === "Completed" ? "line-through opacity-70" : ""}`}>
                      {task.title}
                    </h3>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      className={`h-7 rounded border px-1 text-xs font-medium outline-none ${
                        task.status === "Completed"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : task.status === "In Progress"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {STATUS_LABELS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2 text-xs font-medium">
                    <span className="text-slate-500">{task.subject?.name || "Unknown Subject"}</span>
                    <span className="text-slate-300">•</span>
                    <span className={`rounded-full border px-2 py-0.5 ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium}`}>
                      {task.priority}
                    </span>
                    {isOverdue(task) && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">Overdue</span>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="mt-3 text-sm text-slate-600 line-clamp-2 flex-grow">{task.description}</p>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleEdit(task)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Edit task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
