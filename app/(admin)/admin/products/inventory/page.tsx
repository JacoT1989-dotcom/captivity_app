import { getInventoryItems } from "./actions";
import { DataTable } from "./data-table";

interface SearchParams {
  page?: string;
  pageSize?: string;
  search?: string;
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const search = searchParams.search || undefined;

  const { items, totalItems, totalPages } = await getInventoryItems(
    currentPage,
    pageSize,
    search
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
