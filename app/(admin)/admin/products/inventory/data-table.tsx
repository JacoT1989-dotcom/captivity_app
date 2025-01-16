"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { updateInventoryQuantity } from "./actions";

type Product = {
  id: string;
  productName: string;
  category: string[];
  sellingPrice: number;
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    quantity: number;
  }[];
};

interface DataTableProps {
  data: Product[];
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export function DataTable({
  data,
  pageCount,
  currentPage,
  pageSize,
}: DataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const handlePageSizeChange = (newSize: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("pageSize", newSize);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleQuantityEdit = async (variationId: string) => {
    try {
      await updateInventoryQuantity(variationId, editValue);
      setEditingId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size} items per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="border-r">Product Name</TableHead>
              <TableHead className="border-r">Category</TableHead>
              <TableHead className="border-r">SKU</TableHead>
              <TableHead className="border-r">Stock</TableHead>
              <TableHead className="border-r text-right">Price</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(product => (
              <TableRow key={product.id} className="hover:bg-muted/50">
                <TableCell className="border-r font-medium">
                  {product.productName}
                </TableCell>
                <TableCell className="border-r">
                  {product.category.join(", ")}
                </TableCell>
                <TableCell className="border-r">
                  {product.variations.map(v => v.sku).join(", ")}
                </TableCell>
                <TableCell className="border-r">
                  {product.variations.map(v => (
                    <div
                      key={v.id}
                      className="text-sm flex items-center space-x-2"
                    >
                      {editingId === v.id ? (
                        <>
                          <Input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(Number(e.target.value))}
                            className="w-20 h-8"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleQuantityEdit(v.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <span>
                            {v.name}: {v.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingId(v.id);
                              setEditValue(v.quantity);
                            }}
                          >
                            Edit
                          </Button>
                          {v.quantity <= 10 && (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                              Low Stock
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </TableCell>
                <TableCell className="border-r text-right">
                  R{product.sellingPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/products/inventory/${product.id}`)
                    }
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {pageCount}
        </span>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
