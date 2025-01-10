// app/(vendor)/customers/page.tsx
import VendorCustomersContainer from "./_components";
import { fetchVendorCustomers } from "./actions";

export default async function VendorCustomersPage() {
  const initialData = await fetchVendorCustomers();

  return (
    <div className="h-full">
      <div className="flex flex-col h-full">
        <div className="px-4 pt-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Vendor Customers
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your store customer accounts
          </p>
        </div>
        <div className="flex-1 px-4 py-4">
          <VendorCustomersContainer initialData={initialData} />
        </div>
      </div>
    </div>
  );
}
