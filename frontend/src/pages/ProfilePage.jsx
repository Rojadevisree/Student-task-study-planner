import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiError, getProfile, updateProfile } from "../services/api.js";

const TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

const emptyPomodoro = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4,
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [timezone, setTimezone] = useState(user?.timezone || "UTC");
  const [pomodoro, setPomodoro] = useState(user?.pomodoroSettings || emptyPomodoro);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getProfile();
        const profile = result.data.user;
        setName(profile.name);
        setTimezone(profile.timezone || "UTC");
        setPomodoro({ ...emptyPomodoro, ...profile.pomodoroSettings });
        setUser(profile);
      } catch (err) {
        setError(getApiError(err, "Could not load profile"));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [setUser]);

  function updatePomodoro(field) {
    return (event) => {
      setPomodoro((current) => ({
        ...current,
        [field]: Number(event.target.value),
      }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      setError("Name must be between 2 and 80 characters.");
      return;
    }

    const ranges = [
      ["workMinutes", 1, 120, "Work minutes"],
      ["shortBreakMinutes", 1, 60, "Short break minutes"],
      ["longBreakMinutes", 1, 60, "Long break minutes"],
      ["sessionsUntilLongBreak", 1, 12, "Sessions until long break"],
    ];

    for (const [field, min, max, label] of ranges) {
      const value = Number(pomodoro[field]);
      if (!Number.isInteger(value) || value < min || value > max) {
        setError(`${label} must be an integer between ${min} and ${max}.`);
        return;
      }
    }

    setSaving(true);

    try {
      const result = await updateProfile({
        name: name.trim(),
        timezone,
        pomodoroSettings: pomodoro,
      });
      setUser(result.data.user);
      setSuccess("Profile saved.");
    } catch (err) {
      setError(getApiError(err, "Could not update profile"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Loading profile...</p>;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-slate-600">Update your account details and Pomodoro defaults. Email cannot be changed here.</p>

      <form className="mt-6 max-w-lg space-y-4" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}

        <label className="block text-sm font-medium">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
            required
          />
        </label>

        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
          />
        </label>

        <label className="block text-sm font-medium">
          Timezone
          <select
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
          >
            {Array.from(new Set([timezone, ...TIMEZONES])).map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>

        <div>
          <h2 className="text-sm font-semibold">Pomodoro settings</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Work minutes
              <input
                type="number"
                min={1}
                max={120}
                value={pomodoro.workMinutes}
                onChange={updatePomodoro("workMinutes")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Short break
              <input
                type="number"
                min={1}
                max={60}
                value={pomodoro.shortBreakMinutes}
                onChange={updatePomodoro("shortBreakMinutes")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Long break
              <input
                type="number"
                min={1}
                max={60}
                value={pomodoro.longBreakMinutes}
                onChange={updatePomodoro("longBreakMinutes")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Sessions until long break
              <input
                type="number"
                min={1}
                max={12}
                value={pomodoro.sessionsUntilLongBreak}
                onChange={updatePomodoro("sessionsUntilLongBreak")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
