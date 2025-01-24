// productHooks.ts
import { useProductStore } from "./product-store";

// State Selectors
export const useProducts = () => useProductStore(state => state.products);

export const useFilteredProducts = () =>
  useProductStore(state => state.filteredProducts);

export const usePaginatedProducts = () =>
  useProductStore(state => state.paginatedProducts);

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

// Action Hooks
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

export const useUpdateDynamicPricing = () =>
  useProductStore(state => state.updateProductDynamicPricing);

export const useUpdateVariationImage = () =>
  useProductStore(state => state.updateVariationImage);

export const useSetProducts = () => useProductStore(state => state.setProducts);

export const useFilterByPathname = () =>
  useProductStore(state => state.filterByPathname);

export const useApplyFilters = () =>
  useProductStore(state => state.applyFilters);

export const useResetStore = () => useProductStore(state => state.reset);
