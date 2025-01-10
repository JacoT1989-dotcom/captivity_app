"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollectionsStore } from "../_store/useCollectionsStore";

interface FeaturedImage {
  thumbnail: string;
  medium: string;
  large: string;
}

interface Product {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  featuredImage?: FeaturedImage | null;
}

interface ThemeColors {
  primary: string;
  hover: string;
  text?: string;
  accent?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
}

type ProductTableProps = {
  products: Product[];
  isLoading?: boolean;
  themeColors?: ThemeColors;
};

const getColor = (color: string) => color.replace("[", "").replace("]", "");

export function ProductTable({
  products,
  isLoading = false,
  themeColors = {
    primary: "#3b82f6",
    hover: "#2563eb",
  },
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [publishFilter, setPublishFilter] = useState<
    "all" | "published" | "unpublished"
  >("all");
  const { toggleProductStatus } = useCollectionsStore();

  const ITEMS_PER_PAGE = 6;

  const buttonStyle = {
    borderColor: getColor(themeColors.primary),
    "--hover-bg": getColor(themeColors.hover),
  } as React.CSSProperties;

  const activeButtonStyle = {
    backgroundColor: getColor(themeColors.primary),
    borderColor: getColor(themeColors.primary),
    color: "white",
  } as React.CSSProperties;

  const searchProduct = (product: Product, query: string) => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return true;

    const searchableValues = [
      product.productName,
      product.id,
      product.sellingPrice.toString(),
      product.isPublished ? "published" : "unpublished",
    ];

    return searchableValues.some(value =>
      value.toLowerCase().includes(searchTerm)
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchProduct(product, searchQuery);

      const matchesPublishFilter =
        publishFilter === "all" ||
        (publishFilter === "published" && product.isPublished) ||
        (publishFilter === "unpublished" && !product.isPublished);

      return matchesSearch && matchesPublishFilter;
    });
  }, [products, searchQuery, publishFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePublishToggle = async (productId: string) => {
    await toggleProductStatus(productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Search Collection
          </h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all fields..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-8 bg-background border-2 dark:border-border focus-visible:ring-2 dark:focus-visible:ring-ring"
              style={{ borderColor: getColor(themeColors.primary) }}
            />
          </div>
        </div>

        <Select
          value={publishFilter}
          onValueChange={(value: "all" | "published" | "unpublished") =>
            setPublishFilter(value)
          }
        >
          <SelectTrigger
            className="w-full sm:w-[180px] text-white dark:text-foreground border-border transition-colors dark:bg-background"
            style={{ backgroundColor: getColor(themeColors.primary) }}
          >
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="published">Published Only</SelectItem>
            <SelectItem value="unpublished">Unpublished Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="bg-muted">Image</TableHead>
              <TableHead className="bg-muted">Product Name</TableHead>
              <TableHead className="bg-muted">Product Id</TableHead>
              <TableHead className="bg-muted">Price</TableHead>
              <TableHead className="bg-muted">Status</TableHead>
              <TableHead className="bg-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map(product => (
                <TableRow key={product.id} className="border-border">
                  <TableCell>
                    {product.featuredImage?.thumbnail ? (
                      <div className="relative h-12 w-12">
                        <Image
                          src={product.featuredImage.thumbnail}
                          alt={product.productName}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>R{product.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        product.isPublished
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      )}
                    >
                      {product.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={product.isPublished}
                      onCheckedChange={() => handlePublishToggle(product.id)}
                      aria-label="Toggle publish status"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 dark:border-border hover:text-white dark:hover:bg-background"
              style={buttonStyle}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 dark:border-border hover:text-white dark:hover:bg-background"
              style={buttonStyle}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx + 1}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(idx + 1)}
                  className="h-8 w-8 dark:border-border hover:text-white dark:hover:bg-background"
                  style={
                    currentPage === idx + 1 ? activeButtonStyle : buttonStyle
                  }
                >
                  {idx + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 dark:border-border hover:text-white dark:hover:bg-background"
              style={buttonStyle}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 dark:border-border hover:text-white dark:hover:bg-background"
              style={buttonStyle}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
