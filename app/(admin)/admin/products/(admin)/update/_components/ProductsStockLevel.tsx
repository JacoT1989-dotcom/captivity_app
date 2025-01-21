"use client";
import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  collection: string;
  stockLevel: number;
  sizes: string[];
  colors: string[];
}

type SortKey =
  | keyof Pick<Product, "name" | "stockLevel" | "collection">
  | "sizes"
  | "colors";

interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

const ProductsStockLevel = () => {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Product A",
      collection: "Electronics",
      stockLevel: 45,
      sizes: ["S", "M", "L"],
      colors: ["Red", "Blue"],
    },
    {
      id: 2,
      name: "Product B",
      collection: "Fashion",
      stockLevel: 23,
      sizes: ["XS", "S"],
      colors: ["Black", "White", "Gray"],
    },
    {
      id: 3,
      name: "Product C",
      collection: "Electronics",
      stockLevel: 67,
      sizes: ["M", "L", "XL"],
      colors: ["Green"],
    },
    {
      id: 4,
      name: "Product D",
      collection: "Home",
      stockLevel: 12,
      sizes: ["One Size"],
      colors: ["Brown", "Beige"],
    },
    {
      id: 5,
      name: "Product E",
      collection: "Fashion",
      stockLevel: 89,
      sizes: ["S", "M"],
      colors: ["Navy", "White"],
    },
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionFilter, setCollectionFilter] = useState<string>("all");

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key === "sizes" || sortConfig.key === "colors") {
      const aLength = a[sortConfig.key].length;
      const bLength = b[sortConfig.key].length;
      return sortConfig.direction === "asc"
        ? aLength - bLength
        : bLength - aLength;
    }

    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredProducts = sortedProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.colors.some(color =>
        color.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      product.sizes.some(size =>
        size.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCollection =
      collectionFilter === "all" || product.collection === collectionFilter;
    return matchesSearch && matchesCollection;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return null;
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
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={collectionFilter} onValueChange={setCollectionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={value => setItemsPerPage(Number(value))}
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
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("collection")}
              >
                <div className="flex items-center gap-1">
                  Collection
                  {renderSortIcon("collection")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("sizes")}
              >
                <div className="flex items-center gap-1">
                  Sizes
                  {renderSortIcon("sizes")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("colors")}
              >
                <div className="flex items-center gap-1">
                  Colors
                  {renderSortIcon("colors")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => handleSort("stockLevel")}
              >
                <div className="flex items-center gap-1">
                  Stock Level
                  {renderSortIcon("stockLevel")}
                </div>
              </th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedProducts.map(product => (
              <tr key={product.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">{product.id}</td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.collection}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map(size => (
                      <Badge key={size} variant="secondary" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.colors.map(color => (
                      <Badge key={color} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{product.stockLevel}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2 rounded-md bg-muted text-muted-foreground">
          {currentPage}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductsStockLevel;
