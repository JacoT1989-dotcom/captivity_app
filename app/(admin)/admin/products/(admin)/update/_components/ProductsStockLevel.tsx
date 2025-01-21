"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import VariationsModal from "./VariationsModal";
import {
  useApplyFilters,
  useDeleteProduct,
  useFetchProducts,
  useFilteredProducts,
  useFilters,
  useIsLoading,
  usePagination,
  useProducts,
} from "../_store/product-store";
import { FilterState, Product } from "../types";
import { calculateTotalStock, getStockStatus } from "../utils";

const LOW_STOCK_THRESHOLD = 5;

const ProductsStockLevel = () => {
  const fetchProducts = useFetchProducts();
  const deleteProduct = useDeleteProduct();
  const products = useProducts();
  const filteredProducts = useFilteredProducts();
  const isLoading = useIsLoading();
  const applyFilters = useApplyFilters();
  const filters = useFilters();
  const { currentPage, totalPages, itemsPerPage } = usePagination();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleViewVariations = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return null;
  };

  const getStockBadgeColor = (quantity: number) => {
    const status = getStockStatus(quantity);
    switch (status) {
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "in-stock":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>

          <Select value={filters.stockLevel} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stock Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">
                Low Stock ({LOW_STOCK_THRESHOLD} or less)
              </SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={value => fetchProducts(1, Number(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Show 10</SelectItem>
              <SelectItem value="20">Show 20</SelectItem>
              <SelectItem value="40">Show 40</SelectItem>
              <SelectItem value="100">Show 100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("productName")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {renderSortIcon("productName")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category
                  {renderSortIcon("category")}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium">Variations</th>
              <th className="px-4 py-3 text-left font-medium">Stock Level</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading products...
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const totalStock = calculateTotalStock(product.variations);
                const stockBadgeColor = getStockBadgeColor(totalStock);

                return (
                  <tr key={product.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">{product.id}</td>
                    <td className="px-4 py-3">{product.productName}</td>
                    <td className="px-4 py-3">{product.category.join(", ")}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewVariations(product)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View {product.variations.length} Variations
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${stockBadgeColor}`}
                      >
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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

      {/* Variations Modal */}
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
