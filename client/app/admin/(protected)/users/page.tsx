import { User } from "@/app/types/user";
import UsersTable from "@/components/client/UsersTable";

const UsersPage = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const users: User[] = await response.json();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>

        <p className="text-sm text-muted-foreground">
          Manage users and their accounts.
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
};

export default UsersPage;
