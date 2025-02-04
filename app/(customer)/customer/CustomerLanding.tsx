"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  MapPin,
  User,
  ShoppingCart,
  CreditCard,
  Truck,
  Camera,
  LayoutGrid,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { getOrder } from "./shopping/checkout/actions";
import { useSession } from "../SessionProvider";
import Header from "./_components/Header";
import { logout } from "@/app/(auth)/actions";

import { Order } from "../types";

interface CustomerLandingProps {
  initialOrderId: string | null;
}

const CustomerLanding = ({ initialOrderId }: CustomerLandingProps) => {
  //*type annotation
  const [latestOrderId, setLatestOrderId] = useState<Order | null>(null);
  const { user } = useSession();
  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const result = await getOrder();
        if (result.success && result.data) {
          setLatestOrderId(result.data);
        }
      } catch (error) {
        console.error("Error fetching latest order:", error);
      }
    };

    fetchLatestOrder();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gradient-to-b from-background to-background/80">
      <header>
        <Header />

        <section
          aria-labelledby="customer-greeting"
          className="flex items-center justify-between mb-6 p-4 bg-card/50 rounded-lg backdrop-blur-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome {user.displayName}
              </h2>
              <p className="text-sm text-muted-foreground">
                Last ordered:{" "}
                <Badge variant="secondary">
                  {/*//!Ternary Operator: Inside those braces we're using a ternary operator which is like a compact if/else: latestOrder ? (truthy case) : (falsy case)*/}
                  {latestOrderId?.createdAt && (
                    <time
                      dateTime={new Date(latestOrderId.createdAt).toISOString()}
                    >
                      {new Date(latestOrderId.createdAt).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}
                    </time>
                  )}
                </Badge>
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              logout();
            }}
            variant="destructive"
            className="hover:scale-105 transition-all duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </section>
      </header>
      <main>
        <nav className="mb-5">
          <ul className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                icon: ShoppingCart,
                label: "Previous Orders",
                href: "/customer/previous-orders",
                bgColor: "bg-blue-500/10",
                iconColor: "text-blue-500",
              },
              {
                icon: User,
                label: "Account Info",
                href: "/customer/account-info",
                bgColor: "bg-green-500/10",
                iconColor: "text-green-500",
              },
              {
                icon: MapPin,
                label: "Address Info",
                href: "/customer/address-info",
                bgColor: "bg-purple-500/10",
                iconColor: "text-purple-500",
              },
              {
                icon: CreditCard,
                label: "Price List",
                href: "/customer/price-list",
                bgColor: "bg-orange-500/10",
                iconColor: "text-orange-500",
              },
              {
                icon: Camera,
                label: "Product Images",
                href: "/customer/product-images",
                bgColor: "bg-pink-500/10",
                iconColor: "text-pink-500",
              },
            ].map(({ icon: Icon, label, href, bgColor, iconColor }) => (
              <li key={label}>
                <Link key={href} href={href}>
                  <div className="group hover:scale-105 transition-all duration-200">
                    <Button
                      variant="ghost"
                      className="w-full h-24 flex flex-col items-center justify-center space-y-2"
                    >
                      <div className={`p-3 rounded-full ${bgColor}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      <span>{label}</span>
                    </Button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <section aria-labelledby="account-overview-title">
          <Card className="mb-8 hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-primary/5">
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 m-5 gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="h-24 hover:bg-primary/5"
                >
                  <Link
                    href={`/customer/order-success/${initialOrderId}`}
                    className="flex flex-col items-center space-y-2"
                  >
                    <FileText className="h-6 w-6 text-primary" />
                    <span>View Recent Order</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-24 hover:bg-primary/5"
                >
                  <Link
                    href="/customer/address-info"
                    className="flex flex-col items-center space-y-2"
                  >
                    <Truck className="h-6 w-6 text-primary" />
                    <span>Manage Addresses</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-24 hover:bg-primary/5"
                >
                  <Link
                    href="/customer/account-info"
                    className="flex flex-col items-center space-y-2"
                  >
                    <Settings className="h-6 w-6 text-primary" />
                    <span>Account Settings</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="h-24 hover:bg-primary/5"
                >
                  <Link
                    href="/customer/shopping/product_categories/summer"
                    className="flex flex-col items-center space-y-2"
                  >
                    <LayoutGrid className="h-6 w-6 text-primary" />
                    <span>Product Catalog</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="order-info-title">
          <Card className="mb-8 overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-warning/10">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 text-warning" /> Order Collection Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center text-lg space-x-2 bg-warning/5 p-4 rounded-lg">
                <Truck className="text-warning h-6 w-6" />
                <span>Orders are to be collected</span>
                <Badge
                  variant="outline"
                  className="font-bold text-warning text-lg px-4"
                >
                  24 hours
                </Badge>
                <span>after payment received.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center p-4 bg-destructive/5 rounded-lg">
                  <Badge variant="secondary" className="mr-2">
                    Note
                  </Badge>
                  <span className="text-muted-foreground">
                    We do not offer a courier service.
                  </span>
                </div>
                <div className="flex items-center p-4 bg-destructive/5 rounded-lg">
                  <Badge variant="secondary" className="mr-2">
                    Note
                  </Badge>
                  <span className="text-muted-foreground">
                    We do not offer any branding.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-12 text-center border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          &copy; 2025 Captivity. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default CustomerLanding;
