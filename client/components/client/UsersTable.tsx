"use client";

import { User } from "@/app/types/user";
import { useAxios } from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UsersTableProps {
  users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const { axios } = useAxios();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/users/${id}`);

      console.log("User deleted successfully");

      router.refresh();
    } catch (error: any) {
      console.error(
        "Failed to delete user:",
        error.response?.data?.message || error,
      );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                {/* ID */}

                <TableCell>{user.id}</TableCell>

                {/* Name */}

                <TableCell className="font-medium">
                  {user.first_name} {user.last_name}
                </TableCell>

                {/* Email */}

                <TableCell>{user.email}</TableCell>

                {/* Role */}

                <TableCell>
                  <span
                    className={
                      user.role === "ADMIN"
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {user.role}
                  </span>
                </TableCell>

                {/* Created */}

                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>

                {/* Actions */}

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      }
                    />

                    <DropdownMenuContent align="end">
                      {/* View */}

                      <DropdownMenuItem
                        render={<Link href={`/admin/users/${user.id}`} />}
                      >
                        View
                      </DropdownMenuItem>

                      {/* Edit */}

                      <DropdownMenuItem
                        render={<Link href={`/admin/users/${user.id}/edit`} />}
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Delete */}

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
