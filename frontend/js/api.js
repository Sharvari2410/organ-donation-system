const API_BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Request failed");
  }

  return response.json();
}

function createDonor(payload) {
  return request("/donors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function createRecipient(payload) {
  return request("/recipients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function getAdminSummary() {
  return request("/matches/admin-summary");
}

function getMatches() {
  return request("/matches");
}
