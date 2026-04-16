// src/utils/useFetchClient.ts
import { isTokenExpired } from "./jwtHelper";

export function useFetchClient() {
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data.accessToken;
    } catch {
      return null;
    }
  };

  const protectedFetch = async (
    url: string,
    options: RequestInit = {},
  ): Promise<Response> => {
    let token = localStorage.getItem("accessToken");

    if (token && isTokenExpired(token)) {
      token = await refreshAccessToken();
      if (!token) throw new Error("Session expired");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) throw new Error("Session expired");

      response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
    }

    return response;
  };

  return { protectedFetch };
}
