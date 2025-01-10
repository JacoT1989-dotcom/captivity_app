/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Order Not Found
        </h2>
        <p className="text-gray-600 text-center mb-6">
          The order you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <div className="flex justify-center">
          <Link
            href="/customer/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
