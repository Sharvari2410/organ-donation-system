const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function getAuthSession() {
  try {
    return JSON.parse(localStorage.getItem("lifelinkAuth") || "null");
  } catch {
    return null;
  }
}

function authHeaders() {
  const session = getAuthSession();
  if (!session?.user) return {};
  return {
    "x-user-role": session.user.role,
    "x-user-name": session.user.name,
  };
}

async function apiRequest(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: { "Content-Type": "application/json", ...customHeaders },
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => "");

  if (!response.ok) {
    const message =
      (typeof payload === "object" && (payload.message || payload.error)) ||
      (typeof payload === "string" && payload) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export function createDonor(payload) {
  return apiRequest("/donors", { method: "POST", body: JSON.stringify(payload) });
}

export function createRecipient(payload) {
  return apiRequest("/recipients", { method: "POST", body: JSON.stringify(payload) });
}

export function getDonors(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value).trim());
    }
  });
  const queryString = params.toString();
  return apiRequest(`/donors${queryString ? `?${queryString}` : ""}`);
}

export function getRecipients(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value).trim());
    }
  });
  const queryString = params.toString();
  return apiRequest(`/recipients${queryString ? `?${queryString}` : ""}`);
}

export function getRecipientMatches(recipientId) {
  return apiRequest(`/matches/recipient/${recipientId}`);
}

export function getRecipientMatchesByContact({ email = "", phone = "" }) {
  const params = new URLSearchParams();
  if (email.trim()) params.set("email", email.trim());
  if (phone.trim()) params.set("phone", phone.trim());
  return apiRequest(`/matches/recipient/search?${params.toString()}`);
}

export function login(payload) {
  return apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export function getMatchRequests(status = "") {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  const queryString = params.toString();
  return apiRequest(`/match-requests${queryString ? `?${queryString}` : ""}`, {
    headers: authHeaders(),
  });
}

export function createMatchRequest(payload) {
  return apiRequest("/match-requests", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function reviewMatchRequest(matchRequestId, status) {
  return apiRequest(`/match-requests/${matchRequestId}/review`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
}

export function scheduleAppointment(matchRequestId, appointmentAt) {
  return apiRequest(`/match-requests/${matchRequestId}/appointment`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ appointmentAt }),
  });
}

export function getRecipientAppointmentsByContact({ email = "", phone = "" }) {
  const params = new URLSearchParams();
  if (email.trim()) params.set("email", email.trim());
  if (phone.trim()) params.set("phone", phone.trim());
  return apiRequest(`/match-requests/recipient/schedule?${params.toString()}`, {
    headers: authHeaders(),
  });
}

export function getDonorAppointmentsByContact({ email = "", phone = "" }) {
  const params = new URLSearchParams();
  if (email.trim()) params.set("email", email.trim());
  if (phone.trim()) params.set("phone", phone.trim());
  return apiRequest(`/match-requests/donor/schedule?${params.toString()}`, {
    headers: authHeaders(),
  });
}
