import { BookMarked, Edit, Plus, Trash2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createSubject,
  deleteSubject,
  getApiError,
  getSubjects,
  updateSubject,
} from "../services/api.js";

const PREDEFINED_COLORS = [
  { hex: "#ef4444", name: "Red" },
  { hex: "#f97316", name: "Orange" },
  { hex: "#f59e0b", name: "Yellow" },
  { hex: "#10b981", name: "Green" },
  { hex: "#3b82f6", name: "Blue" },
  { hex: "#6366f1", name: "Indigo" },
  { hex: "#8b5cf6", name: "Purple" },
  { hex: "#ec4899", name: "Pink" },
  { hex: "#64748b", name: "Slate" },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", difficulty: "Medium", color: "#3b82f6" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    setLoading(true);
    try {
      const result = await getSubjects();
      setSubjects(result.data.subjects || result.data || []);
    } catch (err) {
      setError(getApiError(err, "Could not load subjects"));
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setForm({ name: "", difficulty: "Medium", color: "#3b82f6" });
    setEditingId(null);
    setIsEditing(true);
    setFormError("");
  }

  function handleEdit(subject) {
    setForm({
      name: subject.name,
      difficulty: subject.difficulty || "Medium",
      color: subject.color || "#3b82f6",
    });
    setEditingId(subject.id);
    setIsEditing(true);
    setFormError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    
    try {
      await deleteSubject(id);
      setSubjects((curr) => curr.filter((s) => s.id !== id));
    } catch (err) {
      alert(getApiError(err, "Could not delete subject"));
    }
  }

  function updateField(field) {
    return (event) => setForm((curr) => ({ ...curr, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Subject name is required.");
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        difficulty: form.difficulty,
        color: form.color,
      };

      if (editingId) {
        const result = await updateSubject(editingId, payload);
        const updated = result.data.subject || result.data;
        setSubjects((curr) => curr.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const result = await createSubject(payload);
        const created = result.data.subject || result.data;
        // The backend might not immediately attach progress to newly created via createSubject (since it wasn't there before), so default it to 0 if missing
        if (created.completionPercentage === undefined) {
          created.completionPercentage = 0;
          created.totalTasks = 0;
          created.completedTasks = 0;
        }
        setSubjects([created, ...subjects]);
      }
      setIsEditing(false);
    } catch (err) {
      setFormError(getApiError(err, "Could not save subject"));
    } finally {
      setFormLoading(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Loading subjects...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your academic subjects.</p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Subject" : "New Subject"}</h2>
          <form className="mt-6 max-w-lg space-y-4" onSubmit={handleSubmit}>
            {formError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

            <label className="block text-sm font-medium">
              Subject Name *
              <input
                type="text"
                value={form.name}
                onChange={updateField("name")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Difficulty Level *
              <select
                value={form.difficulty}
                onChange={updateField("difficulty")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500 bg-white"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">Color *</label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setForm(curr => ({ ...curr, color: c.hex }))}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {form.color.toLowerCase() === c.hex.toLowerCase() && (
                      <Check className="h-4 w-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500 uppercase">
                {PREDEFINED_COLORS.find(c => c.hex.toLowerCase() === form.color.toLowerCase())?.name || "Custom"} ({form.color})
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {formLoading ? "Saving..." : "Save Subject"}
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
      ) : subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <BookMarked className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-semibold text-slate-900">No subjects yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add your academic subjects to begin organizing your planner.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const pct = subject.completionPercentage || 0;
            return (
              <div key={subject.id} className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      {subject.name}
                      {subject.color && (
                        <span
                          className="h-2.5 w-2.5 rounded-full inline-block"
                          style={{ backgroundColor: subject.color }}
                          title={subject.color}
                        />
                      )}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Difficulty: <span className="text-slate-700">{subject.difficulty || 'Medium'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleEdit(subject)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Edit subject"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(subject.id)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-600">Task Completion</span>
                    <span className="text-slate-900">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ width: `${pct}%`, backgroundColor: subject.color || '#3b82f6' }}
                    ></div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {subject.completedTasks || 0} / {subject.totalTasks || 0} tasks completed
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
