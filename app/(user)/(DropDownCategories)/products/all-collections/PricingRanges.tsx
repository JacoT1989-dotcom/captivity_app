import React from "react";

interface DynamicPricing {
  from: string;
  to: string;
  amount: string;
  type: string;
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
  const desiredRanges = [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "20000" },
  ];

  const getPriceForRange = (from: string, to: string) => {
    if (!dynamicPricing?.length) return sellingPrice;

    const applicablePricing = dynamicPricing.filter(pricing => {
      const pricingStart = parseInt(pricing.from);
      const pricingEnd = parseInt(pricing.to);
      const rangeStart = parseInt(from);
      const rangeEnd = parseInt(to);
      return pricingStart <= rangeEnd && pricingEnd >= rangeStart;
    });

    if (!applicablePricing.length) return sellingPrice;

    const bestPricing = applicablePricing.reduce((best, current) => {
      const currentRange = parseInt(current.to) - parseInt(current.from);
      const bestRange = parseInt(best.to) - parseInt(best.from);
      return currentRange < bestRange ? current : best;
    });

    if (bestPricing.type === "percentage") {
      return sellingPrice * (1 - parseFloat(bestPricing.amount) / 100);
    } else if (bestPricing.type === "fixed") {
      return sellingPrice - parseFloat(bestPricing.amount);
    }

    return sellingPrice;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
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
