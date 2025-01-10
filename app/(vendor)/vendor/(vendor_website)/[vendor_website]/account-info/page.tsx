// app/vendor/[vendor_website]/account-info/page.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { getUserProfile } from "./actions";
import { VendorAccountManager } from "./VendorAccountManager";

interface AuthenticatedUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
  email: string;
}

interface VendorAccountPageProps {
  params: {
    vendor_website: string;
  };
}

export const metadata: Metadata = {
  title: "Account Information | Dashboard",
  description: "Manage your account information and profile settings",
};

export default async function VendorAccountPage({
  params,
}: VendorAccountPageProps) {
  // Add logging to track the flow
  console.log("Starting page load");

  const { user } = (await validateRequest()) as {
    user: AuthenticatedUser | null;
  };

  // Log user details for debugging
  console.log("User details:", {
    role: user?.role,
    storeSlug: user?.storeSlug,
    vendorWebsite: params.vendor_website,
  });

  if (!user) {
    console.log("No user found, redirecting to auth");
    redirect("/vendor_auth");
  }

  const profileData = await getUserProfile();

  // Log profile data result
  console.log("Profile data success:", profileData.success);

  if (!profileData.success) {
    console.log("Profile data fetch failed");
    redirect("/vendor_auth");
  }

  // Render page for both vendors and vendor customers
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <VendorAccountManager
          initialProfile={profileData}
          vendorSlug={params.vendor_website}
        />
      </div>
    </main>
  );
}
