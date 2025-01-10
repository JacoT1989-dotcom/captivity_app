// vendor_auth/actions.ts
"use server";

import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(vendorWebsite: string) {
  try {
    const { session } = await validateRequest();

    if (session) {
      // Invalidate the session
      await lucia.invalidateSession(session.id);

      // Clear the session cookie
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    // Redirect to the vendor welcome page
    redirect(`/vendor/${vendorWebsite}/welcome`);
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, try to redirect
    redirect(`/vendor/${vendorWebsite}/welcome`);
  }
}