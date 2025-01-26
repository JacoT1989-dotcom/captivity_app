"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { getStockLevels, updateStock } from "./actions";

type StockData = {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  product: {
    productName: string;
    category: string[];
  };
};

export default function StockLevelTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [data, setData] = useState<{
    variations: StockData[];
    total: number;
    pages: number;
  }>();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const result = await getStockLevels(page, search, sortOrder);
      setData(result);
    };
    loadData();
  }, [page, search, sortOrder]);

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by SKU or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Low to High</SelectItem>
            <SelectItem value="desc">High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Variation</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.variations.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.product.productName}
                </TableCell>
                <TableCell>
                  {item.name} - {item.color}, {item.size}
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.product.category.join(", ")}</TableCell>
                <TableCell>
                  <StockLevelBadge quantity={item.quantity} />
                </TableCell>
                <TableCell>
                  <UpdateStockDialog
                    variationId={item.id}
                    currentStock={item.quantity}
                    onUpdate={() => router.refresh()}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {page} of {data.pages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.min(data.pages, p + 1))}
          disabled={page === data.pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function StockLevelBadge({ quantity }: { quantity: number }) {
  if (quantity <= 5) {
    return <Badge variant="destructive">--{quantity} Critical</Badge>;
  }
  if (quantity <= 20) {
    return <Badge variant="destructive">{quantity} Low</Badge>;
  }
  return <Badge variant="secondary">{quantity} Good</Badge>;
}

function UpdateStockDialog({
  variationId,
  currentStock,
  onUpdate,
}: {
  variationId: string;
  currentStock: number;
  onUpdate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Stock Level</DialogTitle>
        </DialogHeader>
        <form
          action={async formData => {
            await updateStock(formData);
            setOpen(false);
            onUpdate();
          }}
          className="space-y-4"
        >
          <input type="hidden" name="variationId" value={variationId} />
          <div className="space-y-2">
            <label>New Quantity:</label>
            <Input
              type="number"
              name="quantity"
              min="0"
              defaultValue={currentStock}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
