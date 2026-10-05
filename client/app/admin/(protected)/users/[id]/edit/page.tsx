"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAxios } from "@/app/lib/axios";
import { UserForm } from "@/components/admin/UserForm";
import { User } from "@/app/types/user";

export default function EditUserPage() {
  const { axios } = useAxios();

  const params = useParams();
  const id = Number(params.id);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/users/${id}`);

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchUser();
    }
  }, [id, axios]);

  if (loading) {
    return <div className="p-6">Loading user...</div>;
  }

  if (!user) {
    return <div className="p-6">User not found.</div>;
  }

  return <UserForm mode="edit" initialData={user} />;
}
