import { create } from "zustand";
import {
  Product,
  VariationStock,
  FilterState,
  CollectionType,
  CollectionCategory,
  ProductStore,
  ProductStoreState,
  initialStoreState,
  UpdateStockResult,
} from "../types";
import {
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
import { addVariationImage } from "../product-actions";

export const useProductStore = create<ProductStore>()((set, get) => ({
  ...initialStoreState,

  fetchAllProducts: async () => {
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
        error: null,
        isLoading: false,
      });

      get().categorizeProducts(products);
      get().fetchProducts(1, get().itemsPerPage);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
        isLoading: false,
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
    try {
      const response = await getProduct(productId);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch product");
      }

      const currentProducts = [...get().products];
      const productIndex = currentProducts.findIndex(p => p.id === productId);

      if (productIndex !== -1) {
        currentProducts[productIndex] = response.data;
        set({ products: currentProducts, error: null });
        get().categorizeProducts(currentProducts);
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      });
    }
  },

  updateProductStock: async (
    productId: string,
    variations: VariationStock[]
  ) => {
    const currentProducts = [...get().products];
    const productIndex = currentProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) return;

    // Optimistic update
    const updatedProduct = { ...currentProducts[productIndex] };
    variations.forEach(variation => {
      const varIndex = updatedProduct.variations.findIndex(
        v => v.id === variation.id
      );
      if (varIndex !== -1) {
        updatedProduct.variations[varIndex].quantity = variation.quantity;
      }
    });

    set({ products: currentProducts });
    get().categorizeProducts(currentProducts);

    try {
      const response = await updateStock(productId, variations);
      if (!response.success) {
        throw new Error(response.error || "Failed to update stock");
      }
    } catch (error) {
      // Revert on failure
      set({
        products: currentProducts,
        error:
          error instanceof Error ? error.message : "Failed to update stock",
      });
      get().categorizeProducts(currentProducts);
    }
  },

  updateProductDynamicPricing: async (
    productId: string,
    pricing: { id: string; from: string; to: string; amount: number }[]
  ) => {
    const currentProducts = [...get().products];
    const productIndex = currentProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) return;

    // Create the updated pricing structure
    const formattedPricing = pricing.map(p => ({
      ...p,
      type: "dynamic",
      productId,
      amount: p.amount.toString(),
    }));

    // Optimistic update
    const updatedProduct = {
      ...currentProducts[productIndex],
      dynamicPricing: formattedPricing,
    };
    currentProducts[productIndex] = updatedProduct;

    set({
      products: currentProducts,
      filteredProducts: get().filteredProducts.map(p =>
        p.id === productId ? updatedProduct : p
      ),
      paginatedProducts: get().paginatedProducts.map(p =>
        p.id === productId ? updatedProduct : p
      ),
    });

    try {
      const response = await updateDynamicPricing(productId, pricing);
      if (!response.success) {
        throw new Error(response.error || "Failed to update pricing");
      }

      // Fetch the latest product data to ensure consistency
      const productResponse = await getProduct(productId);
      if (productResponse.success && productResponse.data) {
        const freshProduct = productResponse.data;
        const updatedProducts = currentProducts.map(p =>
          p.id === productId ? freshProduct : p
        );

        set({
          products: updatedProducts,
          filteredProducts: get().filteredProducts.map(p =>
            p.id === productId ? freshProduct : p
          ),
          paginatedProducts: get().paginatedProducts.map(p =>
            p.id === productId ? freshProduct : p
          ),
        });
      }
    } catch (error) {
      // Revert on failure
      set({
        products: currentProducts,
        error:
          error instanceof Error ? error.message : "Failed to update pricing",
        filteredProducts: get().filteredProducts,
        paginatedProducts: get().paginatedProducts,
      });
    }
  },

  updateVariationImage: async (
    productId: string,
    variationId: string,
    file: File
  ): Promise<UpdateStockResult> => {
    try {
      const base64 = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const response = await addVariationImage(
        productId,
        variationId,
        base64,
        file.type
      );
      if (response.success) {
        await get().fetchProduct(productId);
      }
      return response;
    } catch (error) {
      console.error("Store error:", error);
      return { success: false, error: "Failed to update image" };
    }
  },

  deleteProduct: async (productId: string) => {
    const currentProducts = [...get().products];

    try {
      const response = await deleteProduct(productId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete product");
      }

      const updatedProducts = currentProducts.filter(p => p.id !== productId);
      set({ products: updatedProducts, error: null });
      get().categorizeProducts(updatedProducts);
      get().fetchProducts(get().currentPage, get().itemsPerPage);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete product",
      });
    }
  },

  setProducts: (products: Product[]) => {
    set({ products, error: null });
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
