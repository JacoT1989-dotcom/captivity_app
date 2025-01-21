// productStore.ts
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
  fetchProducts: async (page = 1, limit = 10, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getProducts(page, limit, search);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch products");
      }

      const { products, pagination } = response.data;

      set({
        products,
        currentPage: pagination.currentPage,
        totalPages: pagination.pages,
        totalItems: pagination.total,
        itemsPerPage: pagination.perPage,
        isLoading: false,
      });

      // Categorize the fetched products
      get().categorizeProducts(products);
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  },

  fetchProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getProduct(productId);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch product");
      }

      // Update the product in the current list
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

      // Remove product from state and update categories
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

      // Refresh the product data
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

      // Refresh the product data
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

  // Collection Operations
  setProducts: (products: Product[]) => {
    set({ products });
    get().categorizeProducts(products);
  },

  categorizeProducts: (products: Product[]) => {
    const apparelProducts = products.filter(product => {
      const searchText = [...product.category, product.productName].join(" ");
      return isApparelProduct(searchText);
    });

    const headwearProducts = products.filter(product => {
      const searchText = [...product.category, product.productName].join(" ");
      return isHeadwearProduct(searchText);
    });

    const collectionProducts = { ...initialState.collectionProducts };

    // Categorize products into collections
    Object.keys(collectionProducts).forEach(category => {
      if (category === "all-in-collections") {
        collectionProducts[category as CollectionCategory] = products;
        return;
      }
      collectionProducts[category as CollectionCategory] = products.filter(
        product =>
          matchesCollectionCategory(product, category as CollectionCategory)
      );
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

    set({
      currentCollection: collectionType,
      currentCategory: category,
      filteredProducts: finalFilteredProducts,
    });
  },

  applyFilters: (newFilters: FilterState) => {
    const { products, currentCollection, currentCategory } = get();
    set({ filters: newFilters });

    if (currentCollection && currentCategory) {
      get().filterByPathname(`/${currentCollection}/${currentCategory}`);
    } else {
      const filteredProducts = applyProductFilters(products, newFilters);
      set({ filteredProducts });
    }
  },

  reset: () => {
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
