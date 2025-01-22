import { create } from "zustand";
import {
  Product,
  VariationStock,
  FilterState,
  CollectionType,
  CollectionCategory,
} from "../types";
import {
  addVariationImage,
  getProduct,
  getProducts,
  updateStock,
  deleteProduct,
} from "../actions";
import {
  isApparelProduct,
  isHeadwearProduct,
  matchesCategory,
  matchesCollectionCategory,
  applyProductFilters,
} from "../utils";
import { ProductStore, ProductStoreState } from "./storeTypes";

const initialState: ProductStoreState = {
  // Collection States
  products: [],
  filteredProducts: [],
  apparelProducts: [],
  headwearProducts: [],
  collectionProducts: {
    "all-in-collections": [],
    "camo-collection": [],
    "winter-collection": [],
    "baseball-collection": [],
    "fashion-collection": [],
    "sport-collection": [],
    "industrial-collection": [],
    "leisure-collection": [],
    "kids-collection": [],
    "african-collection": [],
  },
  currentCollection: null,
  currentCategory: null,

  // Pagination State
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,

  // UI States
  isLoading: false,
  error: null,
  filters: {
    stockLevel: "all",
    sizes: [],
    colors: [],
    types: [],
  },
};

export const useProductStore = create<ProductStore>()((set, get) => ({
  ...initialState,

  // CRUD Operations
  fetchAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // First, get the total count
      const initialResponse = await getProducts(1, 1);
      if (!initialResponse.success || !initialResponse.data) {
        throw new Error(initialResponse.error || "Failed to fetch products");
      }

      const totalItems = initialResponse.data.pagination.total;
      console.log("Total products to fetch:", totalItems);

      // Now fetch all products
      const response = await getProducts(1, totalItems);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch all products");
      }

      const { products } = response.data;

      console.log("All Products Loaded:", {
        totalCount: products.length,
        breakdown: {
          headwear: products.filter(p =>
            p.category.some(c => c.includes("headwear"))
          ).length,
          apparel: products.filter(p =>
            p.category.some(c => c.includes("apparel"))
          ).length,
          collections: products.filter(p =>
            p.category.some(c => c.includes("collection"))
          ).length,
        },
        categoryBreakdown: products.reduce(
          (acc, p) => {
            p.category.forEach(c => {
              acc[c] = (acc[c] || 0) + 1;
            });
            return acc;
          },
          {} as Record<string, number>
        ),
      });

      set({
        products,
        totalItems: products.length,
        currentPage: 1,
        totalPages: Math.ceil(products.length / get().itemsPerPage),
        isLoading: false,
      });

      // Categorize all products
      get().categorizeProducts(products);
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  },

  // Original fetchProducts kept for pagination display
  fetchProducts: async (page = 1, limit = 10, search?: string) => {
    const { products } = get();
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = products.slice(start, end);

    set({
      currentPage: page,
      totalPages: Math.ceil(products.length / limit),
      filteredProducts: paginatedProducts,
    });
  },

  fetchProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getProduct(productId);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch product");
      }

      const currentProducts = [...get().products];
      const productIndex = currentProducts.findIndex(p => p.id === productId);

      if (productIndex !== -1) {
        currentProducts[productIndex] = response.data;
        set({ products: currentProducts });
        get().categorizeProducts(currentProducts);
      }

      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      });
    }
  },

  deleteProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deleteProduct(productId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete product");
      }

      const currentProducts = get().products.filter(p => p.id !== productId);
      set({ products: currentProducts });
      get().categorizeProducts(currentProducts);

      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to delete product",
      });
    }
  },

  updateProductStock: async (
    productId: string,
    variations: VariationStock[]
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateStock(productId, variations);
      if (!response.success) {
        throw new Error(response.error || "Failed to update stock");
      }
      await get().fetchProduct(productId);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to update stock",
      });
    }
  },

  updateVariationImage: async (
    productId: string,
    variationId: string,
    image: File
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await addVariationImage(productId, variationId, image);
      if (!response.success) {
        throw new Error(response.error || "Failed to update variation image");
      }
      await get().fetchProduct(productId);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update variation image",
      });
    }
  },

  setProducts: (products: Product[]) => {
    set({ products });
    get().categorizeProducts(products);
  },

  categorizeProducts: (products: Product[]) => {
    console.log("Starting Product Categorization:", {
      totalProducts: products.length,
    });

    const apparelProducts = products.filter(product => {
      const searchText = [...product.category, product.productName].join(" ");
      return isApparelProduct(searchText);
    });

    const headwearProducts = products.filter(product => {
      const searchText = [...product.category, product.productName].join(" ");
      return isHeadwearProduct(searchText);
    });

    const collectionProducts = { ...initialState.collectionProducts };

    Object.keys(collectionProducts).forEach(category => {
      const typedCategory = category as CollectionCategory;
      if (category === "all-in-collections") {
        collectionProducts[typedCategory] = products;
      } else {
        collectionProducts[typedCategory] = products.filter(product =>
          matchesCollectionCategory(product, typedCategory)
        );
      }
    });

    console.log("Categorization Results:", {
      total: products.length,
      apparel: apparelProducts.length,
      headwear: headwearProducts.length,
      collections: Object.fromEntries(
        Object.entries(collectionProducts).map(([key, value]) => [
          key,
          value.length,
        ])
      ),
    });

    set({
      apparelProducts,
      headwearProducts,
      collectionProducts,
      filteredProducts: products,
    });
  },

  filterByPathname: (pathname: string) => {
    const { products, filters } = get();
    const pathParts = pathname.split("/").filter(Boolean);
    const collectionType = pathParts[1] as CollectionType;
    const category = pathParts[2] || null;

    console.log("Filtering by pathname:", {
      pathname,
      collectionType,
      category,
    });

    let filteredProducts = [...products];

    if (collectionType && category) {
      switch (collectionType) {
        case "apparel":
          filteredProducts = get().apparelProducts;
          if (category !== "all-in-apparel") {
            filteredProducts = filteredProducts.filter(product => {
              const searchText = [
                ...product.category,
                product.productName,
              ].join(" ");
              return matchesCategory(searchText, category);
            });
          }
          break;

        case "headwear":
          filteredProducts = get().headwearProducts;
          if (category !== "all-in-headwear") {
            filteredProducts = filteredProducts.filter(product => {
              const searchText = [
                ...product.category,
                product.productName,
              ].join(" ");
              return matchesCategory(searchText, category);
            });
          }
          break;

        case "collections":
          if (category in get().collectionProducts) {
            filteredProducts =
              get().collectionProducts[category as CollectionCategory];
          }
          break;
      }
    }

    const finalFilteredProducts = applyProductFilters(
      filteredProducts,
      filters
    );

    console.log("Filter Results:", {
      type: collectionType,
      category,
      initialCount: filteredProducts.length,
      finalCount: finalFilteredProducts.length,
      appliedFilters: filters,
    });

    set({
      currentCollection: collectionType,
      currentCategory: category,
      filteredProducts: finalFilteredProducts,
    });
  },

  applyFilters: (newFilters: FilterState) => {
    console.log("Applying filters:", newFilters);

    const { products, currentCollection, currentCategory } = get();
    set({ filters: newFilters });

    if (currentCollection && currentCategory) {
      get().filterByPathname(`/${currentCollection}/${currentCategory}`);
    } else {
      const filteredProducts = applyProductFilters(products, newFilters);
      console.log("Filter application results:", {
        totalProducts: products.length,
        filteredCount: filteredProducts.length,
        filters: newFilters,
      });

      set({ filteredProducts });
    }
  },

  reset: () => {
    console.log("Resetting store to initial state");
    set(initialState);
  },
}));

