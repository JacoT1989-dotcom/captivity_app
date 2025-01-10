// app/vendor/[vendor_website]/order-success/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { VendorOrderSuccessView } from "./OrderSuccessView";
import { getVendorOrder } from "../../shop_product/checkout/vendor-orders";

interface VendorOrderSuccessPageProps {
  params: {
    id: string;
  };
}

export default async function VendorOrderSuccessPage({
  params,
}: VendorOrderSuccessPageProps) {
  // Fetch specific order using ID
  const result = await getVendorOrder(params.id);

  // Handle error states
  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-2xl shadow-black rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">
            Unable to Load Vendor Order
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {result.error || "Order not found."}
          </p>
          <div className="flex justify-center">
            <Link
              href="/vendor/shopping/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go to vendor shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Validate order data
  if (!result.data) {
    return notFound();
  }

  // Take the first order if it's an array, otherwise use the single order
  const order = Array.isArray(result.data) ? result.data[0] : result.data;

  return <VendorOrderSuccessView order={[order]} />;
}
