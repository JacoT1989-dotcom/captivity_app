// utils.ts
import { Product, FilterState, CollectionCategory, PriceRangeConfig } from "./types";

// Constants
export const LOW_STOCK_THRESHOLD = 5;

export const categoryMappings: Record<string, string[]> = {
  tshirts: ["shirt", "t-shirt", "tshirt", "tee"],
  hoodies: ["hood", "sweatshirt", "sweater"],
  jackets: ["jacket", "coat", "blazer", "warmer"],
  bottoms: ["pant", "trouser", "short", "jogger", "track"],
  golfers: ["golf", "polo"],
  sweaters: ["sweater", "jumper", "pullover"],
  tops: ["top", "shirt", "blouse", "vest"],
  men: ["mens", "men's", "men"],
  women: ["womens", "women's", "women", "ladies", "lady's", "lady"],
  kids: ["kids", "kid's", "kid", "youth", "junior", "children"],
};

export const apparelTerms = [
  "apparel",
  "clothing",
  "wear",
  "shirt",
  "t-shirt",
  "tshirt",
  "jacket",
  "hoodie",
  "pant",
  "short",
  "vest",
  "golfer",
  "sweater",
  "jumper",
  "coat",
  "jogger",
  "active",
  "top",
];

export const headwearTerms = [
  "cap",
  "hat",
  "beanie",
  "peak",
  "bucket",
  "trucker",
  "headwear",
  "visor",
];

export const collectionTerms: Record<string, string[]> = {
  camo: ["camo", "camouflage", "military"],
  winter: ["winter", "cold", "warm", "thermal"],
  baseball: ["baseball", "sport", "athletic"],
  fashion: ["fashion", "trendy", "style"],
  sport: ["sport", "athletic", "active"],
  industrial: ["industrial", "work", "safety"],
  leisure: ["leisure", "casual", "lifestyle"],
  kids: ["kids", "children", "youth"],
  african: ["african", "ethnic", "traditional"],
};

// Stock Management Functions
export const getStockBadgeColor = (quantity: number): string => {
  const status = getStockStatus(quantity);
  switch (status) {
    case "out-of-stock":
      return "bg-red-100 text-red-800";
    case "low-stock":
      return "bg-yellow-100 text-yellow-800";
    case "in-stock":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStockStatus = (quantity: number): FilterState["stockLevel"] => {
  if (quantity <= 0) return "out-of-stock";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
};

export const calculateTotalStock = (
  variations: Product["variations"]
): number => {
  return variations.reduce((total, variation) => total + variation.quantity, 0);
};

export const calculateStockStatus = (
  variations: Product["variations"]
): FilterState["stockLevel"] => {
  const totalQuantity = calculateTotalStock(variations);
  return getStockStatus(totalQuantity);
};

// String Utilities
export const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

// Category Matching Functions
export const matchesCategory = (
  textToSearch: string,
  categoryType: string
): boolean => {
  const text = textToSearch.toLowerCase();
  const category = categoryType.toLowerCase();
  const searchTerms = categoryMappings[category] || [category];
  return searchTerms.some(term => text.includes(term));
};

export const isApparelProduct = (textToSearch: string): boolean => {
  const text = textToSearch.toLowerCase();
  return apparelTerms.some(term => text.includes(term));
};

export const isHeadwearProduct = (textToSearch: string): boolean => {
  const text = textToSearch.toLowerCase();
  return headwearTerms.some(term => text.includes(term));
};

export const matchesCollectionCategory = (
  product: Product,
  category: CollectionCategory
): boolean => {
  if (category === "all-in-collections") return true;

  const searchText = [...product.category, product.productName]
    .join(" ")
    .toLowerCase();
  const categoryName = category.replace("-collection", "").toLowerCase();

  return (
    collectionTerms[categoryName]?.some(term => searchText.includes(term)) ||
    false
  );
};

// Filter Utilities
export const handleGenderAgeFilter = (
  productText: string,
  filterType: string
): boolean => {
  const text = productText.toLowerCase();

  switch (filterType.toLowerCase()) {
    case "men":
      return (
        text.includes("men") ||
        (!text.includes("women") &&
          !text.includes("ladies") &&
          !text.includes("kids"))
      );
    case "women":
      return text.includes("women") || text.includes("ladies");
    case "kids":
      return (
        text.includes("kid") ||
        text.includes("youth") ||
        text.includes("junior")
      );
    default:
      return false;
  }
};

// Main Filter Function
export const applyProductFilters = (
  products: Product[],
  filters: FilterState
): Product[] => {
  let filteredProducts = [...products];

  if (filters.types.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const productText = [...product.category, product.productName]
        .join(" ")
        .toLowerCase();

      // First check if we're filtering by main category type
      const mainCategoryType = filters.types[0];
      if (mainCategoryType === "headwear") {
        const isHeadwear = isHeadwearProduct(productText);

        // If we have a specific headwear subcategory, check that too
        if (filters.types.length > 1 && isHeadwear) {
          const subcategory = filters.types[1];
          return matchesCategory(productText, subcategory);
        }
        return isHeadwear;
      }

      if (mainCategoryType === "apparel") {
        const isApparel = isApparelProduct(productText);

        // If we have a specific apparel subcategory, check that too
        if (filters.types.length > 1 && isApparel) {
          const subcategory = filters.types[1];
          return matchesCategory(productText, subcategory);
        }
        return isApparel;
      }

      if (mainCategoryType === "collections") {
        // If we have a specific collection, check that
        if (filters.types.length > 1) {
          const collectionType = filters.types[1];
          return matchesCollectionCategory(
            product,
            `${collectionType}-collection` as CollectionCategory
          );
        }
        return true; // Show all collections if no specific collection selected
      }

      return false;
    });
  }

  // Apply stock level filter
  return filteredProducts
    .map(product => ({
      ...product,
      variations: product.variations.filter(variation => {
        if (filters.stockLevel !== "all") {
          const quantity = variation.quantity;
          const currentStatus = getStockStatus(quantity);

          if (filters.stockLevel !== currentStatus) {
            return false;
          }
        }

        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);
        const matchesSize =
          filters.sizes.length === 0 || filters.sizes.includes(variation.size);

        return matchesColor && matchesSize;
      }),
    }))
    .filter(product => product.variations.length > 0);
};

// Product Sort Functions
export const sortProducts = (
  products: Product[],
  sortBy: string,
  direction: "asc" | "desc"
): Product[] => {
  return [...products].sort((a, b) => {
    let compareValue: number;

    switch (sortBy) {
      case "productName":
        compareValue = a.productName.localeCompare(b.productName);
        break;
      case "category":
        compareValue = a.category[0]?.localeCompare(b.category[0] || "") || 0;
        break;
      case "stock":
        compareValue =
          calculateTotalStock(a.variations) - calculateTotalStock(b.variations);
        break;
      default:
        compareValue = 0;
    }

    return direction === "asc" ? compareValue : -compareValue;
  });
};


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