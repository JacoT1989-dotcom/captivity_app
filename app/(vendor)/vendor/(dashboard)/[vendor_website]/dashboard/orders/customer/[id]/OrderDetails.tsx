"use client";

import { OrderStatus } from "@prisma/client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VendorOrderResponse } from "./types";

type SuccessResponse = Extract<VendorOrderResponse, { success: true }>;

interface OrderDetailsProps {
  order: SuccessResponse["data"];
  storeSlug: string;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusStyles = {
    PENDING:
      "bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F] dark:text-[#FEF3C7]",
    PROCESSING:
      "bg-[#DBEAFE] text-[#1E40AF] dark:bg-[#1E3A8A] dark:text-[#DBEAFE]",
    SHIPPED:
      "bg-[#E0E7FF] text-[#4338CA] dark:bg-[#3730A3] dark:text-[#E0E7FF]",
    DELIVERED:
      "bg-[#D1FAE5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#D1FAE5]",
    CANCELLED:
      "bg-[#FEE2E2] text-[#991B1B] dark:bg-[#7F1D1D] dark:text-[#FEE2E2]",
    REFUNDED:
      "bg-[#E5E7EB] text-[#1F2937] dark:bg-[#1F2937] dark:text-[#E5E7EB]",
  };

  return (
    <Badge className={`${statusStyles[status]} font-medium px-3 py-1`}>
      {status}
    </Badge>
  );
};

export default function OrderDetails({
  order,
  storeSlug,
  onUpdateStatus,
}: OrderDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [error, setError] = useState<string | null>(null);

  if (!("vendorOrderItems" in order)) return null;

  const canUpdateStatus =
    order.user?.role === "VENDOR" ||
    (order.user?.role === "VENDORCUSTOMER" &&
      order.user?.storeSlug?.startsWith(storeSlug));

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      setError(null);
      await onUpdateStatus(order.id, newStatus);
      setCurrentStatus(newStatus);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full bg-card">
      <CardHeader className="space-y-2 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-lg sm:text-xl text-card-foreground">
            Order #{order.id.slice(-6)}
          </CardTitle>
          <StatusBadge status={currentStatus} />
        </div>
      </CardHeader>

      {error && (
        <Alert variant="destructive" className="mx-4 sm:mx-6 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CardContent className="space-y-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-card-foreground">
              Customer Details
            </h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>
                Name:{" "}
                <span className="text-card-foreground">
                  {order.firstName} {order.lastName}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="text-card-foreground">{order.email}</span>
              </p>
              <p>
                Phone:{" "}
                <span className="text-card-foreground">{order.phone}</span>
              </p>
              <p>
                Company:{" "}
                <span className="text-card-foreground">
                  {order.companyName}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-card-foreground">
              Shipping Address
            </h3>
            <div className="space-y-1.5 text-sm text-card-foreground">
              <p>{order.streetAddress}</p>
              {order.apartmentSuite && <p>{order.apartmentSuite}</p>}
              <p>
                {order.townCity}, {order.province}
              </p>
              <p>{order.postcode}</p>
              <p>{order.countryRegion}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Order Items</h3>
          <div className="space-y-3">
            {order.vendorOrderItems.map(item => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted rounded-lg gap-3"
              >
                <div className="space-y-1 w-full sm:w-auto">
                  <p className="font-medium text-card-foreground">
                    {item.vendorVariation.vendorProduct.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.vendorVariation.sku} |{" "}
                    {item.vendorVariation.color} | {item.vendorVariation.size}
                  </p>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <p className="text-card-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="text-card-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <p className="text-lg font-semibold text-card-foreground">
              Total: ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>

      {canUpdateStatus && (
        <CardFooter className="flex flex-wrap gap-2 justify-end px-4 sm:px-6 py-4">
          {Object.values(OrderStatus).map(status => (
            <Button
              key={status}
              variant={currentStatus === status ? "outline" : "default"}
              onClick={() => handleStatusUpdate(status)}
              disabled={isUpdating || currentStatus === status}
              className="min-w-[120px] h-9"
            >
              {status}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
