// categoriesData.ts
import { DotIcon } from "lucide-react";

export type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

export type Section = {
  label: string;
  items: NavItem[];
};

export const navItems: Section[] = [
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
    label: "Catalog",
    items: [
      {
        href: "/products/catalog/spring-2024",
        icon: DotIcon,
        label: "Spring 2024",
      },
      {
        href: "/products/catalog/fall-2024",
        icon: DotIcon,
        label: "Fall 2024",
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
