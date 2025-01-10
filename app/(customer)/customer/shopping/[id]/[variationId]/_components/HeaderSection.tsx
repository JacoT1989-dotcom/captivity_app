import Link from "next/link";
import { BaseProps } from "../_types/variations";
import BackToCustomerPage from "@/app/(customer)/customer/_components/BackToCustomerButton";
import { Button } from "react-day-picker";
import { SquareArrowLeft } from "lucide-react";

export const HeaderSection = ({ data }: BaseProps) => {
  const totalStock = data.product.variations.reduce(
    (sum, v) => sum + v.quantity,
    0
  );

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-2xl shadow-black">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-3xl font-bold text-card-foreground">
              {data.product.productName}
            </h1>

            <span className="flex items-center justify-center md:hidden xl:hidden">
              <Link href="/customer/shopping/product_categories/summer">
                <SquareArrowLeft />
              </Link>
            </span>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span>Filtered Stock: {totalStock}</span>
            <span>SKU: {data.sku}</span>
          </div>
        </div>
        <Link
          href={`/customer/shopping/${data.product.id}`}
          className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View product details
        </Link>
      </div>
    </div>
  );
};
