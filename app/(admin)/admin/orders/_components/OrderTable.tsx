"use client";

import React, { useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { getOrdersByStatus, updateOrderStatus } from "./actions";
import { OrderStatus } from "@prisma/client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { OrderTableProps } from "./types";

const OrderTable: React.FC<OrderTableProps> = ({
  initialData,
  status,
  title,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") ?? ""
  );

  const currentPage = Number(searchParams?.get("page")) || 1;

  const createQueryString = (params: Record<string, string | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() ?? "");

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    return newSearchParams.toString();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryString = createQueryString({
      search: searchQuery || undefined,
      page: "1",
    });
    router.push(`${pathname}?${queryString}`);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      handleRefresh();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  return (
    <Card className="w-full mt-20">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button type="submit">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>

            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {initialData.orders.length} of {initialData.totalOrders}{" "}
            orders
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.orders.map(order => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted-foreground"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <TableCell>
                    {order.referenceNumber || order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{order.companyName}</TableCell>
                  <TableCell>
                    <div>
                      <div>{`${order.firstName} ${order.lastName}`}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>R {order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{order.orderItems.length} items</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={value =>
                        handleStatusChange(order.id, value as OrderStatus)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(OrderStatus).map(status => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {initialData.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        const queryString = createQueryString({
                          page: String(Math.max(1, currentPage - 1)),
                        });
                        router.push(`${pathname}?${queryString}`);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {[...Array(initialData.totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => {
                          const queryString = createQueryString({
                            page: String(i + 1),
                          });
                          router.push(`${pathname}?${queryString}`);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        const queryString = createQueryString({
                          page: String(
                            Math.min(initialData.totalPages, currentPage + 1)
                          ),
                        });
                        router.push(`${pathname}?${queryString}`);
                      }}
                      className={
                        currentPage === initialData.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTable;
