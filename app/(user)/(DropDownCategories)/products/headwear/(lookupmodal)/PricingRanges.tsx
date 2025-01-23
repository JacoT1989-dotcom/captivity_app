import React from "react";
import type { ProductLookup } from "./types";

interface PricingRangesProps {
  dynamicPricing: ProductLookup["dynamicPricing"];
  sellingPrice: number;
}

const PricingRanges: React.FC<PricingRangesProps> = ({
  dynamicPricing,
  sellingPrice,
}) => {
  const desiredRanges = [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "20000" },
  ];

  const getPriceForRange = (from: string, to: string): number => {
    if (!dynamicPricing?.length) {
      return sellingPrice;
    }

    // First, look for exact range match
    const exactMatch = dynamicPricing.find(
      p => p.from === from && p.to === to && p.type === "fixed_price"
    );

    if (exactMatch) {
      return parseFloat(exactMatch.amount);
    }

    // Sort pricing rules by specificity (smaller ranges first)
    const sortedPricing = [...dynamicPricing].sort((a, b) => {
      const rangeA = parseInt(a.to) - parseInt(a.from);
      const rangeB = parseInt(b.to) - parseInt(b.from);
      return rangeA - rangeB;
    });

    // Find the most specific applicable fixed price rule
    const applicableRule = sortedPricing.find(
      p =>
        parseInt(p.from) <= parseInt(from) &&
        parseInt(p.to) >= parseInt(to) &&
        p.type === "fixed_price"
    );

    return applicableRule ? parseFloat(applicableRule.amount) : sellingPrice;
  };

  const formatPrice = (price: number): string => {
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
