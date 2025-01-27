"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  useApplyFilters,
  useDeleteProduct,
  useFetchProducts,
  useFetchAllProducts,
  usePaginatedProducts,
  useFilters,
  useIsLoading,
  usePagination,
  useSetProducts,
} from "../_store/productHooks";
import { FilterState, Product } from "../types";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import VariationsModal from "./(variations-modal)/VariationsModal";

const ProductsStockLevel = () => {
  const fetchProducts = useFetchProducts();
  const fetchAllProducts = useFetchAllProducts();
  const deleteProduct = useDeleteProduct();
  const paginatedProducts = usePaginatedProducts();
  const isLoading = useIsLoading();
  const applyFilters = useApplyFilters();
  const filters = useFilters();
  const setProducts = useSetProducts();
  const { currentPage, totalPages, itemsPerPage } = usePagination();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHeadwear, setSelectedHeadwear] =
    useState<string>("all-in-headwear");
  const [selectedApparel, setSelectedApparel] =
    useState<string>("all-in-apparel");
  const [selectedCollection, setSelectedCollection] =
    useState<string>("all-in-collections");

  const isUpdatingRef = useRef(false);
  const modalCloseTimeoutRef = useRef<NodeJS.Timeout>();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "productName",
    direction: "asc",
  });

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (modalCloseTimeoutRef.current) {
        clearTimeout(modalCloseTimeoutRef.current);
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      applyFilters({
        ...filters,
        searchTerm: term || "",
      });
    },
    [applyFilters, filters]
  );

  const handleDelete = useCallback(
    async (productId: string) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(productId);
      }
    },
    [deleteProduct]
  );

  const handleFilterChange = useCallback(
    (value: FilterState["stockLevel"]) => {
      applyFilters({
        ...filters,
        stockLevel: value,
      });
    },
    [applyFilters, filters]
  );

  const handleCategoryChange = useCallback(
    (value: string, type: "headwear" | "apparel" | "collections") => {
      if (type === "headwear") {
        setSelectedHeadwear(value);
        setSelectedApparel("all-in-apparel");
        setSelectedCollection("all-in-collections");
      } else if (type === "apparel") {
        setSelectedApparel(value);
        setSelectedHeadwear("all-in-headwear");
        setSelectedCollection("all-in-collections");
      } else if (type === "collections") {
        setSelectedCollection(value);
        setSelectedHeadwear("all-in-headwear");
        setSelectedApparel("all-in-apparel");
      }

      if (value.startsWith("all-in-")) {
        applyFilters({
          ...filters,
          types: [type],
        });
        return;
      }

      let filterValue = value;

      if (type === "headwear") {
        filterValue = value.replace("headwear-", "").replace("-headwear", "");
      }

      if (type === "apparel") {
        filterValue = value
          .replace("apparel-", "")
          .replace("-apparel", "")
          .replace("t-shirts", "tshirts");

        if (value === "new-in-apparel") {
          filterValue = "new";
        }
      }

      if (type === "collections") {
        filterValue = value.replace("-collection", "");
      }

      applyFilters({
        ...filters,
        types: [type, filterValue],
      });
    },
    [applyFilters, filters]
  );

  const clearFilters = useCallback(() => {
    setSelectedHeadwear("all-in-headwear");
    setSelectedApparel("all-in-apparel");
    setSelectedCollection("all-in-collections");
    setSearchTerm("");
    applyFilters({
      stockLevel: "all",
      sizes: [],
      colors: [],
      types: [],
      searchTerm: "",
    });
  }, [applyFilters]);

  const handleViewVariations = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    if (isUpdatingRef.current) {
      return;
    }

    // Clear any existing timeouts
    if (modalCloseTimeoutRef.current) {
      clearTimeout(modalCloseTimeoutRef.current);
    }

    setIsModalOpen(false);

    // Delay clearing selected product to prevent UI flicker
    modalCloseTimeoutRef.current = setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  }, []);

  const handleProductUpdate = useCallback(
    (updatedProduct: Product) => {
      isUpdatingRef.current = true;

      // Clear any existing timeouts
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (modalCloseTimeoutRef.current) {
        clearTimeout(modalCloseTimeoutRef.current);
      }

      // Update both the paginated list and selected product
      const updatedProducts = paginatedProducts.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      );

      setProducts(updatedProducts);
      setSelectedProduct(updatedProduct);

      // Use a timeout to prevent immediate state updates from closing modal
      updateTimeoutRef.current = setTimeout(async () => {
        try {
          await fetchProducts(currentPage, itemsPerPage);
        } finally {
          isUpdatingRef.current = false;
        }
      }, 100);
    },
    [paginatedProducts, setProducts, fetchProducts, currentPage, itemsPerPage]
  );

  const handleItemsPerPageChange = useCallback(
    (value: number) => {
      fetchProducts(1, value);
    },
    [fetchProducts]
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ProductFilters
        searchTerm={searchTerm}
        onSearch={handleSearch}
        selectedHeadwear={selectedHeadwear}
        selectedApparel={selectedApparel}
        selectedCollection={selectedCollection}
        onCategoryChange={handleCategoryChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <ProductTable
        products={paginatedProducts}
        isLoading={isLoading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onDelete={handleDelete}
        onViewVariations={handleViewVariations}
      />

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => fetchProducts(currentPage - 1, itemsPerPage)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2 rounded-md bg-muted text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => fetchProducts(currentPage + 1, itemsPerPage)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>

      <VariationsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onProductUpdate={handleProductUpdate}
      />
    </div>
  );
};

export default ProductsStockLevel;
