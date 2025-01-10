// app/vendor/[vendor_website]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Store Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, the store you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="text-white bg-red-600 px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}