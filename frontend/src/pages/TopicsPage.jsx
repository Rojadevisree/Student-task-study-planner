import { BookOpen, Edit, Plus, Trash2, LayoutList } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createTopic, deleteTopic, getApiError, getTopics, getSubjects, updateTopic } from "../services/api.js";

const STATUS_LABELS = ["Not Started", "In Progress", "Completed"];
const PRIORITY_LABELS = ["Low", "Medium", "High"];

const PRIORITY_COLORS = {
  High: "text-red-700 bg-red-50 border-red-200",
  Medium: "text-amber-700 bg-amber-50 border-amber-200",
  Low: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterSubject, setFilterSubject] = useState("All");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    status: "Not Started",
    priority: "Medium",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [topicRes, subRes] = await Promise.all([getTopics(), getSubjects()]);
      setTopics(topicRes.data.topics);
      setSubjects(subRes.data.subjects);
    } catch (err) { setError(getApiError(err, "Could not load data")); } 
    finally { setLoading(false); }
  }

  function handleAdd() {
    setForm({
      name: "",
      subject: subjects.length > 0 ? subjects[0].id : "",
      status: "Not Started",
      priority: "Medium",
      description: "",
    });
    setEditingId(null);
    setIsEditing(true);
    setFormError("");
  }

  function handleEdit(topic) {
    setForm({
      name: topic.name,
      subject: topic.subject?.id || topic.subject || "",
      status: topic.status || "Not Started",
      priority: topic.priority || "Medium",
      description: topic.description || "",
    });
    setEditingId(topic.id);
    setIsEditing(true);
    setFormError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this topic?")) return;
    try {
      await deleteTopic(id);
      setTopics((curr) => curr.filter((t) => t.id !== id));
    } catch (err) { alert(getApiError(err, "Could not delete topic")); }
  }

  async function handleStatusChange(topic, newStatus) {
    try {
      const result = await updateTopic(topic.id, { status: newStatus });
      setTopics((curr) => curr.map((t) => (t.id === topic.id ? result.data.topic : t)));
    } catch (err) { alert(getApiError(err, "Could not update status")); }
  }

  function updateField(field) {
    return (event) => setForm((curr) => ({ ...curr, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.subject) {
      setFormError("Name and Subject are required.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        subject: form.subject,
        status: form.status,
        priority: form.priority,
        description: form.description.trim() || undefined,
      };

      if (editingId) {
        const result = await updateTopic(editingId, payload);
        setTopics((curr) => curr.map((t) => (t.id === editingId ? result.data.topic : t)));
      } else {
        const result = await createTopic(payload);
        setTopics((curr) => [result.data.topic, ...curr]);
      }
      setIsEditing(false);
    } catch (err) { setFormError(getApiError(err, "Could not save topic")); } 
    finally { setFormLoading(false); }
  }

  if (loading) return <p className="text-sm text-slate-600">Loading topics...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (subjects.length === 0 && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
        <LayoutList className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-sm font-semibold text-slate-900">No subjects yet</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">Add a subject before creating topics.</p>
        <Link to="/subjects" className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          Go to Subjects
        </Link>
      </div>
    );
  }

  const filteredTopics = filterSubject === "All" ? topics : topics.filter(t => t.subject?.id === filterSubject || t.subject === filterSubject);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Topics</h1>
          <p className="mt-1 text-sm text-slate-600">Organize and track your study syllabus.</p>
        </div>
        {!isEditing && (
          <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            <Plus className="h-4 w-4" /> Add Topic
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Topic" : "New Topic"}</h2>
          <form className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            {formError && <p className="col-span-full rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{formError}</p>}
            
            <label className="block text-sm font-medium col-span-full">
              Name *
              <input type="text" value={form.name} onChange={updateField("name")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500" required />
            </label>

            <label className="block text-sm font-medium">
              Subject *
              <select value={form.subject} onChange={updateField("subject")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500" required>
                <option value="" disabled>Select subject</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Status
              <select value={form.status} onChange={updateField("status")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500">
                {STATUS_LABELS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Priority
              <select value={form.priority} onChange={updateField("priority")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500">
                {PRIORITY_LABELS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium col-span-full">
              Description
              <textarea value={form.description} onChange={updateField("description")} rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500" />
            </label>

            <div className="col-span-full flex gap-3">
              <button type="submit" disabled={formLoading} className="rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
                {formLoading ? "Saving..." : "Save Topic"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} disabled={formLoading} className="rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {topics.length > 0 && (
            <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex-wrap">
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-primary-500">
                <option value="All">All Subjects</option>
                {subjects.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
              </select>
            </div>
          )}
          {topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold">No topics yet</h3>
              <p className="mt-1 text-sm text-slate-500">Break down your subjects into manageable topics.</p>
              <button onClick={handleAdd} className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Add Topic
              </button>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No topics match your filters.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTopics.map((topic) => (
                <div key={topic.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-semibold text-slate-900 ${topic.status === "Completed" ? "opacity-70 line-through" : ""}`}>
                      {topic.name}
                    </h3>
                    <select
                      value={topic.status}
                      onChange={(e) => handleStatusChange(topic, e.target.value)}
                      className={`h-7 rounded border px-1 text-xs font-medium outline-none ${
                        topic.status === "Completed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                        topic.status === "In Progress" ? "border-blue-200 bg-blue-50 text-blue-700" :
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {STATUS_LABELS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="text-slate-500">{topic.subject?.name || "Unknown"}</span>
                    <span className="text-slate-300">•</span>
                    <span className={`rounded-full border px-2 py-0.5 ${PRIORITY_COLORS[topic.priority] || PRIORITY_COLORS.Medium}`}>
                      {topic.priority}
                    </span>
                  </div>

                  {topic.description && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{topic.description}</p>}

                  <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3 flex-grow items-end">
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button onClick={() => handleEdit(topic)} className="p-1 text-slate-400 hover:text-slate-700"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(topic.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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
