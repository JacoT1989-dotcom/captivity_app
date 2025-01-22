"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useApplyFilters,
  useDeleteProduct,
  useFetchProducts,
  useFilteredProducts,
  useFilters,
  useIsLoading,
  usePagination,
} from "../_store/product-store";
import { FilterState, Product } from "../types";
import {
  isApparelProduct,
  isHeadwearProduct,
  matchesCollectionCategory,
  matchesCategory,
} from "../utils";

import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import VariationsModal from "./VariationsModal";

const ProductsStockLevel = () => {
  const fetchProducts = useFetchProducts();
  const deleteProduct = useDeleteProduct();
  const filteredProducts = useFilteredProducts();
  const isLoading = useIsLoading();
  const applyFilters = useApplyFilters();
  const filters = useFilters();
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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "productName",
    direction: "asc",
  });

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, fetchProducts]);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchProducts(1, itemsPerPage, term);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
    }
  };

  const handleFilterChange = (value: FilterState["stockLevel"]) => {
    applyFilters({
      ...filters,
      stockLevel: value,
    });
  };

  const handleCategoryChange = (
    value: string,
    type: "headwear" | "apparel" | "collections"
  ) => {
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

    // Handle "all" cases
    if (
      value === "all-in-headwear" ||
      value === "all-in-apparel" ||
      value === "all-in-collections"
    ) {
      applyFilters({
        ...filters,
        types:
          type === "headwear"
            ? ["headwear"]
            : type === "apparel"
              ? ["apparel"]
              : type === "collections"
                ? ["all-collections"]
                : [],
      });
      return;
    }

    // Handle specific category types
    if (type === "headwear") {
      const headwearValue = value
        .replace("headwear-", "")
        .replace("-headwear", "");
      applyFilters({
        ...filters,
        types: ["headwear", headwearValue],
      });
    } else if (type === "apparel") {
      const apparelValue = value
        .replace("apparel-", "")
        .replace("-apparel", "");
      applyFilters({
        ...filters,
        types: ["apparel", apparelValue],
      });
    } else if (type === "collections") {
      const collectionValue = value.replace("-collection", "");
      applyFilters({
        ...filters,
        types: ["collections", collectionValue],
      });
    }
  };

  const clearFilters = () => {
    setSelectedHeadwear("all-in-headwear");
    setSelectedApparel("all-in-apparel");
    setSelectedCollection("all-in-collections");
    setSearchTerm("");
    applyFilters({
      stockLevel: "all",
      sizes: [],
      colors: [],
      types: [],
    });
    fetchProducts(1, itemsPerPage);
  };

  const handleViewVariations = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
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
        onItemsPerPageChange={value => fetchProducts(1, value)}
      />

      <ProductTable
        products={filteredProducts}
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
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2 rounded-md bg-muted text-muted-foreground">
          {currentPage}
        </span>
        <Button
          variant="outline"
          onClick={() => fetchProducts(currentPage + 1, itemsPerPage)}
          disabled={currentPage === totalPages}
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
