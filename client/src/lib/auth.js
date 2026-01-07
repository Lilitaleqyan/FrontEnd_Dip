
const API_URL = import.meta.env.VITE_API_BASE_URL;

const CURRENT_USER_KEY = "library_current_user";

function decodeJwtPayload(token) {
  try {
    const [, payloadBase64] = token.split(".");
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch (err) {
    console.error("Failed to decode JWT payload", err);
    return {};
  }
}
export async function registerUser(user) {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      let errorMessage = "Registration failed";
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch (err) {
      }
      throw new Error(errorMessage);
    }

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
    }

    return data;
  } catch (err) {
    console.error("Registration error:", err.message);
    throw err;
  }
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, password }),
    credentials: "include" 
  });

  if (!res.ok) {
    let errorMessage = "Invalid username or password";
    console.log(errorMessage)
    try {
      const errorData = await res.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (err) {
      console.log(err);
    }
    throw new Error(errorMessage);
  }
    const data = await res.json();
    console.log(data)
  const payload = data?.token ? decodeJwtPayload(data.token) : {};

  const resolvedUsername =
    data?.username ||
    data?.user?.username ||
    payload?.username ||
    payload?.sub ||
    "user";

  const roleRaw =
    data?.role ||
    data?.user?.role ||
    payload?.role ||
    (Array.isArray(payload?.roles) ? payload.roles[0] : undefined) ||
    (typeof payload?.sub === "string" && payload.sub.toLowerCase().includes("admin")
      ? "ADMIN"
      : "USER");

  const role = typeof roleRaw === "string" ? roleRaw : "USER";

  localStorage.setItem("jwt_token", data.token);
  localStorage.setItem("library_current_user", JSON.stringify({
    username: resolvedUsername,
    role
  }));
  return data;
}


export function getCurrentUser() {
  // prefer persisted user payload
  const stored = localStorage.getItem("library_current_user");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length) {
        return parsed;
      }
    } catch (_err) {
      // fall through to token-based reconstruction
    }
  }

  // fallback: reconstruct from JWT if present
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const username =
    payload?.username ||
    payload?.sub ||
    "user";

  const roleRaw =
    payload?.role ||
    (Array.isArray(payload?.roles) ? payload.roles[0] : undefined) ||
    (typeof payload?.sub === "string" && payload.sub.toLowerCase().includes("admin")
      ? "ADMIN"
      : "USER");

  const role = typeof roleRaw === "string" ? roleRaw : "USER";

  const reconstructed = { username, role };
  localStorage.setItem("library_current_user", JSON.stringify(reconstructed));
  return reconstructed;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  // treat role comparison case-insensitively to match backend enum
  return user?.role?.toLowerCase() === "admin";
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/log_out`,  {
    method:"POST",
    credentials:"include"
  });

  localStorage.removeItem("jwt_token")
  localStorage.removeItem("library_current_user");
}
