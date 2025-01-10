import React from "react";
import CheckoutForm from "./CheckoutForm";
import BackToCustomerPage from "../../_components/BackToCustomerButton";
import Link from "next/link";
import { SquareArrowLeft } from "lucide-react";

async function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between m-6">
        <h1 className="text-3xl font-extrabold text-center">CHECKOUT PAGE</h1>
        <span>
          <Link href="/customer/shopping/cart">
            <SquareArrowLeft />
          </Link>
        </span>
      </div>
      <CheckoutForm />
    </div>
  );
}

export default CheckoutPage;
