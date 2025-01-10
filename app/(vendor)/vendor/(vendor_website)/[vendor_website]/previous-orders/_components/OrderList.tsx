"use client";

import React, { useState, useEffect, useCallback } from "react";
import { VendorOrder, OrderSearchParams } from "../types";
import { OrderStatus } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVendorOrders } from "../actions";
import Link from "next/link";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { OrderFilters } from "./OrderFilters";
import { OrderCard } from "./OrderCard";
import { VendorOrderSummary } from "./VendorOrderSummary";
import { useParams } from "next/navigation";

interface VendorOrderListProps {
  userId: string;
  initialOrders?: VendorOrder[];
}

const VendorOrderList: React.FC<VendorOrderListProps> = ({
  userId,
  initialOrders,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [orders, setOrders] = useState<VendorOrder[]>(initialOrders || []);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState<string>();
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({
    page: 1,
    limit: 10,
    query: "",
    customerType: "all",
  });
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    totalAmount: 0,
  });

  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;

  const debouncedSearch = useCallback((value: string) => {
    const timeoutId = setTimeout(() => {
      setSearchParams(prev => ({
        ...prev,
        query: value,
        page: 1,
      }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;
    setIsLoadingOrders(true);
    setError(undefined);

    try {
      const response = await getVendorOrders(userId, {
        ...searchParams,
        startDate: dateRange?.from,
        endDate: dateRange?.to,
      });

      if (response.success && response.data) {
        setOrders(response.data);
        if (response.meta) {
          setMeta(response.meta);
        }
      } else {
        setError(response.error || "Failed to fetch vendor orders");
        setOrders([]);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [userId, searchParams, dateRange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleStatusFilter = (status: OrderStatus | "ALL") => {
    setSearchParams(prev => ({
      ...prev,
      status: status === "ALL" ? undefined : status,
      page: 1,
    }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setSearchParams(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-destructive">
            <span className="text-lg">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendor orders..."
            onChange={handleSearch}
            className="pl-9 shadow-black shadow-2xl"
          />
        </div>
        <OrderFilters
          onStatusChange={handleStatusFilter}
          onDateRangeChange={handleDateRangeChange}
          dateRange={dateRange}
        />
      </div>

      <VendorOrderSummary
        stats={{
          totalOrders: meta.totalOrders,
          totalAmount: meta.totalAmount,
          pendingOrders: orders.filter(o => o.status === "PENDING").length,
          processingOrders: orders.filter(o => o.status === "PROCESSING")
            .length,
        }}
      />

      {isLoadingOrders ? (
        <div className="flex justify-center py-8">
          <span className="text-gray-700 loading loading-spinner loading-lg" />
          Loading vendor orders...
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No orders found</p>
              <Button asChild>
                <Link href={`/vendor/${vendorWebsite}`}>
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}

          {meta.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(meta.currentPage - 1)}
                  disabled={meta.currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  page => (
                    <Button
                      key={page}
                      variant={
                        page === meta.currentPage ? "default" : "outline"
                      }
                      onClick={() => handlePageChange(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(meta.currentPage + 1)}
                  disabled={meta.currentPage === meta.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorOrderList;
