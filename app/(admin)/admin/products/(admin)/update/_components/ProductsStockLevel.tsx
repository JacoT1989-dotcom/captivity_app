"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useApplyFilters,
  useDeleteProduct,
  useFetchProducts,
  useFetchAllProducts,
  useFilteredProducts,
  useFilters,
  useIsLoading,
  usePagination,
} from "../_store/product-store";
import { FilterState, Product } from "../types";

import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import VariationsModal from "./VariationsModal";

const ProductsStockLevel = () => {
  const fetchProducts = useFetchProducts();
  const fetchAllProducts = useFetchAllProducts();
  const deleteProduct = useDeleteProduct();
  const filteredProducts = useFilteredProducts();
  const isLoading = useIsLoading();
  const applyFilters = useApplyFilters();
  const filters = useFilters();
  const { currentPage, totalPages, itemsPerPage } = usePagination();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedHeadwear, setSelectedHeadwear] =
    useState<string>("all-in-headwear");
  const [selectedApparel, setSelectedApparel] =
    useState<string>("all-in-apparel");
  const [selectedCollection, setSelectedCollection] =
    useState<string>("all-in-collections");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "productName",
    direction: "asc",
  });

  // Initial load of all products
  useEffect(() => {
    console.log("Initial load - fetching all products");
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Handle pagination of displayed products
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedProducts = filteredProducts.slice(start, end);
      setDisplayedProducts(paginatedProducts);

      console.log("Pagination update:", {
        totalProducts: filteredProducts.length,
        displayedProducts: paginatedProducts.length,
        page: currentPage,
        itemsPerPage,
      });
    }
  }, [currentPage, itemsPerPage, filteredProducts]);

  // Monitor filtered products for debugging
  useEffect(() => {
    console.log("Current filter state:", {
      filters,
      filteredProductsCount: filteredProducts.length,
      filteredProducts: filteredProducts.map(p => ({
        name: p.productName,
        categories: p.category,
        searchableText: [...p.category, p.productName].join(" ").toLowerCase(),
        filterTypes: filters.types,
      })),
    });
  }, [filters, filteredProducts]);

  const handleSort = (key: string) => {
    console.log("Sort config:", {
      key,
      currentDirection: sortConfig.direction,
    });
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSearch = (term: string) => {
    console.log("Search params:", { term, itemsPerPage });
    setSearchTerm(term);
    applyFilters({
      ...filters,
      searchTerm: term || "", // Ensure empty string if term is null/undefined
    });
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
    }
  };

  const handleFilterChange = (value: FilterState["stockLevel"]) => {
    console.log("Filter change:", { value, currentFilters: filters });
    applyFilters({
      ...filters,
      stockLevel: value,
    });
  };

  const handleCategoryChange = (
    value: string,
    type: "headwear" | "apparel" | "collections"
  ) => {
    console.log("Category before processing:", { value, type });
    // Reset other filters when selecting a new category
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

    // Handle "all" cases to show only that category's products
    if (value.startsWith("all-in-")) {
      console.log("Setting main category filter:", type);
      applyFilters({
        ...filters,
        types: [type], // Just set the main category type
      });
      return;
    }

    let filterValue = value;

    // For headwear, use original value without prefix/suffix
    if (type === "headwear") {
      filterValue = value.replace("headwear-", "").replace("-headwear", "");

      console.log("Normalized headwear value:", {
        original: value,
        normalized: filterValue,
      });
    }

    // For apparel, handle special cases
    if (type === "apparel") {
      let apparelValue = value
        .replace("apparel-", "")
        .replace("-apparel", "")
        .replace("t-shirts", "tshirts");

      // Handle "new-in-apparel" specially
      if (value === "new-in-apparel") {
        apparelValue = "new";
      }

      filterValue = apparelValue;
      console.log("Normalized apparel value:", {
        original: value,
        normalized: filterValue,
      });
    }

    // For collections, just remove the -collection suffix
    if (type === "collections") {
      filterValue = value.replace("-collection", "");
      console.log("Normalized collection value:", {
        original: value,
        normalized: filterValue,
      });
    }

    console.log("Final filter values:", {
      type,
      originalValue: value,
      processedValue: filterValue,
    });

    applyFilters({
      ...filters,
      types: [type, filterValue],
    });
  };

  const clearFilters = () => {
    console.log("Clearing all filters");
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
  };

  const handleViewVariations = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleItemsPerPageChange = (value: number) => {
    // Reset to first page when changing items per page
    fetchProducts(1, value);
  };

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
        products={displayedProducts}
        isLoading={isLoading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onDelete={handleDelete}
        onViewVariations={handleViewVariations}
      />

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            if (currentPage > 1) {
              const newPage = currentPage - 1;
              fetchProducts(newPage, itemsPerPage);
            }
          }}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2 rounded-md bg-muted text-muted-foreground">
          Page {currentPage} of{" "}
          {Math.ceil(filteredProducts.length / itemsPerPage)}
        </span>
        <Button
          variant="outline"
          onClick={() => {
            const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
            if (currentPage < maxPage) {
              const newPage = currentPage + 1;
              fetchProducts(newPage, itemsPerPage);
            }
          }}
          disabled={
            currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)
          }
        >
          Next
        </Button>
      </div>

      <VariationsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsStockLevel;

//
