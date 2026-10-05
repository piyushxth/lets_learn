// "use client";

// import { useAxios } from "@/app/lib/axios";
// import { useState } from "react";

// export default function TestLoginPage() {
//   const { axios } = useAxios();

//   const [message, setMessage] = useState("");

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("/auth/login", {
//         email: "admin@example.com",
//         password: "password123",
//       });

//       console.log("LOGIN:", response.data);

//       setMessage("Login successful!");
//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//       setMessage("Login failed");
//     }
//   };

//   return (
//     <main>
//       <h1>Test Login</h1>

//       <button onClick={handleLogin}>Login as Admin</button>

//       <p>{message}</p>
//     </main>
//   );
// }
"use client";

import { useAxios } from "@/app/lib/axios";
import { useAuth } from "@/app/lib/useAuth";
import { useState } from "react";

export default function TestAuthHook() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const { axios } = useAxios();

  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/auth/login", {
        email: "admin@example.com",
        password: "password123",
      });

      console.log("LOGIN:", response.data);

      setMessage("Login successful!");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage("Login failed");
    }
  };

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return <p>Not authenticated</p>;
  }

  return (
    <main>
      <h1>Authenticated</h1>
      <button onClick={handleLogin}>Login as Admin</button>

      <p>{message}</p>
      <p>
        Name: {user?.first_name} {user?.last_name}
      </p>

      <p>Email: {user?.email}</p>

      <p>Role: {user?.role}</p>

      <p>Admin: {isAdmin ? "Yes" : "No"}</p>
    </main>
  );
}
