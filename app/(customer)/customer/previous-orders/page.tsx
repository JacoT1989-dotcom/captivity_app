import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "./actions";

import { Button } from "@/components/ui/button";
import { SquareArrowLeft } from "lucide-react";
import Link from "next/link";
import BackToCustomerPage from "../_components/BackToCustomerButton";
import Header from "../_components/Header";
import OrderHistory from "./OrderList";

export const dynamic = "force-dynamic";

export default async function PreviousOrdersPage() {
  const session = await validateRequest();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const { data: initialOrdersData } = await getUserOrders(session.user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <Header />
      <div className="flex items-center justify-between mb-7">
        <span>
          <h1 className="text-2xl text-red-500 font-semibold">
            Previous Orders
          </h1>
        </span>

        <span className="p-2 hover:bg-neutral-100">
          <BackToCustomerPage />
        </span>
      </div>
      <OrderHistory
        userId={session.user.id}
        initialOrders={initialOrdersData}
      />
    </div>
  );
}
