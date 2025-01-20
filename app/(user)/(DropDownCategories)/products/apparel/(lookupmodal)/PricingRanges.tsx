// PricingRanges.tsx
import React from "react";
import type { PricingRangesProps } from "./types";

const PricingRanges: React.FC<PricingRangesProps> = ({
  dynamicPricing,
  sellingPrice,
}) => {
  // Define our desired ranges
  const desiredRanges = [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "2000" },
  ];

  // Function to find the price for a given range
  const getPriceForRange = (from: string, to: string) => {
    if (!dynamicPricing?.length) {
      return sellingPrice;
    }

    const pricing = dynamicPricing.find(
      p => parseInt(p.from) <= parseInt(from) && parseInt(p.to) >= parseInt(to)
    );

    return pricing ? parseFloat(pricing.amount) : sellingPrice;
  };

  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-sm">
      <div className="font-medium text-gray-700">Quantity</div>
      <div className="font-medium text-gray-700">Price</div>
      {desiredRanges.map(range => (
        <React.Fragment key={`${range.from}-${range.to}`}>
          <div className="text-gray-600">{`${range.from} - ${range.to}`}</div>
          <div className="text-gray-600">
            {formatPrice(getPriceForRange(range.from, range.to))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PricingRanges;