// Selector hooks
export const useProducts = () => useProductStore(state => state.products);
export const useFilteredProducts = () =>
  useProductStore(state => state.filteredProducts);
export const useCurrentCollection = () =>
  useProductStore(state => state.currentCollection);
export const useCurrentCategory = () =>
  useProductStore(state => state.currentCategory);
export const useFilters = () => useProductStore(state => state.filters);
export const useIsLoading = () => useProductStore(state => state.isLoading);
export const useError = () => useProductStore(state => state.error);
export const usePagination = () => {
  const store = useProductStore();
  return {
    currentPage: store.currentPage,
    totalPages: store.totalPages,
    totalItems: store.totalItems,
    itemsPerPage: store.itemsPerPage,
  };
};

// Action hooks
export const useFetchAllProducts = () =>
  useProductStore(state => state.fetchAllProducts);
export const useFetchProducts = () =>
  useProductStore(state => state.fetchProducts);
export const useFetchProduct = () =>
  useProductStore(state => state.fetchProduct);
export const useDeleteProduct = () =>
  useProductStore(state => state.deleteProduct);
export const useUpdateStock = () =>
  useProductStore(state => state.updateProductStock);
export const useUpdateVariationImage = () =>
  useProductStore(state => state.updateVariationImage);
export const useSetProducts = () => useProductStore(state => state.setProducts);
export const useFilterByPathname = () =>
  useProductStore(state => state.filterByPathname);
export const useApplyFilters = () =>
  useProductStore(state => state.applyFilters);
export const useResetStore = () => useProductStore(state => state.reset);
