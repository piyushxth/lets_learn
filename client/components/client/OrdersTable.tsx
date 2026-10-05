"use client";

import { Order, OrderStatus } from "@/app/types/order";

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

import { useAxios } from "@/app/lib/axios";
import { useRouter } from "next/navigation";

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const { axios } = useAxios();
  const router = useRouter();

  // ============================================================
  // DELETE ORDER
  // ============================================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/orders/${id}`);

      console.log("Order deleted successfully");

      router.refresh();
    } catch (error: any) {
      console.error(
        "Failed to delete order:",
        error.response?.data?.message || error,
      );
    }
  };

  // ============================================================
  // STATUS BADGE
  // ============================================================

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";

      case "SHIPPED":
        return "bg-purple-100 text-purple-800";

      case "DELIVERED":
        return "bg-green-100 text-green-800";

      case "CANCELLED":
        return "bg-red-100 text-red-800";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>

            <TableHead>Customer</TableHead>

            <TableHead>Items</TableHead>

            <TableHead>Total</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Created</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                {/* Order ID */}

                <TableCell className="font-medium">#{order.id}</TableCell>

                {/* Customer */}

                <TableCell>
                  <div>
                    <p className="font-medium">
                      {order.user.first_name} {order.user.last_name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {order.user.email}
                    </p>
                  </div>
                </TableCell>

                {/* Items */}

                <TableCell>
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}
                </TableCell>

                {/* Total */}

                <TableCell className="font-medium">
                  Rs. {Number(order.total).toFixed(2)}
                </TableCell>

                {/* Status */}

                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </TableCell>

                {/* Created */}

                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
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
                        render={<Link href={`/admin/orders/${order.id}`} />}
                      >
                        View
                      </DropdownMenuItem>

                      {/* Change Status */}

                      <DropdownMenuItem
                        render={
                          <Link href={`/admin/orders/${order.id}/status`} />
                        }
                      >
                        Change Status
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Delete */}

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(order.id)}
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

export default OrdersTable;
