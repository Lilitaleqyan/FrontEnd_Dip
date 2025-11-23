
import { QueryClient } from "@tanstack/react-query";
// import {  queryClient } from "@/lib/api";


const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8181";

// Helper: throws if the fetch response is not ok
async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Generic API request helper
export async function apiRequest(method, url, data) {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    
  });
  
  await throwIfResNotOk(res);
  return res;
}
// fetch(`${import.meta.env.VITE_API_BASE_URL}/`)
// Behavior for 401 responses
// "returnNull" returns null on 401, "throw" throws an error
export const getQueryFn = ({ on401 }) => async ({ queryKey }) => {
  const token =localStorage.getItem("jwt_token")
  const url = `${API_URL}${queryKey[0]}`;
  const res = await fetch(url, {
    headers: token?{ Authorization: `Bearer ${token}`} : {},
     credentials: "include" });

  if (on401 === "returnNull" && res.status === 401) {
    return null;
  }

  await throwIfResNotOk(res);
  return res.json();
};

// Create a React Query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({on401: "throw"})
      // queryFn: async({ queryKey }) => {
      //    const token = localStorage.getItem('jwt_token');
      //   const res = await fetch(`${API_URL}${queryKey[0]}`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   if (!res.ok) throw new Error('Failed to fetch');
      //   return res.json();
      // }
    },
  },
});
