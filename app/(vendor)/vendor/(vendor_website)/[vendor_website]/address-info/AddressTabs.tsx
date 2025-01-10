"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, CreditCard } from "lucide-react";
import BillingAddressForm from "./BillingAddressForm";
import ShippingAddressForm from "./ShippingAddressForm";

const AddressTabs = () => {
  return (
    <Card className="shadow-black shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle>Your Addresses</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="billing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing Address
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Shipping Address
            </TabsTrigger>
          </TabsList>

          <TabsContent value="billing">
            <BillingAddressForm />
          </TabsContent>

          <TabsContent value="shipping">
            <ShippingAddressForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AddressTabs;
