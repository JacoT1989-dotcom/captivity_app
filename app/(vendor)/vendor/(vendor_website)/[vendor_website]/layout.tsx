import { validateRequest } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { unstable_noStore as noStore } from "next/cache";
import Footer from "./_components/Footer";
import SessionProvider from "@/app/(vendor)/SessionProvider";
import Navbar from "@/app/(vendor)/_components/Navbar";

// Only the top-level vendor layout should be dynamic
export const dynamic = "force-dynamic";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  // Get session without validation/redirect
  const session = await validateRequest();

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
