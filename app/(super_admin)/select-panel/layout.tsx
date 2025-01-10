// app/select-panel/layout.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../SessionProvider";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");
  if (session.user.role !== "SUPERADMIN") {
    redirect("/unauthorized");
  }

  return <SessionProvider value={session}>{children}</SessionProvider>;
}
