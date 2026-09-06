import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiError } from "../services/api.js";

import PasswordInput from "../components/PasswordInput.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
    } catch (err) {
      setError(getApiError(err, "Could not create account"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold dark:text-white">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Start organizing your academic work.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && <p className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400">{error}</p>}

          <label className="block text-sm font-medium dark:text-slate-300">
            Name
            <input
              type="text"
              value={form.name}
              onChange={updateField("name")}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-primary-500"
              autoComplete="name"
              required
            />
          </label>

          <label className="block text-sm font-medium dark:text-slate-300">
            Email
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-primary-500"
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm font-medium dark:text-slate-300">
            Password
            <PasswordInput
              value={form.password}
              onChange={updateField("password")}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-primary-500"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label className="block text-sm font-medium dark:text-slate-300">
            Confirm password
            <PasswordInput
              value={form.confirmPassword}
              onChange={updateField("confirmPassword")}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:border-primary-500"
              autoComplete="new-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
