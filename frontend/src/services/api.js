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

export function getApiError(error, fallback = "Something went wrong") {
  const data = error.response?.data;

  if (data?.errors?.length) {
    return data.errors.map((item) => item.message).join(" ");
  }

  return data?.message || error.message || fallback;
}
