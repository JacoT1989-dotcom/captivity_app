import { Metadata } from "next";
import signupImage from "@/app/(admin)/assets/login-image.jpg";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        {/* Left side: Sign up form */}
        <div className="flex w-full md:w-1/2 flex-col space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to Captivity</h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        {/* Right side: Image (hidden on mobile, shown on md and up) */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <Image
            src={signupImage}
            alt="Signup Image"
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </main>
  );
}
