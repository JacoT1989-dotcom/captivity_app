// app/layout.tsx
import PageTitle from "@/components/PageTitle";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { validateRequest } from "@/auth";
import SessionProvider from "@/app/SessionProvider";
import { type ReactNode } from "react";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, session } = await validateRequest();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg">
        <PageTitle />
        <div>
          <SessionProvider value={user && session ? { user, session } : null}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SessionProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
