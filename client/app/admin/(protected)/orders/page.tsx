import { Order } from "@/app/types/order";

import OrdersTable from "@/components/client/OrdersTable";

const OrdersPage = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const orders: Order[] = await response.json();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <p className="text-sm text-muted-foreground">
          Manage customer orders and order status.
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
};

export default OrdersPage;
