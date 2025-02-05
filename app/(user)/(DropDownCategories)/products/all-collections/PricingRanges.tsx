import React, { useMemo } from "react";

interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
}

interface PricingRangesProps {
  dynamicPricing: DynamicPricing[];
  sellingPrice: number;
  productId: string;
}

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
    const standardPricing = dynamicPricing.filter(pricing =>
      standardRanges.some(
        range => range.from === pricing.from && range.to === pricing.to
      )
    );

    // Get the 601+ range
    const bulkRange = dynamicPricing.find(
      pricing => Number(pricing.from) >= 601
    );

    // Combine and sort
    return [...standardPricing, ...(bulkRange ? [bulkRange] : [])].sort(
      (a, b) => Number(a.from) - Number(b.from)
    );
  }, [dynamicPricing]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // If no dynamic pricing is available, show default price
  if (!filteredDynamicPricing.length) {
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
      {filteredDynamicPricing.map(pricing => (
        <React.Fragment key={pricing.id}>
          <div className="text-gray-600">{`${pricing.from}-${pricing.to}`}</div>
          <div className="text-gray-600">
            {/* {formatPrice(parseFloat(pricing.amount))} */} login
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PricingRanges;
