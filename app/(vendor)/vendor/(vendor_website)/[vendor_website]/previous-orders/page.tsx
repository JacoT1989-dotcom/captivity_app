import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getVendorOrders } from "./actions";
import { canAccessVendorFeatures } from "./types";

import Header from "../_components/Header";
import VendorOrderList from "./_components/OrderList";

export const dynamic = "force-dynamic";

export default async function VendorOrdersPage() {
  const session = await validateRequest();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  // Verify vendor access
  if (!canAccessVendorFeatures(session.user.role)) {
    redirect("/dashboard");
  }

  // Fetch initial vendor orders
  const { data: initialOrdersData } = await getVendorOrders(session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <Header />
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Vendor Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all your vendor orders
          </p>
        </div>
      </div>

      <VendorOrderList
        userId={session.user.id}
        initialOrders={initialOrdersData}
      />
    </div>
  );
}
