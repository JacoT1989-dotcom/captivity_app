import { getOrdersByStatus } from "../_components/actions";
import OrderTable from "../_components/OrderTable";
import { OrderStatus } from "@prisma/client";

export default async function CompletedOrdersPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const searchQuery = searchParams?.search;

  const initialData = await getOrdersByStatus(
    OrderStatus.REFUNDED,
    page,
    10,
    searchQuery
  );

  return (
    <OrderTable
      initialData={initialData}
      status={OrderStatus.REFUNDED}
      title="Refunded Orders"
    />
  );
}
