// app/error.tsx//
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <Button
        onClick={() => reset()}
        variant="outline"
        className="hover:bg-red-50"
      >
        Try again
      </Button>
    </div>
  );
}
