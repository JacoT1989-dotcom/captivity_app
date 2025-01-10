// app/(vendor)/orders/_components/OrdersUtils.ts
import { OrderStatus } from "@prisma/client";

export const PAGE_SIZES = [10, 20, 50, 100] as const;

export const getStatusColor = (status: string): string => {
  const colors = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    SHIPPED:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    DELIVERED: "bg-green-200 text-green-800 dark:bg-green-700 dark:text-white",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  };
  return (
    colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"
  );
};

export const getOrderTypeColor = (isCustomer: boolean): string => {
  return isCustomer
    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
};
