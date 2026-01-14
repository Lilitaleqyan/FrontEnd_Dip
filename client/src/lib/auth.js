
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
    console.log("Login response data:", data);
    
    const jwt = data?.token || data?.jwt;
    const userId = data?.id; 
    const responseUsername = data?.username; // Փոխել ենք անունը, որպեսզի չկոնֆլիկտի պարամետրի հետ
    const responseRole = data?.role;
    
    console.log("Extracted values - userId:", userId, "username:", responseUsername, "role:", responseRole);
    
    if (!jwt) {
      throw new Error("No token received from server");
    }
    
    const payload = decodeJwtPayload(jwt);
    console.log("JWT payload:", payload);
    
  const resolvedUsername = responseUsername ||
    username || // օգտագործում ենք պարամետրը fallback-ի համար
    payload?.username ||
    payload?.sub ||
    "user";

  const roleRaw = responseRole ||
    payload?.role ||
    (Array.isArray(payload?.roles) ? payload.roles[0] : undefined) ||
    (typeof payload?.sub === "string" && payload.sub.toLowerCase().includes("admin")
      ? "ADMIN"
      : "USER");

  const finalRole = typeof roleRaw === "string" ? roleRaw : "USER";
  
  // Backend-ից ստանում ենք id-ն ուղղակիորեն
  const finalUserId = userId || 
                 payload?.id || 
                 payload?.userId ||
                 payload?.sub ||
                 payload?.user_id;
  
  console.log("Final userId:", finalUserId);
  
  localStorage.setItem("jwt_token", jwt);
  localStorage.setItem("library_current_user", JSON.stringify({
    id: finalUserId,
    username: resolvedUsername,
    role: finalRole
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
  // Փորձում ենք գտնել userId-ն JWT payload-ից
  const userId = payload?.id || 
                 payload?.userId || 
                 payload?.user_id ||
                 payload?.sub ||
                 payload?.name; // երբեմն sub-ը պարունակում է ID
  
  console.log("getCurrentUser fallback - JWT payload:", payload);
  console.log("getCurrentUser fallback - resolved userId:", userId);

  const reconstructed = { username, role, id: userId };
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
