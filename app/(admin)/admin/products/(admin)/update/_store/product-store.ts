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
  updateDynamicPricing,
} from "../actions";
import {
  isApparelProduct,
  isHeadwearProduct,
  matchesCategory,
  matchesCollectionCategory,
  applyProductFilters,
} from "../utils";
import {
  ProductStore,
  ProductStoreState,
  initialStoreState,
} from "./storeTypes";

export const useProductStore = create<ProductStore>()((set, get) => ({
  ...initialStoreState,

  fetchAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const initialResponse = await getProducts(1, 1);
      if (!initialResponse.success || !initialResponse.data) {
        throw new Error(initialResponse.error || "Failed to fetch products");
      }

      const totalItems = initialResponse.data.pagination.total;
      const response = await getProducts(1, totalItems);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch all products");
      }

      const { products } = response.data;

      set({
        products,
        totalItems: products.length,
        currentPage: 1,
        totalPages: Math.ceil(products.length / get().itemsPerPage),
        isLoading: false,
      });

      get().categorizeProducts(products);
      get().fetchProducts(1, get().itemsPerPage);
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  },

  fetchProducts: async (page = 1, limit = 10, search?: string) => {
    const { products, filters } = get();
    const allFilteredResults = applyProductFilters(products, filters);

    const start = (page - 1) * limit;
    const end = start + limit;

    set({
      currentPage: page,
      totalPages: Math.ceil(allFilteredResults.length / limit),
      itemsPerPage: limit,
      totalItems: allFilteredResults.length,
      filteredProducts: allFilteredResults,
      paginatedProducts: allFilteredResults.slice(start, end),
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
      get().fetchProducts(get().currentPage, get().itemsPerPage);

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
      get().fetchProducts(get().currentPage, get().itemsPerPage);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to update stock",
      });
    }
  },

  updateProductDynamicPricing: async (
    productId: string,
    pricing: { id: string; from: string; to: string; amount: number }[]
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateDynamicPricing(productId, pricing);
      if (!response.success) {
        throw new Error(response.error || "Failed to update dynamic pricing");
      }
      await get().fetchProduct(productId);
      get().fetchProducts(get().currentPage, get().itemsPerPage);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update dynamic pricing",
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
    get().fetchProducts(1, get().itemsPerPage);
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

    const collectionProducts = { ...initialStoreState.collectionProducts };

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

    get().fetchProducts(1, get().itemsPerPage);
  },

  applyFilters: (newFilters: FilterState) => {
    const { products, currentCollection, currentCategory } = get();
    set({ filters: newFilters });

    if (currentCollection && currentCategory) {
      get().filterByPathname(`/${currentCollection}/${currentCategory}`);
    } else {
      const filteredProducts = applyProductFilters(products, newFilters);
      set({ filteredProducts });
      get().fetchProducts(1, get().itemsPerPage);
    }
  },

  reset: () => {
    set(initialStoreState);
  },
}));
