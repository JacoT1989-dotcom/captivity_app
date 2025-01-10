"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, DotIcon } from "lucide-react";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

type Section = {
  label: string;
  items: NavItem[];
};

const navItems: Section[] = [
  {
    label: "Headwear",
    items: [
      {
        href: "/products/headwear/new-in-headwear",
        icon: DotIcon,
        label: "New in Headwear",
      },
      {
        href: "/products/headwear/flat-peaks",
        icon: DotIcon,
        label: "Flat Peaks",
      },
      {
        href: "/products/headwear/pre-curved-peaks",
        icon: DotIcon,
        label: "Pre-Curved Peaks",
      },
      {
        href: "/products/headwear/hats",
        icon: DotIcon,
        label: "Hats",
      },
      {
        href: "/products/headwear/multifunctional-headwear",
        icon: DotIcon,
        label: "Multifunctional Headwear",
      },
      {
        href: "/products/headwear/beanies",
        icon: DotIcon,
        label: "Beanies",
      },
      {
        href: "/products/headwear/trucker-caps",
        icon: DotIcon,
        label: "Trucker Caps",
      },
      {
        href: "/products/headwear/bucket-hats",
        icon: DotIcon,
        label: "Bucket Hats",
      },
    ],
  },
  {
    label: "Apparel",
    items: [
      {
        href: "/products/apparel/new-in-apparel",
        icon: DotIcon,
        label: "New in Apparel",
      },
      {
        href: "/products/apparel/men",
        icon: DotIcon,
        label: "Men",
      },
      {
        href: "/products/apparel/women",
        icon: DotIcon,
        label: "Women",
      },
      {
        href: "/products/apparel/kids",
        icon: DotIcon,
        label: "Kids",
      },
      {
        href: "/products/apparel/t-shirts",
        icon: DotIcon,
        label: "T-Shirts",
      },
      {
        href: "/products/apparel/golfers",
        icon: DotIcon,
        label: "Golfers",
      },
      {
        href: "/products/apparel/hoodies",
        icon: DotIcon,
        label: "Hoodies",
      },
      {
        href: "/products/apparel/jackets",
        icon: DotIcon,
        label: "Jackets",
      },
      {
        href: "/products/apparel/bottoms",
        icon: DotIcon,
        label: "Bottoms",
      },
    ],
  },
  {
    label: "All Collections",
    items: [
     {
        href: "/products/all-collections/signature-collection",
        icon: DotIcon,
        label: "Signature Collection",
      },
      {
        href: "/products/all-collections/baseball-collection",
        icon: DotIcon,
        label: "Baseball Collection",
      },
      {
        href: "/products/all-collections/fashion-collection",
        icon: DotIcon,
        label: "Fashion Collection",
      },
      {
        href: "/products/all-collections/leisure-collection",
        icon: DotIcon,
        label: "Leisure Collection",
      },
      {
        href: "/products/all-collections/sport-collection",
        icon: DotIcon,
        label: "Sport Collection",
      },
      {
        href: "/products/all-collections/industrial-collection",
        icon: DotIcon,
        label: "Industrial Collection",
      },
      {
        href: "/products/all-collections/camo-collection",
        icon: DotIcon,
        label: "Camo Collection",
      },
      {
        href: "/products/all-collections/winter-collection",
        icon: DotIcon,
        label: "Winter Collection",
      },
      {
        href: "/products/all-collections/kids-collection",
        icon: DotIcon,
        label: "Kids Collection",
      },
      {
        href: "/products/all-collections/african-collection",
        icon: DotIcon,
        label: "African Collection",
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        href: "/products/catalog/spring-2024",
        icon: DotIcon,
        label: "Spring 2024",
      },
    ],
  },
  {
    label: "Clearance",
    items: [
      {
        href: "/products/clearance/sale-items",
        icon: DotIcon,
        label: "Sale Items",
      },
    ],
  },
];

const CategoriesDropDown = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMouseEnter = (section: string) => {
    setOpenDropdown(section);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname ? pathname.startsWith(item.href) : false;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground"
        )}
      >
        <item.icon className="inline-block mr-2 h-4 w-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="relative flex justify-center w-full">
      <div className="hidden md:flex space-x-4">
        {navItems.map(section => (
          <div
            key={section.label}
            className="relative"
            onMouseEnter={() => handleMouseEnter(section.label)}
            onMouseLeave={handleMouseLeave}
          >
            <Button variant="ghost" className="flex items-center space-x-2">
              <span className="text-sm font-medium">{section.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openDropdown === section.label && "rotate-180"
                )}
              />
            </Button>

            {openDropdown === section.label && (
              <div className="absolute top-full mt-0 w-56  bg-background shadow-lg z-10">
                {section.items.map(subItem => renderNavItem(subItem))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default CategoriesDropDown;
