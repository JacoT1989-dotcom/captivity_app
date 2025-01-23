import { create } from "zustand";
import {
  CategoryStore,
  CategoryState,
  FilterState,
  Product,
  DynamicPricing,
} from "./types";
import { getAllCategories } from "../all-collections-actions";

export const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

const getCurrentPricing = (product: Product) => {
  if (!product.dynamicPricing || product.dynamicPricing.length === 0) {
    return null;
  }

  const now = new Date();
  return (
    product.dynamicPricing.find(pricing => {
      const fromDate = new Date(pricing.from);
      const toDate = new Date(pricing.to);
      return now >= fromDate && now <= toDate;
    }) || null
  );
};

const getEffectivePrice = (product: Product) => {
  const currentPricing = getCurrentPricing(product);
  if (!currentPricing) return product.sellingPrice;

  const amount = parseFloat(currentPricing.amount);
  if (currentPricing.type === "percentage") {
    return product.sellingPrice * (1 - amount / 100);
  } else if (currentPricing.type === "fixed") {
    return product.sellingPrice - amount;
  }
  return product.sellingPrice;
};

function applyProductFilters(
  products: Product[],
  filters: FilterState,
  pathname?: string
): Product[] {
  const pathParts = (pathname || "").split("/").filter(Boolean);
  const isCollectionPath = pathParts[1] === "all-collections";
  const specificCollection = pathParts[2];

  // Step 1: Filter by collection first
  let filteredProducts = products.filter(product => {
    if (!product.category || product.category.length === 0) return false;

    if (isCollectionPath) {
      if (
        !specificCollection ||
        specificCollection === "all-collections" ||
        specificCollection === "all-in-collections" ||
        !filters.types.length ||
        filters.types[0] === "all-collections" ||
        filters.types[0] === "all-in-collections"
      ) {
        return true;
      }

      const typeToCheck =
        filters.types.length > 0 ? filters.types[0] : specificCollection;
      if (
        typeToCheck &&
        typeToCheck !== "all-collections" &&
        typeToCheck !== "all-in-collections"
      ) {
        return product.category.some(cat => {
          const normalizedCat = normalizeString(cat);
          const normalizedType = normalizeString(
            typeToCheck.replace("-collection", "")
          );
          return (
            normalizedCat === normalizedType ||
            normalizedCat === normalizedType + "collection" ||
            normalizedCat.includes(normalizedType)
          );
        });
      }
    }
    return true;
  });

  // Step 2: Filter by stock level
  if (filters.stockLevel !== "all") {
    filteredProducts = filteredProducts.filter(product => {
      const hasVariationsInStock = product.variations.some(v => v.quantity > 0);
      const hasVariationsOutOfStock = product.variations.every(
        v => v.quantity <= 0
      );

      if (filters.stockLevel === "in") {
        return hasVariationsInStock;
      } else if (filters.stockLevel === "out") {
        return hasVariationsOutOfStock;
      }
      return true;
    });
  }

  // Step 3: Apply size and color filters
  if (filters.sizes.length > 0 || filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      return product.variations.some(variation => {
        const matchesSize =
          filters.sizes.length === 0 || filters.sizes.includes(variation.size);
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);

        let matchesStock = true;
        if (filters.stockLevel !== "all") {
          const isVariationInStock = variation.quantity > 0;
          matchesStock =
            filters.stockLevel === "in"
              ? isVariationInStock
              : !isVariationInStock;
        }

        return matchesSize && matchesColor && matchesStock;
      });
    });
  }

  return filteredProducts;
}

const initialState: CategoryState = {
  categories: [],
  products: [],
  filteredProducts: [],
  currentPath: "",
  isLoading: false,
  error: null,
  initialized: false,
  sortOrder: "relevance",
  filters: {
    stockLevel: "all",
    sizes: [],
    colors: [],
    types: [],
    pricingType: undefined,
  },
};

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
  ...initialState,

  fetchCategories: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const result = await getAllCategories();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch categories");
      }

      set({
        categories: result.data.categories,
        products: result.data.allProducts,
        isLoading: false,
        error: null,
        initialized: true,
      });

      const { currentPath } = get();
      if (currentPath) {
        get().filterProductsByPath(currentPath);
      }
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        initialized: true,
      });
    }
  },

  updateProductPrice: (
    productId: string,
    newDynamicPricing: DynamicPricing[]
  ) => {
    const { products, currentPath, filters } = get();

    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          dynamicPricing: newDynamicPricing,
        };
      }
      return product;
    });

    set({ products: updatedProducts });

    const filteredProducts = applyProductFilters(
      updatedProducts,
      filters,
      currentPath
    );
    set({ filteredProducts });
  },

  setProducts: products => {
    set({ products });
    const { currentPath } = get();
    if (currentPath) {
      get().filterProductsByPath(currentPath);
    }
  },

  filterProductsByPath: (pathname: string) => {
    const { products, filters } = get();

    const pathParts = pathname.split("/").filter(Boolean);
    const specificCollection = pathParts[2];

    if (specificCollection) {
      let newType = specificCollection;

      if (
        specificCollection === "all-collections" ||
        specificCollection === "all-in-collections"
      ) {
        newType = "all-in-collections";
      }

      const newFilters = {
        ...filters,
        types: [newType],
      };
      set({ filters: newFilters });
    }

    const filteredProducts = applyProductFilters(products, filters, pathname);
    set({
      filteredProducts,
      currentPath: pathname,
    });
  },

  applyFilters: (newFilters: FilterState) => {
    const { products, currentPath } = get();
    set({ filters: newFilters });
    const filteredProducts = applyProductFilters(
      products,
      newFilters,
      currentPath
    );
    set({ filteredProducts });
  },

  sortProducts: (sortOrder: string) => {
    const { filteredProducts } = get();
    let sortedProducts = [...filteredProducts];

    switch (sortOrder) {
      case "price-asc":
        sortedProducts.sort(
          (a, b) => getEffectivePrice(a) - getEffectivePrice(b)
        );
        break;
      case "price-desc":
        sortedProducts.sort(
          (a, b) => getEffectivePrice(b) - getEffectivePrice(a)
        );
        break;
      case "name-asc":
        sortedProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "name-desc":
        sortedProducts.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    set({ filteredProducts: sortedProducts, sortOrder });
  },

  getCurrentPricing,
  getEffectivePrice,

  reset: () => {
    set(initialState);
  },
}));

// Export selectors
export const useCategories = () => useCategoryStore(state => state.categories);
export const useFilteredProducts = () =>
  useCategoryStore(state => state.filteredProducts);
export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);
export const useCategoryError = () => useCategoryStore(state => state.error);
export const useCategoryInitialized = () =>
  useCategoryStore(state => state.initialized);
export const useCurrentPricing = () =>
  useCategoryStore(state => state.getCurrentPricing);
export const useEffectivePrice = () =>
  useCategoryStore(state => state.getEffectivePrice);
export const useUpdateProductPrice = () =>
  useCategoryStore(state => state.updateProductPrice);
