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
    { from: "601", to: "20000" },
  ];

  // Function to find the exact price for a given range
  const getPriceForRange = (from: string, to: string) => {
    if (!dynamicPricing?.length) {
      return sellingPrice;
    }

    // Look for exact range match first
    const exactMatch = dynamicPricing.find(p => p.from === from && p.to === to);

    if (exactMatch) {
      return parseFloat(exactMatch.amount);
    }

    // Sort pricing rules by specificity (smaller ranges first)
    const sortedPricing = [...dynamicPricing].sort((a, b) => {
      const rangeA = parseInt(a.to) - parseInt(a.from);
      const rangeB = parseInt(b.to) - parseInt(b.from);
      return rangeA - rangeB;
    });

    // Find the most specific applicable rule
    const applicableRule = sortedPricing.find(
      p =>
        parseInt(p.from) <= parseInt(from) &&
        parseInt(p.to) >= parseInt(to) &&
        p.type === "fixed_price"
    );

    return applicableRule ? parseFloat(applicableRule.amount) : sellingPrice;
  };

  const formatPrice = (price: number) => {
    return `R ${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Quantity Based Pricing</h3>
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
        <div className="font-medium text-gray-700">Quantity Range</div>
        <div className="font-medium text-gray-700">Price per Item</div>
        {desiredRanges.map(range => (
          <React.Fragment key={`${range.from}-${range.to}`}>
            <div className="text-gray-600">{`${range.from} - ${range.to}`}</div>
            <div className="text-gray-600 font-medium">
              {formatPrice(getPriceForRange(range.from, range.to))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PricingRanges;
