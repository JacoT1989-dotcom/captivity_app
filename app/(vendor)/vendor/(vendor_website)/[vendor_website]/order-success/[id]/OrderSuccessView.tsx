"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  CheckCircle2,
  Printer,
  ChevronRight,
  Package,
  Mail,
  Clock,
  Building,
  Phone,
  MapPin,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VendorOrder } from "../../shop_product/checkout/_lib/types";
import { useParams } from "next/navigation";

interface VendorOrderSuccessViewProps {
  order: VendorOrder[] | null;
}

export const VendorOrderSuccessView: React.FC<VendorOrderSuccessViewProps> = ({
  order: orderArray,
}) => {
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;
  if (!orderArray || orderArray.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Order not found
            </h1>
            <Button asChild className="mt-4">
              <Link href={`/vendor/${vendorWebsite}/previous-orders`}>
                View All Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const order = orderArray[0];
  const displayOrderId = order.id.slice(0, 8);
  const formattedDate = format(
    new Date(order.createdAt),
    "MMMM dd, yyyy 'at' HH:mm"
  );

  const formatPrice = (amount: number): string => {
    return `R${amount.toFixed(2)}`;
  };

  const calculateItemTotal = (price: number, quantity: number): number => {
    return price * quantity;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header with Animation */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-ping" />
              <CheckCircle2 className="relative h-20 w-20 text-emerald-500 dark:text-emerald-400 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Thank you for your vendor order!
          </h1>
          <p className="text-lg text-muted-foreground">
            Order #{" "}
            <span className="font-mono font-medium">{displayOrderId}</span>
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="mb-8">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  Order Placed
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <Card className="mb-8 shadow-2xl shadow-black">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Vendor Order Details</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {formattedDate}
                </CardDescription>
              </div>
              <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                {order.status}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center text-foreground">
                    <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                    Vendor Customer Information
                  </h3>
                  <div className="bg-secondary rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">
                        {order.firstName} {order.lastName}
                      </span>
                    </p>
                    <p className="text-sm flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {order.email}
                    </p>
                    <p className="text-sm flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center text-foreground">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    Shipping Address
                  </h3>
                  <div className="bg-secondary rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {order.companyName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.streetAddress}
                    </p>
                    {order.apartmentSuite && (
                      <p className="text-sm text-muted-foreground">
                        {order.apartmentSuite}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {order.townCity}, {order.province} {order.postcode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.countryRegion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-muted-foreground" />
                  Order Summary
                </h3>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {order.vendorOrderItems.map(item => (
                          <tr
                            key={item.id}
                            className="hover:bg-muted/50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">
                                  {
                                    item.vendorVariation.vendorProduct
                                      .productName
                                  }
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {item.vendorVariation.size} /{" "}
                                  {item.vendorVariation.color}
                                </span>
                                {item.vendorVariation.variationImageURL && (
                                  <div className="relative w-16 h-16 mt-2">
                                    <Image
                                      src={
                                        item.vendorVariation.variationImageURL
                                      }
                                      alt={
                                        item.vendorVariation.vendorProduct
                                          .productName
                                      }
                                      fill
                                      sizes="(max-width: 64px) 100vw, 64px"
                                      className="rounded object-cover"
                                      priority={true}
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-center text-muted-foreground">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-foreground font-medium">
                              {formatPrice(
                                calculateItemTotal(item.price, item.quantity)
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-muted">
                          <td
                            colSpan={2}
                            className="px-6 py-4 text-sm font-medium text-right text-foreground"
                          >
                            Total Amount:
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-lg font-bold text-foreground">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border mt-6 flex justify-between items-center">
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <Button asChild>
              <Link href={`/vendor/${vendorWebsite}/previous-orders`}>
                View All Orders
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Next Steps */}
        <div className="text-center space-y-4 mt-8">
          <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              A confirmation email has been sent to{" "}
              <span className="font-medium">{order.email}</span>
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
              You can track your order status in{" "}
              <Link
                href={`/vendor/${vendorWebsite}/previous-orders`}
                className="font-medium underline hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
              >
                your orders
              </Link>
            </p>
          </div>

          <div className="flex justify-center space-x-6 text-sm">
            <Link
              href={`/vendor/${vendorWebsite}/help`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Need Help?
            </Link>
            <Link
              href={`/vendor/${vendorWebsite}/faq`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQs
            </Link>
            <Link
              href={`/vendor/${vendorWebsite}/policy`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Returns Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
