import React, { useMemo } from "react";
import type { ProductLookup } from "./types";

interface PricingRangesProps {
  dynamicPricing: ProductLookup["dynamicPricing"];
  sellingPrice: number;
}

const PricingRanges: React.FC<PricingRangesProps> = ({
  dynamicPricing,
  sellingPrice,
}) => {
  // Get filtered and sorted pricing ranges
  const filteredPricing = useMemo(() => {
    if (!dynamicPricing?.length) return [];

    // Standard ranges to match exactly
    const standardRanges = [
      { from: "1", to: "24" },
      { from: "25", to: "100" },
      { from: "101", to: "600" },
    ];

    // Get standard ranges first (exact matches only)
    const standardPricing = dynamicPricing.filter(pricing =>
      standardRanges.some(
        range =>
          range.from === pricing.from &&
          range.to === pricing.to &&
          pricing.type === "fixed_price"
      )
    );

    // Get the 601+ range
    const bulkRange = dynamicPricing.find(
      pricing => Number(pricing.from) >= 601 && pricing.type === "fixed_price"
    );

    // Combine and sort
    return [...standardPricing, ...(bulkRange ? [bulkRange] : [])].sort(
      (a, b) => Number(a.from) - Number(b.from)
    );
  }, [dynamicPricing]);

  const formatPrice = (price: number): string => {
    return `R${price.toFixed(2)}`;
  };

  // If no dynamic pricing, show default price for all ranges
  if (!filteredPricing.length) {
    return (
      <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-sm">
        <div className="font-medium text-gray-700">Quantity</div>
        <div className="font-medium text-gray-700">Price</div>
        <div className="text-gray-600">1+</div>
        <div className="text-gray-600">{formatPrice(sellingPrice)}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-sm">
      <div className="font-medium text-gray-700">Quantity</div>
      <div className="font-medium text-gray-700">Price</div>
      {filteredPricing.map(pricing => (
        <React.Fragment key={pricing.id}>
          <div className="text-gray-600">{`${pricing.from} - ${pricing.to}`}</div>
          <div className="text-gray-600">
            {/* {formatPrice(parseFloat(pricing.amount))} */} login
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PricingRanges;
