"use client";
//! Need to create a useMemo with pagination so that it doesn't render on every page changing

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order, OrderStatus, OrderSearchParams } from "./types";
import { formatDate, getStatusColor } from "@/lib/utils";
import {
  Package,
  Building2,
  User2,
  Calendar,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Building,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { PrintButton } from "./_components/PrintButton";
import { getUserOrders } from "./actions";
import { DateRange } from "react-day-picker";

const OrderHistory = ({
  userId,
  initialOrders,
}: {
  userId: string;
  initialOrders?: Order[];
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [orders, setOrders] = useState<Order[]>(initialOrders || []);
  const [isLoadingPreviousOrder, setIsLoadingPreviousOrder] = useState(true);
  const [error, setError] = useState<string>();
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({
    page: 1,
    limit: 10,
    query: "",
  });
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });

  // Debounced search function
  //?   Without debounce: Searches for "j", then "ja", then "jav", then "java"... (6 separate searches!)
  //? With debounce: Waits until you finish typing, then does one search for "javascript"
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

  // Fetch orders function
  const fetchOrders = useCallback(async () => {
    if (!userId) return;

    setIsLoadingPreviousOrder(true);
    setError(undefined);

    try {
      const response = await getUserOrders(userId, {
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
        setError(response.error || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setOrders([]);
    } finally {
      setIsLoadingPreviousOrder(false);
    }
  }, [userId, searchParams, dateRange]);

  // Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({
      ...prev,
      status: status === "ALL" ? undefined : (status as OrderStatus),
      page: 1,
    }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setSearchParams(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }));
  };

  // Effect to fetch orders when params change
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
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(OrderStatus).map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePickerWithRange
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoadingPreviousOrder ? (
        <div className="flex justify-center py-8">
          <span className="text-gray-700 loading loading-spinner loading-lg" />
          Loading previous orders...
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No orders found</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {orders.map(order => (
            <Card key={order.id} className="group">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-xl">
                        #{order.id.slice(-8)}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Placed on {formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <PrintButton order={order} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-6">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span>Order Details</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Collection Method</p>
                            <p className="text-sm text-muted-foreground">
                              {order.methodOfCollection}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Branch</p>
                            <p className="text-sm text-muted-foreground">
                              {order.captivityBranch}
                            </p>
                          </div>
                        </div>

                        {order.salesRep && (
                          <div className="flex items-start space-x-3">
                            <User2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">
                                Sales Representative
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.salesRep}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Delivery Address</p>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                {order.firstName} {order.lastName}
                              </p>
                              {order.companyName && (
                                <p className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {order.companyName}
                                </p>
                              )}
                              <p>{order.streetAddress}</p>
                              {order.apartmentSuite && (
                                <p>{order.apartmentSuite}</p>
                              )}
                              <p>
                                {order.townCity}, {order.province}
                              </p>
                              <p>{order.postcode}</p>
                              <p>{order.countryRegion}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {order.phone}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {order.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Order Items</h3>
                      <div className="space-y-4">
                        {order.orderItems.map(item => (
                          <HoverCard key={item.id}>
                            <HoverCardTrigger asChild>
                              <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                  <Image
                                    src={
                                      item.variation.variationImageURL ||
                                      "/placeholder.png"
                                    }
                                    alt={item.variation.name}
                                    className="object-cover"
                                    fill
                                    sizes="(max-width: 64px) 100vw"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">
                                    {item.variation.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {item.variation.color} /{" "}
                                    {item.variation.size}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    R{item.price.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <p className="text-sm font-medium">
                                  Product Details
                                </p>
                                <p className="text-sm">
                                  SKU: {item.variation.sku}
                                </p>
                                {item.variation.sku2 && (
                                  <p className="text-sm">
                                    SKU2: {item.variation.sku2}
                                  </p>
                                )}
                                <p className="text-sm font-medium mt-2">
                                  Total
                                </p>
                                <p className="text-sm">
                                  R{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
                {order.orderNotes && (
                  <div className="text-sm max-w-[70%]">
                    <span className="font-medium">Order Notes: </span>
                    <span className="text-muted-foreground">
                      {order.orderNotes}
                    </span>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-semibold">
                    R{order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}

          {/* Pagination */}
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

export default OrderHistory;
