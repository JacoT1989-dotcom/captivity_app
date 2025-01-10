import { FilterState, Product } from "./types";

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

export const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

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
            if (filters.stockLevel === "in" && variation.quantity <= 0)
              return false;
            if (filters.stockLevel === "out" && variation.quantity > 0)
              return false;
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
