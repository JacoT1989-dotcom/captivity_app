import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { User } from "lucia";
import prisma from "@/lib/prisma";

enum UserRole {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  SUBSCRIBER = "SUBSCRIBER",
  PROMO = "PROMO",
  DISTRIBUTOR = "DISTRIBUTOR",
  SHOPMANAGER = "SHOPMANAGER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
  VENDOR = "VENDOR",
  VENDORCUSTOMER = "VENDORCUSTOMER",
}

type RouteValue = string | ((user: User) => Promise<string> | string);

const roleRoutes: Record<UserRole, RouteValue> = {
  [UserRole.USER]: "/dashboard",
  [UserRole.CUSTOMER]: "/customer",
  [UserRole.SUBSCRIBER]: "/subscriber",
  [UserRole.PROMO]: "/promo",
  [UserRole.DISTRIBUTOR]: "/distributor",
  [UserRole.SHOPMANAGER]: "/shop",
  [UserRole.EDITOR]: "/",
  [UserRole.ADMIN]: "/admin",
  [UserRole.SUPERADMIN]: "/select-panel",
  [UserRole.VENDOR]: async (user: User) => {
    // Fetch the user's store info directly from the user table
    const userWithStore = await prisma.user.findUnique({
      where: { id: user.id },
      select: { storeSlug: true },
    });

    if (!userWithStore?.storeSlug) {
      console.warn("Vendor without storeSlug detected:", user);
      return "/login";
    }
    return `/vendor/${userWithStore.storeSlug}/welcome`;
  },
  [UserRole.VENDORCUSTOMER]: "/vendor_auth",
};

function toUserRole(role: string): UserRole | undefined {
  return Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : undefined;
}

function getSearchParamsFromHeaders(): URLSearchParams {
  const headersList = headers();
  const referer = headersList.get("referer");
  if (!referer) return new URLSearchParams();

  try {
    const url = new URL(referer);
    return url.searchParams;
  } catch {
    return new URLSearchParams();
  }
}

export default async function RoleBasedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  const searchParams = getSearchParamsFromHeaders();
  const selectedRole = searchParams.get("as") || user?.role;

  if (user) {
    const userRole = toUserRole(user.role);

    // If user is SUPERADMIN and has selected a role, go to that panel
    if (userRole === UserRole.SUPERADMIN && selectedRole) {
      const targetRole = toUserRole(selectedRole);
      if (targetRole && targetRole in roleRoutes) {
        const route = roleRoutes[targetRole];
        // Handle both string and function route values
        const targetRoute =
          typeof route === "function" ? await route(user) : route;
        redirect(targetRoute);
      }
      // If no valid target role selected, go to panel selector
      redirect(roleRoutes[UserRole.SUPERADMIN] as string);
    }
    // For all other users, redirect based on their role
    else if (userRole && userRole in roleRoutes) {
      const route = roleRoutes[userRole];
      // Handle both string and function route values
      const targetRoute =
        typeof route === "function" ? await route(user) : route;
      redirect(targetRoute);
    } else {
      console.warn(`Unrecognized user role: ${user.role}`);
      redirect("/");
    }
  }

  return <>{children}</>;
}
