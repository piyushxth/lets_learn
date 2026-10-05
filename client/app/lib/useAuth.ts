"use client";

import { useEffect, useState } from "react";
import { useAxios } from "./axios";

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface MeResponse {
  user: AuthUser;
}

export function useAuth() {
  const { axios } = useAxios();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get<MeResponse>("/auth/me");

        setUser(response.data.user);
      } catch (error: any) {
        if (error.response?.status === 401) {
          // User is simply not logged in.
          setUser(null);
        } else {
          // Something else went wrong.
          console.error("Authentication check failed:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [axios]);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
  };
}
