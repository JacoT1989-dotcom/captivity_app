import { getInventoryItems } from "./actions";
import { DataTable } from "./data-table";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;

  const { items, totalItems, totalPages } = await getInventoryItems(
    currentPage,
    pageSize
  );

  return (
    <div className="container mx-auto py-6">
      <DataTable
        data={items}
        pageCount={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </div>
  );
}
