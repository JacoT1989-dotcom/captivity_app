import React, { useMemo } from "react";
import type { PricingRangesProps } from "./types";

const PricingRanges: React.FC<PricingRangesProps> = ({
  dynamicPricing,
  sellingPrice,
}) => {
  const filteredDynamicPricing = useMemo(() => {
    // Define standard ranges
    const standardRanges = [
      { from: "1", to: "24" },
      { from: "25", to: "100" },
      { from: "101", to: "600" },
    ];

    // Get standard ranges first
    const standardPricing =
      dynamicPricing?.filter(pricing =>
        standardRanges.some(
          range => range.from === pricing.from && range.to === pricing.to
        )
      ) || [];

    // Get the 601+ range
    const bulkRange = dynamicPricing?.find(
      pricing => Number(pricing.from) >= 601
    );

    // Combine and sort
    return [...standardPricing, ...(bulkRange ? [bulkRange] : [])].sort(
      (a, b) => Number(a.from) - Number(b.from)
    );
  }, [dynamicPricing]);

  const formatPrice = (price: number) => {
    return `R ${price.toFixed(2)}`;
  };

  // If no dynamic pricing is available, show default price
  if (!filteredDynamicPricing.length) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Quantity Based Pricing</h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
          <div className="font-medium text-gray-700">Quantity Range</div>
          <div className="font-medium text-gray-700">Price per Item</div>
          <div className="text-gray-600">1+</div>
          <div className="text-gray-600 font-medium">
            {formatPrice(sellingPrice)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Quantity Based Pricing</h3>
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
        <div className="font-medium text-gray-700">Quantity Range</div>
        <div className="font-medium text-gray-700">Price per Item</div>
        {filteredDynamicPricing.map(pricing => (
          <React.Fragment key={pricing.id}>
            <div className="text-gray-600">
              {`${pricing.from}-${pricing.to}`}
            </div>
            <div className="text-gray-600 font-medium">
              {/* {formatPrice(parseFloat(pricing.amount))} */}login
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PricingRanges;
