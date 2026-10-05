"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAxios } from "@/app/lib/axios";

import { User } from "@/app/types/user";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserFormData, createUserSchema } from "@/schemas/users.schema";

interface UserFormProps {
  mode: "create" | "edit";
  initialData?: User;
}

export function UserForm({ mode, initialData }: UserFormProps) {
  const { axios } = useAxios();
  const router = useRouter();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),

    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const selectedRole = watch("role");

  // --------------------------------------------------
  // Load existing user into form
  // --------------------------------------------------

  useEffect(() => {
    if (!initialData) return;

    reset({
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      email: initialData.email,
      password: "",
      role: initialData.role as "USER" | "ADMIN",
    });
  }, [initialData, reset]);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      // ----------------------------------------------
      // CREATE
      // ----------------------------------------------

      if (mode === "create") {
        const response = await axios.post("/users", data);

        console.log("User created:", response.data);

        form.reset();

        router.push("/admin/users");

        return;
      }

      // ----------------------------------------------
      // UPDATE
      // ----------------------------------------------

      if (!initialData) {
        console.error("Cannot update user without user data.");

        return;
      }

      // Don't send empty password
      const updateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,

        ...(data.password.trim() !== "" && {
          password: data.password,
        }),
      };

      const response = await axios.patch(
        `/users/${initialData.id}`,
        updateData,
      );

      console.log("User updated:", response.data);

      router.push("/admin/users");
    } catch (error: any) {
      console.error(
        mode === "create" ? "Failed to create user:" : "Failed to update user:",
        error,
      );
    }
  };

  return (
    <div className="p-6">
      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {mode === "edit" ? "Edit User" : "Add User"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {mode === "edit"
            ? "Update the user's information."
            : "Create a new user account."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* -------------------------------- */}
        {/* USER INFORMATION */}
        {/* -------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* First Name */}

            <div>
              <label className="text-sm font-medium">First Name</label>

              <Input {...register("first_name")} placeholder="John" />

              {errors.first_name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}

            <div>
              <label className="text-sm font-medium">Last Name</label>

              <Input {...register("last_name")} placeholder="Doe" />

              {errors.last_name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Email */}

            <div>
              <label className="text-sm font-medium">Email</label>

              <Input
                type="email"
                {...register("email")}
                placeholder="john@example.com"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-medium">Password</label>

              <Input
                type="password"
                {...register("password")}
                placeholder={
                  mode === "edit"
                    ? "Leave empty to keep current password"
                    : "Enter password"
                }
              />

              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}

              {mode === "edit" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave this field empty if you don't want to change the
                  password.
                </p>
              )}
            </div>

            {/* Role */}

            <div>
              <label className="text-sm font-medium">Role</label>

              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setValue("role", value as "USER" | "ADMIN", {
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>

                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>

              {errors.role && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* -------------------------------- */}
        {/* SUBMIT */}
        {/* -------------------------------- */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update User"
              : "Create User"}
        </Button>
      </form>
    </div>
  );
}
