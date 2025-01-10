import { redirect } from "next/navigation";
import UpdateUserForm from "./_components/UpdateUserForm";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { UserData } from "./types";
import Header from "../_components/Header";
import BackToCustomerPage from "../_components/BackToCustomerButton";

async function getCurrentUser(): Promise<UserData> {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true, // Add this
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
      phoneNumber: true,
      website: true,
      bio: true,
      streetAddress: true,
      addressLine2: true,
      suburb: true,
      townCity: true,
      postcode: true,
      country: true,
      companyName: true,
      vatNumber: true,
      ckNumber: true,
      position: true,
      natureOfBusiness: true,
      currentSupplier: true,
      otherSupplier: true,
      resellingTo: true,
      salesRep: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return dbUser as UserData;
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <Header />
      <div className="flex items-center justify-between mb-7">
        <span>
          <h1 className="text-2xl text-red-500 font-semibold">Account Info</h1>
        </span>

        <span className="p-2 hover:bg-neutral-100">
          <BackToCustomerPage />
        </span>
      </div>

      <UpdateUserForm user={user} />
    </div>
  );
}
