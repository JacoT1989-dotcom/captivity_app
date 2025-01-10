import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  googleId: string | null;
  role:
    | "USER"
    | "CUSTOMER"
    | "SUBSCRIBER"
    | "PROMO"
    | "DISTRIBUTOR"
    | "SHOPMANAGER"
    | "EDITOR"
    | "ADMIN"
    | "SUPERADMIN"
    | "VENDOR"
    | "VENDORCUSTOMER";
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      firstName: databaseUserAttributes.firstName,
      lastName: databaseUserAttributes.lastName,
      email: databaseUserAttributes.email,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
      role: databaseUserAttributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  googleId: string | null;
  role:
    | "USER"
    | "CUSTOMER"
    | "SUBSCRIBER"
    | "PROMO"
    | "DISTRIBUTOR"
    | "SHOPMANAGER"
    | "EDITOR"
    | "ADMIN"
    | "SUPERADMIN"
    | "VENDOR"
    | "VENDORCUSTOMER";
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
);

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    return result;
  }
);

export const hasRole = (
  user: User,
  requiredRole: DatabaseUserAttributes["role"]
) => {
  const roleHierarchy = [
    "USER",
    "CUSTOMER",
    "SUBSCRIBER",
    "PROMO",
    "DISTRIBUTOR",
    "SHOPMANAGER",
    "EDITOR",
    "ADMIN",
    "SUPERADMIN",
    "VENDOR",
    "VENDORCUSTOMER",
  ];
  return (
    roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(requiredRole)
  );
};
