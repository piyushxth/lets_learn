"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAxios } from "@/app/lib/axios";

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

export default function AddUserPage() {
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const selectedRole = watch("role");

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      console.log("data from ", data);
      const response = await axios.post("/users", data);

      console.log("User created:", response.data);

      // Reset form after successful creation
      form.reset();

      // Go back to users page
      router.push("/admin/users");
    } catch (error: any) {
      console.error("Failed to create user:", error);

      console.error(error.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="p-6">
      {/* -------------------------------- */}
      {/* PAGE HEADER */}
      {/* -------------------------------- */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add User</h1>

        <p className="text-sm text-muted-foreground">
          Create a new user account.
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
                placeholder="******"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
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
          {isSubmitting ? "Creating..." : "Create User"}
        </Button>
      </form>
    </div>
  );
}
