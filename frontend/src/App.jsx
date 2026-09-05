import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SubjectsPage from "./pages/SubjectsPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import StudySessionsPage from "./pages/StudySessionsPage.jsx";
import ExamsPage from "./pages/ExamsPage.jsx";
import TopicsPage from "./pages/TopicsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/study-sessions" element={<StudySessionsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
