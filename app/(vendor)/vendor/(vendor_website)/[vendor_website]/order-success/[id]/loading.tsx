import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Loading vendor order details...
        </h2>
      </div>
    </div>
  );
}
