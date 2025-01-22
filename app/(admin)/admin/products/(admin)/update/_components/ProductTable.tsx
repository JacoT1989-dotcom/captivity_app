import React from "react";
import { ChevronDown, ChevronUp, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "../types";
import { calculateTotalStock, getStockStatus } from "../utils";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  sortConfig: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort: (key: string) => void;
  onDelete: (productId: string) => void;
  onViewVariations: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  sortConfig,
  onSort,
  onDelete,
  onViewVariations,
}) => {
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
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th
              className="px-4 py-3 text-left font-medium cursor-pointer"
              onClick={() => onSort("productName")}
            >
              <div className="flex items-center gap-1">
                Name
                {renderSortIcon("productName")}
              </div>
            </th>
            <th
              className="px-4 py-3 text-left font-medium cursor-pointer"
              onClick={() => onSort("category")}
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
          ) : products.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No products found matching your filters
              </td>
            </tr>
          ) : (
            products.map(product => {
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
                      onClick={() => onViewVariations(product)}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => onDelete(product.id)}
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
  );
};

export default ProductTable;
