// app/vendor/[vendor_website]/loading.tsx
export default function Loading() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
        <p className="text-gray-500">Loading store...</p>
      </div>
    </div>
  );
}
