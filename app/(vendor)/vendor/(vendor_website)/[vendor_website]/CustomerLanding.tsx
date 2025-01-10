"use client";

import React from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "./_components/Header";
import { useSession } from "@/app/(vendor)/SessionProvider";

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const CustomerLanding = () => {
  const { user } = useSession();
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;

  if (!user) {
    return null;
  }

  const userDisplayName = user.name || user.email || "Guest";

  const navigationItems: NavigationItem[] = [
    {
      icon: ShoppingCart,
      label: "Previous Orders",
      href: `/vendor/${vendorWebsite}/previous-orders`,
    },
    {
      icon: User,
      label: "Account Info",
      href: `/vendor/${vendorWebsite}/account-info`,
    },
    {
      icon: MapPin,
      label: "Address Info",
      href: `/vendor/${vendorWebsite}/address-info`,
    },
  ];

  const quickActions = [
    {
      icon: FileText,
      label: "View Recent Order",
      href: `/vendor/${vendorWebsite}/previous-orders`,
    },
    {
      icon: Truck,
      label: "Manage Addresses",
      href: `/vendor/${vendorWebsite}/address-info`,
    },
    {
      icon: Settings,
      label: "Account Settings",
      href: `/vendor/${vendorWebsite}/account-info`,
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-background">
      <Header />

      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome {userDisplayName}
            </h2>
            <p className="text-muted-foreground">
              Last login: Today at 10:30 AM
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mb-5">
        <ul className="grid grid-cols-2 md:grid md:grid-cols-3 justify-between bg-card shadow-2xl shadow-black rounded-lg p-2">
          {navigationItems.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link href={href}>
                <Button variant="ghost" className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions Card */}
      <Card className="mb-8 shadow-2xl shadow-black">
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map(({ icon: Icon, label, href }) => (
              <Button key={label} variant="outline" asChild>
                <Link href={href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Collection Info Card */}
      <Card className="mb-8 bg-card shadow-2xl shadow-black">
        <CardHeader className="bg-accent">
          <CardTitle className="flex items-center text-accent-foreground">
            <Clock className="mr-2" /> Order Collection Time
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="flex flex-wrap items-center text-lg space-x-2">
            <Truck className="text-green-500" />
            <span>Orders are to be collected</span>
            <Badge variant="outline" className="font-bold text-destructive">
              24 hours
            </Badge>
            <span>after payment received.</span>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                Note
              </Badge>
              <span className="text-muted-foreground">
                We do not offer a courier service.
              </span>
            </div>
            <div className="flex items-center">
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

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerLanding;
