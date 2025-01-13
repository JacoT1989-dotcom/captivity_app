import { getOrdersByStatus } from "../_components/actions";
import OrderTable from "../_components/OrderTable";

export default async function AllOrdersPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const searchQuery = searchParams?.search;

  const initialData = await getOrdersByStatus(undefined, page, 10, searchQuery);

  return <OrderTable initialData={initialData} title="All Orders" />;
}
