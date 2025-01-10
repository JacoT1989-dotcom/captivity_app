// app/vendor/[vendor_website]/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          An error occurred while loading the store.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="text-white bg-red-600 px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-gray-700 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
