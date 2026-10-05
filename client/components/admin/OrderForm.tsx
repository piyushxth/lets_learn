"use client";

import { useEffect, useState } from "react";

import { useAxios } from "@/app/lib/axios";

import { createOrderData, createOrderSchema } from "@/schemas/order.schema";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm, Controller } from "react-hook-form";

import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Input } from "../ui/input";

import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Trash2, Plus } from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface ProductVariant {
  id: number;
  sku: string;
  price: string;
  stock: number;

  product: {
    id: number;
    name: string;
  };

  color: {
    id: number;
    name: string;
  } | null;

  size: {
    id: number;
    name: string;
  } | null;
}

interface OrderFormProps {
  mode: "create" | "edit";
  initialData?: any;
}

const OrderForm = ({ mode, initialData }: OrderFormProps) => {
  const { axios } = useAxios();

  const [users, setUsers] = useState<User[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingVariants, setLoadingVariants] = useState(true);

  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  const form = useForm<createOrderData>({
    resolver: zodResolver(createOrderSchema),

    defaultValues: {
      user_id: 0,

      items: [
        {
          variant_id: 0,
          quantity: 1,
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // --------------------------------------------------
  // Load users
  // --------------------------------------------------

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");

        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);

        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [axios]);

  // --------------------------------------------------
  // Load variants
  // --------------------------------------------------

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await axios.get("/product/variants");

        setVariants(response.data);
      } catch (error) {
        console.error("Failed to fetch variants:", error);

        toast.error("Failed to load product variants");
      } finally {
        setLoadingVariants(false);
      }
    };

    fetchVariants();
  }, [axios]);

  // --------------------------------------------------
  // Load existing order when editing
  // --------------------------------------------------

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        user_id: initialData.user_id,

        items: initialData.items.map((item: any) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      });
    }
  }, [mode, initialData, reset]);

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const onSubmit = async (data: createOrderData) => {
    try {
      // ---------------------------------------------
      // CREATE
      // ---------------------------------------------

      if (mode === "create") {
        const response = await axios.post("/order", data);

        console.log("Order created:", response.data);

        reset({
          user_id: 0,

          items: [
            {
              variant_id: 0,
              quantity: 1,
            },
          ],
        });

        toast.success("Order created successfully");

        return;
      }

      // ---------------------------------------------
      // UPDATE
      // ---------------------------------------------

      if (!initialData) {
        toast.error("Order data is missing.");

        return;
      }

      /*
       * Your current backend only has:
       *
       * PATCH /order/:id/status
       *
       * So the edit form should not attempt to
       * update the order items here.
       *
       * Order status should be changed separately.
       */

      toast.info("Order editing is currently limited to status changes.");
    } catch (error: any) {
      console.error(
        mode === "create"
          ? "Failed to create order:"
          : "Failed to update order:",
        error,
      );

      const message =
        error.response?.data?.message ||
        (mode === "create"
          ? "Failed to create order."
          : "Failed to update order.");

      toast.error("Something went wrong", {
        description: message,
      });
    }
  };

  // --------------------------------------------------
  // Calculate preview total
  // --------------------------------------------------

  const watchedItems = watch("items");

  const total = watchedItems.reduce((sum, item) => {
    const variant = variants.find(
      (variant) => variant.id === Number(item.variant_id),
    );

    if (!variant) {
      return sum;
    }

    return sum + Number(variant.price) * Number(item.quantity || 0);
  }, 0);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {mode === "edit" ? "Edit Order" : "Create Order"}
        </h1>

        <p className="text-sm text-muted-foreground">
          {mode === "edit"
            ? "Update the order."
            : "Create a new customer order."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ================================================= */}
        {/* CUSTOMER */}
        {/* ================================================= */}

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div>
              <label className="text-sm font-medium">Customer</label>

              <Controller
                control={control}
                name="user_id"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue
                        placeholder={
                          loadingUsers
                            ? "Loading customers..."
                            : "Select customer"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.first_name} {user.last_name} — {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.user_id && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.user_id.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* ORDER ITEMS */}
        {/* ================================================= */}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Items</CardTitle>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    variant_id: 0,
                    quantity: 1,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {fields.map((field, index) => {
              const selectedVariant = variants.find(
                (variant) =>
                  variant.id === Number(watchedItems[index]?.variant_id),
              );

              const quantity = Number(watchedItems[index]?.quantity) || 0;

              const subtotal = selectedVariant
                ? Number(selectedVariant.price) * quantity
                : 0;

              return (
                <div key={field.id} className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-[1fr_150px_auto]">
                    {/* VARIANT */}

                    <div>
                      <label className="text-sm font-medium">
                        Product Variant
                      </label>

                      <Controller
                        control={control}
                        name={`items.${index}.variant_id`}
                        render={({ field }) => (
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue
                                placeholder={
                                  loadingVariants
                                    ? "Loading variants..."
                                    : "Select variant"
                                }
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {variants.map((variant) => (
                                <SelectItem
                                  key={variant.id}
                                  value={String(variant.id)}
                                  disabled={variant.stock <= 0}
                                >
                                  {variant.product.name}

                                  {" — "}

                                  {variant.color?.name &&
                                    `${variant.color.name} `}

                                  {variant.size?.name &&
                                    `/ ${variant.size.name}`}

                                  {" — Rs. "}
                                  {Number(variant.price).toFixed(2)}

                                  {" — Stock: "}
                                  {variant.stock}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.items?.[index]?.variant_id && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.items[index]?.variant_id?.message}
                        </p>
                      )}
                    </div>

                    {/* QUANTITY */}

                    <div>
                      <label className="text-sm font-medium">Quantity</label>

                      <Controller
                        control={control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <Input
                            className="mt-2"
                            type="number"
                            min={1}
                            max={selectedVariant?.stock || undefined}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />

                      {errors.items?.[index]?.quantity && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.items[index]?.quantity?.message}
                        </p>
                      )}
                    </div>

                    {/* REMOVE */}

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* ITEM SUMMARY */}

                  {selectedVariant && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU</span>

                        <span>{selectedVariant.sku}</span>
                      </div>

                      <div className="mt-1 flex justify-between">
                        <span className="text-muted-foreground">
                          Unit Price
                        </span>

                        <span>
                          Rs. {Number(selectedVariant.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-1 flex justify-between font-medium">
                        <span>Subtotal</span>

                        <span>Rs. {subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* ORDER TOTAL */}
        {/* ================================================= */}

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>

              <span>Rs. {total.toFixed(2)}</span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              The final total is calculated by the server using the current
              variant prices.
            </p>
          </CardContent>
        </Card>

        {/* ================================================= */}
        {/* SUBMIT */}
        {/* ================================================= */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Order"
              : "Create Order"}
        </Button>
      </form>
    </div>
  );
};

export default OrderForm;
