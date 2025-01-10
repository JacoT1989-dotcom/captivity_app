// app/(vendor)/_components/navigation.ts
import {
  Settings,
  HelpCircle,
  LayoutDashboard,
  ShoppingBag,
  Users,
  ClipboardList,
  PlusCircle,
  Globe,
  BarChart,
  FileText,
  Store,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string | ((vendorWebsite: string) => string);
  icon: LucideIcon;
  current?: boolean;
}

interface Navigation {
  main: NavigationItem[];
  customers: NavigationItem[];
  website: NavigationItem[];
}

export const navigation: Navigation = {
  main: [
    {
      name: "Dashboard",
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard`,
      icon: LayoutDashboard,
      current: true,
    },
    {
      name: "Orders",
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/orders`,
      icon: ClipboardList,
    },
    {
      name: "Products",
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/products`,
      icon: ShoppingBag,
    },
    {
      name: "Add Product",
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/add-product`,
      icon: PlusCircle,
    },
    {
      name: "Users",
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/users`,
      icon: Users,
    },
    {
      name: "My Website",
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/welcome`,
      icon: Globe,
    },
  ],
  customers: [
    { 
      name: "Analytics", 
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/analytics`, 
      icon: BarChart 
    },
    { 
      name: "Reports", 
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/reports`, 
      icon: FileText 
    },
    { 
      name: "Store Settings", 
      href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/store-settings`, 
      icon: Store 
    },
  ],
  website: [],  // Moved website-related items to main navigation
};

export const settingsNavigation: NavigationItem[] = [
  {
    name: "Settings",
    href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/settings`,
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: (vendorWebsite: string) => `/vendor/${vendorWebsite}/dashboard/support`,
    icon: HelpCircle,
  },
];

export const getHref = (
  item: NavigationItem,
  vendorWebsite?: string
): string => {
  if (typeof item.href === "function" && vendorWebsite) {
    return item.href(vendorWebsite);
  }
  return item.href as string;
};