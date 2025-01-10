"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  navigation,
  settingsNavigation,
  getHref,
  NavigationItem,
} from "./navigation";

export function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const vendorWebsite = params?.vendor_website as string;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (item: NavigationItem) => {
    const href = getHref(item, vendorWebsite);
    return pathname === href;
  };

  const NavigationSection = ({
    title,
    items,
  }: {
    title: string;
    items: NavigationItem[];
  }) => (
    <nav className="space-y-1">
      <p className="px-3 text-xs font-medium text-muted-foreground">{title}</p>
      {items.map(item => {
        const active = isActive(item);
        return (
          <Link
            key={item.name}
            href={getHref(item, vendorWebsite)}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                active ? "text-primary" : "text-muted-foreground"
              )}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0",
          "w-64 shrink-0 border-r bg-background",
          "z-40 lg:z-30",
          "transition-transform duration-300",
          !isMobileOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-16 items-center gap-2 px-4 border-b">
            <div className="h-8 w-8 rounded bg-primary p-1.5">
              <div className="h-full w-full rounded-sm bg-background" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Vendor
            </span>
          </div>

          {/* Navigation with Scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-8 p-4">
              <NavigationSection title="MAIN" items={navigation.main} />
              <NavigationSection
                title="CUSTOMERS"
                items={navigation.customers}
              />
              <NavigationSection title="WEBSITE" items={navigation.website} />

              <div className="mt-auto space-y-2">
                {settingsNavigation.map(item => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.name}
                      href={getHref(item, vendorWebsite)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          active ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
