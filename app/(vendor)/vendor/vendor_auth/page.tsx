"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VendorLoginForm } from "./_components/VendorLoginForm";
import { VendorRegisterForm } from "./_components/VendorRegisterForm";
import { AnimatePresence, motion as m } from "framer-motion";
import { Store, Building2, Users, ShoppingCart, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VendorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vendorSlug = searchParams?.get("vendor");

  const features = [
    { icon: Building2, text: "Manage multiple stores" },
    { icon: Users, text: "Connect with customers" },
    { icon: ShoppingCart, text: "Track sales in real-time" },
  ];

  const handleBack = () => {
    if (vendorSlug) {
      router.push(`/vendor/${vendorSlug}/welcome`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Back Button */}
      {vendorSlug && (
        <div className="container mx-auto px-4 pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="group flex items-center gap-2 hover:bg-background/80"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Store
          </Button>
        </div>
      )}

      <div className="container mx-auto min-h-screen flex flex-col lg:flex-row items-center gap-8 px-4 py-8 lg:py-0">
        <m.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-xl w-full lg:max-w-xl text-center lg:text-left"
        >
          <Store className="w-12 h-12 lg:w-16 lg:h-16 text-primary mb-6 lg:mb-8 mx-auto lg:mx-0" />
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4 lg:mb-6">
            Welcome to
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mt-2">
              Vendor Portal
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8">
            Empower your business with our comprehensive vendor management
            platform
          </p>

          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                className="flex items-center gap-4 justify-center lg:justify-start"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <span className="text-base lg:text-lg">{feature.text}</span>
              </m.div>
            ))}
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 w-full max-w-md"
        >
          <Card className="border-2 shadow-2xl backdrop-blur-sm bg-background/95">
            <CardHeader className="space-y-1 px-4 lg:px-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-center">
                Vendor Access
              </CardTitle>
              <CardDescription className="text-center text-sm lg:text-base">
                Login or register to manage your store
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 lg:px-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <div className="space-y-4 mt-4">
                    <VendorLoginForm />
                  </div>
                </TabsContent>
                <TabsContent value="register">
                  <div className="space-y-4 mt-4">
                    <VendorRegisterForm />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </m.div>
      </div>
    </div>
  );
}
