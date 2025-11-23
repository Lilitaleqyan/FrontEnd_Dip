const API_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_URL);
// const CURRENT_USER_KEY = "library_current_user";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, password }),
    credentials: "include" 
  });

  if (!res.ok) {
    let errorMessage = "Invalid username or password";
    try {
      const errorData = await res.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (err) {
      console.log(err)

    }
        throw new Error(errorMessage);
  }

  const data = await res.json();
  localStorage.setItem("jwt_token", data.token);
  localStorage.setItem("current_user", JSON.stringify({username:data.username, password:data.role}))
  return data;
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/log_out`,  {
    method:"POST",
    credentials:"include"
  });

  // localStorage.removeItem("jwt_token")
  // localStorage.removeItem("current_user");
}

export async function getCurrentUser() {
  const stored = await localStorage.getItem("current_user");
  return stored ? JSON.parse(stored) : null;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}
