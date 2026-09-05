import axios from "axios";

export const TOKEN_STORAGE_KEY = "studentPlannerToken";
export const AUTH_SESSION_EVENT = "student-planner-auth-session";

export const api = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url || "");
    const isCredentialRequest = url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isCredentialRequest && getStoredToken()) {
      setStoredToken(null);
      window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT));
    }

    return Promise.reject(error);
  }
);

export async function fetchHealth() {
  const response = await api.get("/health");
  return response.data;
}

export async function registerRequest(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginRequest(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function logoutRequest() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function getProfile() {
  const response = await api.get("/users/profile");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.put("/users/profile", payload);
  return response.data;
}

export async function getSubjects() {
  const response = await api.get("/subjects");
  return response.data;
}

export async function getSubject(id) {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
}

export async function createSubject(data) {
  const response = await api.post("/subjects", data);
  return response.data;
}

export async function updateSubject(id, data) {
  const response = await api.put(`/subjects/${id}`, data);
  return response.data;
}

export async function deleteSubject(id) {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
}

export async function getTasks() {
  const response = await api.get("/tasks");
  return response.data;
}

export async function getTask(id) {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
}

export async function createTask(data) {
  const response = await api.post("/tasks", data);
  return response.data;
}

export async function updateTask(id, data) {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
}

export async function deleteTask(id) {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
}

export async function getStudySessions() {
  const response = await api.get("/study-sessions");
  return response.data;
}

export async function getStudySession(id) {
  const response = await api.get(`/study-sessions/${id}`);
  return response.data;
}

export async function createStudySession(data) {
  const response = await api.post("/study-sessions", data);
  return response.data;
}

export async function updateStudySession(id, data) {
  const response = await api.put(`/study-sessions/${id}`, data);
  return response.data;
}

export async function deleteStudySession(id) {
  const response = await api.delete(`/study-sessions/${id}`);
  return response.data;
}

export async function getExams() {
  const response = await api.get("/exams");
  return response.data;
}

export async function getExam(id) {
  const response = await api.get(`/exams/${id}`);
  return response.data;
}

export async function createExam(data) {
  const response = await api.post("/exams", data);
  return response.data;
}

export async function updateExam(id, data) {
  const response = await api.put(`/exams/${id}`, data);
  return response.data;
}

export async function deleteExam(id) {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
}

export async function getTopics() {
  const response = await api.get("/topics");
  return response.data;
}

export async function getTopic(id) {
  const response = await api.get(`/topics/${id}`);
  return response.data;
}

export async function createTopic(data) {
  const response = await api.post("/topics", data);
  return response.data;
}

export async function updateTopic(id, data) {
  const response = await api.put(`/topics/${id}`, data);
  return response.data;
}

export async function deleteTopic(id) {
  const response = await api.delete(`/topics/${id}`);
  return response.data;
}

export async function getNotifications() {
  const response = await api.get("/notifications");
  return response.data;
}

export async function getUnreadNotificationCount() {
  const response = await api.get("/notifications/unread-count");
  return response.data;
}

export async function markNotificationAsRead(id) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch("/notifications/read-all");
  return response.data;
}

export async function deleteNotification(id) {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
}

export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary");
  return response.data;
}

export async function getAnalyticsSummary() {
  const response = await api.get("/dashboard/analytics");
  return response.data;
}

export function getApiError(error, fallback = "Something went wrong") {
  const data = error.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((item) => item.message).join(" ");
  }

  return data?.message || error.message || fallback;
}
