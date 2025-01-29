import React from "react";

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
  const desiredRanges = [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "20000" },
  ];

  const getPriceForRange = (from: string, to: string) => {
    if (!dynamicPricing?.length) return sellingPrice;

    // Find the applicable pricing rule for this range
    const applicablePricing = dynamicPricing.find(pricing => {
      const rangeFrom = parseInt(from);
      const rangeTo = parseInt(to);
      const pricingFrom = parseInt(pricing.from);
      const pricingTo = parseInt(pricing.to);

      return rangeFrom >= pricingFrom && rangeTo <= pricingTo;
    });

    if (!applicablePricing) return sellingPrice;

    // If it's a fixed price, use the amount directly
    if (applicablePricing.type === "fixed_price") {
      return parseFloat(applicablePricing.amount);
    }

    // For other types (percentage or fixed discount)
    if (applicablePricing.type === "percentage") {
      const discountPercentage = parseFloat(applicablePricing.amount);
      return sellingPrice * (1 - discountPercentage / 100);
    } else if (applicablePricing.type === "fixed") {
      const discountAmount = parseFloat(applicablePricing.amount);
      return sellingPrice - discountAmount;
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
      {desiredRanges.map(range => {
        const price = getPriceForRange(range.from, range.to);

        return (
          <React.Fragment key={`${range.from}-${range.to}`}>
            <div className="text-gray-600">{`${range.from} - ${range.to}`}</div>
            <div className="text-gray-600">{formatPrice(price)}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PricingRanges;
