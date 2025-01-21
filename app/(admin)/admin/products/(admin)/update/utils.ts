// utils.ts
import { Product, FilterState, CollectionCategory } from "./types";

// Constants
const LOW_STOCK_THRESHOLD = 5;

const categoryMappings: Record<string, string[]> = {
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

const apparelTerms = [
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

const headwearTerms = [
  "cap",
  "hat",
  "beanie",
  "peak",
  "bucket",
  "trucker",
  "headwear",
  "visor",
];

const collectionTerms: Record<string, string[]> = {
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

export const getStockStatus = (quantity: number): FilterState["stockLevel"] => {
  if (quantity <= 0) return "out-of-stock";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
};

// Main Filter Function
export const applyProductFilters = (
  products: Product[],
  filters: FilterState
): Product[] => {
  let filteredProducts = [...products];

  // Apply type filters first
  if (filters.types.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const productText = [...product.category, product.productName].join(" ");

      return filters.types.some(type => {
        if (["men", "women", "kids"].includes(type.toLowerCase())) {
          return handleGenderAgeFilter(productText, type);
        }
        return matchesCategory(productText, type);
      });
    });
  }

  // Filter and map products based on all criteria
  return (
    filteredProducts
      .map(product => ({
        ...product,
        variations: product.variations.filter(variation => {
          // Apply stock level filter to variations
          if (filters.stockLevel !== "all") {
            const quantity = variation.quantity;
            const currentStatus = getStockStatus(quantity);

            if (filters.stockLevel !== currentStatus) {
              return false;
            }
          }

          // Apply color and size filters
          const matchesColor =
            filters.colors.length === 0 ||
            filters.colors.includes(variation.color);
          const matchesSize =
            filters.sizes.length === 0 ||
            filters.sizes.includes(variation.size);

          return matchesColor && matchesSize;
        }),
      }))
      // Remove products with no matching variations after all filters
      .filter(product => product.variations.length > 0)
  );
};

// Stock Calculation Functions
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

// Export constants for use in other files
export const constants = {
  LOW_STOCK_THRESHOLD,
  categoryMappings,
  apparelTerms,
  headwearTerms,
  collectionTerms,
};
