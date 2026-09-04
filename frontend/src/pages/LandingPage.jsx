import { BookOpen, CalendarDays, ChartLine, Clock3, ListChecks, Timer } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: ListChecks,
    title: "Task planning",
    text: "Capture assignments, projects, and academic work in one organized list.",
  },
  {
    icon: CalendarDays,
    title: "Study planning",
    text: "Plan study sessions around lectures, exams, and available study hours.",
  },
  {
    icon: Clock3,
    title: "Deadlines",
    text: "See what is due soon so overdue work is harder to miss.",
  },
  {
    icon: Timer,
    title: "Productivity",
    text: "Use focused work blocks and breaks when you sit down to study.",
  },
  {
    icon: ChartLine,
    title: "Progress tracking",
    text: "Build a clear picture of completed work as later planner modules land.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary-600" />
            <p className="font-semibold">Student Task & Study Planner</p>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-medium text-primary-600">Plan Better. Study Smarter. Stay on Track.</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900">
          Organize college work without losing track of deadlines.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          A student-focused planner for task planning, study planning, deadlines, productivity, and progress
          tracking. Create an account now to save your profile; academic modules will be added in later phases.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/register" className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
            Create an account
          </Link>
          <Link to="/login" className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            I already have an account
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <feature.icon className="h-5 w-5 text-primary-600" />
              <h2 className="mt-3 font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
