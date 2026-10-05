"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/app/lib/axios";
import { useAuth } from "@/app/lib/useAuth";

export default function AdminLoginPage() {
  const { axios } = useAxios();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user?.role === "ADMIN") {
      router.replace("/admin");
    }

    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, loading, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loginLoading, setloginLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    setError("");
    setloginLoading(true);

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const user = response.data.user;

      if (user.role !== "ADMIN") {
        setError("You do not have permission to access the admin panel.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setloginLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">Admin Login</h1>

        <p className="mb-6 text-sm text-gray-500">
          Sign in to access the administration panel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border p-2"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border p-2"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loginLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
