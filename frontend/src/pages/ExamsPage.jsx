import { formatDate } from "../utils/formatDate.js";
import { Clock, Edit, GraduationCap, Plus, Trash2, Calendar, BookOpen, LayoutList } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createExam, deleteExam, getApiError, getExams, getSubjects, updateExam } from "../services/api.js";

const EXAM_TYPES = ["Internal", "Mid", "Semester", "Practical", "Viva", "Other"];
const STATUS_LABELS = ["Upcoming", "Completed"];

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    examDate: "",
    examType: "Other",
    status: "Upcoming",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [examRes, subRes] = await Promise.all([getExams(), getSubjects()]);
      setExams(examRes.data.exams);
      setSubjects(subRes.data.subjects);
    } catch (err) { setError(getApiError(err, "Could not load data")); } 
    finally { setLoading(false); }
  }

  function handleAdd() {
    setForm({
      title: "",
      subject: subjects.length > 0 ? subjects[0].id : "",
      examDate: new Date().toISOString().split("T")[0],
      examType: "Mid",
      status: "Upcoming",
      description: "",
    });
    setEditingId(null);
    setIsEditing(true);
    setFormError("");
  }

  function handleEdit(exam) {
    setForm({
      title: exam.title,
      subject: exam.subject?.id || exam.subject || "",
      examDate: exam.examDate ? new Date(exam.examDate).toISOString().split("T")[0] : "",
      examType: exam.examType || "Other",
      status: exam.status || "Upcoming",
      description: exam.description || "",
    });
    setEditingId(exam.id);
    setIsEditing(true);
    setFormError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await deleteExam(id);
      setExams((curr) => curr.filter((e) => e.id !== id));
    } catch (err) { alert(getApiError(err, "Could not delete exam")); }
  }

  async function handleStatusChange(exam, newStatus) {
    try {
      const result = await updateExam(exam.id, { status: newStatus });
      setExams((curr) => curr.map((e) => (e.id === exam.id ? result.data.exam : e)));
    } catch (err) { alert(getApiError(err, "Could not update status")); }
  }

  function updateField(field) {
    return (event) => setForm((curr) => ({ ...curr, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.subject || !form.examDate) {
      setFormError("Title, Subject, and Date are required.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        subject: form.subject,
        examDate: new Date(form.examDate).toISOString(),
        examType: form.examType,
        status: form.status,
        description: form.description.trim() || undefined,
      };

      if (editingId) {
        const result = await updateExam(editingId, payload);
        setExams((curr) => curr.map((e) => (e.id === editingId ? result.data.exam : e)).sort((a,b) => new Date(a.examDate) - new Date(b.examDate)));
      } else {
        const result = await createExam(payload);
        setExams((curr) => [...curr, result.data.exam].sort((a,b) => new Date(a.examDate) - new Date(b.examDate)));
      }
      setIsEditing(false);
    } catch (err) { setFormError(getApiError(err, "Could not save exam")); } 
    finally { setFormLoading(false); }
  }

  if (loading) return <p className="text-sm text-slate-600">Loading exams...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (subjects.length === 0 && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
        <LayoutList className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-sm font-semibold text-slate-900">No subjects yet</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">Add a subject before creating an exam.</p>
        <Link to="/subjects" className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          Go to Subjects
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Exams</h1>
          <p className="mt-1 text-sm text-slate-600">Track and manage your upcoming exams.</p>
        </div>
        {!isEditing && (
          <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            <Plus className="h-4 w-4" /> Add Exam
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Exam" : "New Exam"}</h2>
          <form className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            {formError && <p className="col-span-full rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{formError}</p>}
            
            <label className="block text-sm font-medium col-span-full">
              Title *
              <input type="text" value={form.title} onChange={updateField("title")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500" required />
            </label>

            <label className="block text-sm font-medium">
              Subject *
              <select value={form.subject} onChange={updateField("subject")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500" required>
                <option value="" disabled>Select subject</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Exam Date *
              <input type="date" value={form.examDate} onChange={updateField("examDate")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500" required />
            </label>

            <label className="block text-sm font-medium">
              Exam Type
              <select value={form.examType} onChange={updateField("examType")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500">
                {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium">
              Status
              <select value={form.status} onChange={updateField("status")} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500">
                {STATUS_LABELS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium col-span-full">
              Description
              <textarea value={form.description} onChange={updateField("description")} rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500" />
            </label>

            <div className="col-span-full flex gap-3">
              <button type="submit" disabled={formLoading} className="rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
                {formLoading ? "Saving..." : "Save Exam"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} disabled={formLoading} className="rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold">No exams yet</h3>
              <p className="mt-1 text-sm text-slate-500">Add an exam to keep track of your schedule.</p>
              <button onClick={handleAdd} className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Add Exam
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <div key={exam.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-semibold text-slate-900 ${exam.status === "Completed" ? "opacity-70 line-through" : ""}`}>
                      {exam.title}
                    </h3>
                    <select
                      value={exam.status}
                      onChange={(e) => handleStatusChange(exam, e.target.value)}
                      className={`h-7 rounded border px-1 text-xs font-medium outline-none ${
                        exam.status === "Completed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {STATUS_LABELS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="text-slate-500">{exam.subject?.name || "Unknown"}</span>
                    <span className="text-slate-300">•</span>
                    <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5">{exam.examType}</span>
                  </div>

                  {exam.description && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{exam.description}</p>}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 flex-grow items-end">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="h-4 w-4" />
                      {formatDate(exam.examDate)}
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button onClick={() => handleEdit(exam)} className="p-1 text-slate-400 hover:text-slate-700"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(exam.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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
