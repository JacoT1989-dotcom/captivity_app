/* eslint-disable react/no-unescaped-entities */
import { Card } from "@/components/ui/card";
import { ArrowLeftSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <Card className="max-w-md w-full p-6 shadow-lg bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Pending
          </h1>
          <Link href="/">
            <ArrowLeftSquare />
          </Link>{" "}
        </div>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for registering! Your account is currently under review.
        </p>
        <p className="text-md text-gray-500">
          Please wait for the admin to confirm and approve your registration.
          You'll receive an email notification once your account is activated.
        </p>
      </Card>
    </div>
  );
};

export default Page;
