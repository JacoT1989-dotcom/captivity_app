import { Metadata } from "next";
import loginImage from "@/app/(admin)/assets/new-image.jpg";
import Link from "next/link";
import LoginForm from "./LoginForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        {/* Left side: Login form */}
        <div className="flex w-full md:w-1/2 flex-col space-y-10 overflow-y-auto p-10 ">
          <span className="flex w-full text-center text-3xl font-bold p-5 bg-black rounded-md items-center justify-center">
            {" "}
            <Image
              src="/captivity-logo-white.png"
              alt="CAPTIVITY"
              width={150}
              height={50}
              className="h-auto w-auto"
              priority
            />
          </span>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        {/* Right side: Image (hidden on mobile, shown on md and up) */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <Image
            src={loginImage}
            alt="Login Image"
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </main>
  );
}
