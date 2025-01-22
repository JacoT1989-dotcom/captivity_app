import { PriceRangeConfig } from "./types";

export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const priceRangeConfigs: PriceRangeConfig[] = [
  { from: "1", to: "24", label: "1-24 items" },
  { from: "25", to: "100", label: "25-100 items" },
  { from: "101", to: "600", label: "101-600 items" },
  { from: "601", to: "20000", label: "601-20000 items" },
];
