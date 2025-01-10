import { BaseProps } from "../_types/variations";

export const PricingSection = ({ data }: BaseProps) => {
  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-2xl shadow-black">
      <h2 className="text-lg md:text-xl font-semibold text-card-foreground mb-4">
        Pricing Information
      </h2>
      <div className="space-y-2 text-card-foreground text-sm md:text-base">
        <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <span>Base Price</span>
          <span className="font-semibold">
            R{data.product.sellingPrice.toFixed(2)}
          </span>
        </p>
        {data.product.dynamicPricing.map(pricing => (
          <p
            key={pricing.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-muted-foreground"
          >
            <span>{pricing.type}</span>
            <span>
              R{pricing.amount} ({pricing.from} - {pricing.to})
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};
