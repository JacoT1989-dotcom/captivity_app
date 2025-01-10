"use client";

import { VendorOrder } from "../types";
import { formatDate, getStatusColor } from "@/lib/utils";
import Image from "next/image";
import { canAccessVendorFeatures } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Calendar,
  ChevronDown,
  Package,
  Building2,
  User2,
  MapPin,
  Phone,
  Mail,
  Building,
  Store,
  UserCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { VendorPrintButton } from "./PrintButton";

interface OrderCardProps {
  order: VendorOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card key={order.id} className="group shadow-black shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">
                #{order.referenceNumber || order.id.slice(-8)}
              </h2>
              <Badge
                variant="secondary"
                className={getStatusColor(order.status)}
              >
                {order.status}
              </Badge>
              {order.user && canAccessVendorFeatures(order.user.role) && (
                <Badge
                  variant="outline"
                  className="border-blue-500 text-blue-500"
                >
                  Vendor Customer
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VendorPrintButton order={order} />
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
                    <p className="font-medium">Vendor Branch</p>
                    <p className="text-sm text-muted-foreground">
                      {order.vendorBranch}
                    </p>
                  </div>
                </div>

                {order.salesRep && (
                  <div className="flex items-start space-x-3">
                    <User2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Sales Representative</p>
                      <p className="text-sm text-muted-foreground">
                        {order.salesRep}
                      </p>
                    </div>
                  </div>
                )}

                {order.user && (
                  <div className="flex items-start space-x-3">
                    <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Customer Account</p>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.user.displayName}</p>
                        <p>{order.user.email}</p>
                        {order.user.storeSlug && (
                          <p className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            {order.user.storeSlug}
                          </p>
                        )}
                      </div>
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
                      {order.apartmentSuite && <p>{order.apartmentSuite}</p>}
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
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="font-semibold">Order Items</h3>
              <div className="space-y-4">
                {order.vendorOrderItems.map(item => (
                  <HoverCard key={item.id}>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={
                              item.vendorVariation.variationImageURL ||
                              "/placeholder.png"
                            }
                            alt={item.vendorVariation.name}
                            className="object-cover"
                            fill
                            sizes="(max-width: 64px) 100vw"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">
                            {item.vendorVariation.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.vendorVariation.color} /{" "}
                            {item.vendorVariation.size}
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
                        <p className="text-sm font-medium">Product Details</p>
                        <p className="text-sm">
                          SKU: {item.vendorVariation.sku}
                        </p>
                        {item.vendorVariation.sku2 && (
                          <p className="text-sm">
                            SKU2: {item.vendorVariation.sku2}
                          </p>
                        )}
                        <p className="text-sm font-medium mt-2">Total</p>
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
            <span className="text-muted-foreground">{order.orderNotes}</span>
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
  );
}
