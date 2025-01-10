import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Vendor Order Not Found
        </h2>
        <p className="text-gray-600 text-center mb-6">
          The vendor order you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <div className="flex justify-center">
          <Link
            href="/vendor/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            View All Vendor Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
