import { BookMarked, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createSubject,
  deleteSubject,
  getApiError,
  getSubjects,
  updateSubject,
} from "../services/api.js";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", description: "", color: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    setLoading(true);
    try {
      const result = await getSubjects();
      setSubjects(result.data.subjects);
    } catch (err) {
      setError(getApiError(err, "Could not load subjects"));
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setForm({ name: "", code: "", description: "", color: "" });
    setEditingId(null);
    setIsEditing(true);
    setFormError("");
  }

  function handleEdit(subject) {
    setForm({
      name: subject.name,
      code: subject.code || "",
      description: subject.description || "",
      color: subject.color || "",
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
        code: form.code.trim() || undefined,
        description: form.description.trim() || undefined,
        color: form.color.trim() || undefined,
      };

      if (editingId) {
        const result = await updateSubject(editingId, payload);
        setSubjects((curr) => curr.map((s) => (s.id === editingId ? result.data.subject : s)));
      } else {
        const result = await createSubject(payload);
        setSubjects([result.data.subject, ...subjects]);
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
              Subject Code
              <input
                type="text"
                value={form.code}
                onChange={updateField("code")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
                placeholder="e.g. CS101"
              />
            </label>

            <label className="block text-sm font-medium">
              Color
              <input
                type="text"
                value={form.color}
                onChange={updateField("color")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
                placeholder="e.g. Blue, #3b82f6"
              />
            </label>

            <label className="block text-sm font-medium">
              Description
              <textarea
                value={form.description}
                onChange={updateField("description")}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </label>

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
          {subjects.map((subject) => (
            <div key={subject.id} className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{subject.name}</h3>
                  {subject.code && <p className="mt-1 text-xs font-medium text-primary-600">{subject.code}</p>}
                </div>
                {subject.color && (
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                    title={subject.color}
                  />
                )}
              </div>
              {subject.description && <p className="mt-3 text-sm text-slate-600 line-clamp-3">{subject.description}</p>}
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
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
          ))}
        </div>
      )}
    </section>
  );
}
