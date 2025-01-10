// app/(vendor)/layout.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/app/(vendor)/SessionProvider";
import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/header";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user || session.user.role !== "VENDOR") {
    redirect("/vendor/vendor_auth");
  }

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="min-h-screen flex bg-background">
        {/* Sidebar - Fixed width */}
        <Sidebar />

        {/* Main Content Area - Flexible width */}
        <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-[calc(100vh-5rem)] bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
