import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegistrationPendingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">Registration Pending</h1>
        <p className="text-muted-foreground">
          Your registration is pending approval. You will be notified via email
          once your account has been approved.
        </p>
        <Button asChild className="w-full">
          <Link href="/vendor_auth">Return to Login</Link>
        </Button>
      </div>
    </div>
  );
}
