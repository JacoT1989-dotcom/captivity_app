"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import _ from "lodash";
import { Prisma } from "@prisma/client";

type MainCategory =
  | "apparel-collection"
  | "headwear-collection"
  | "fashion-collection"
  | "winter-collection"
  | "summer-collection"
  | "kids-collection"
  | "sport-collection"
  | "leisure-collection"
  | "industrial-collection"
  | "african-collection"
  | "camo-collection";

interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
}

interface PrismaProduct {
  id: string;
  userId: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews: Prisma.JsonValue[];
  dynamicPricing: DynamicPricing[];
  featuredImage?: {
    id: string;
    thumbnail: string;
    medium: string;
    large: string;
    productId: string;
  } | null;
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }[];
}

interface CategoryActionResult {
  success: boolean;
  data?: {
    categories: string[];
    mainCategories: Partial<Record<MainCategory, string[]>>;
    categoryProducts: Record<string, PrismaProduct[]>;
    allProducts: PrismaProduct[];
  };
  error?: string;
}

function isMainCategory(category: string): category is MainCategory {
  const mainCategories: MainCategory[] = [
    "apparel-collection",
    "headwear-collection",
    "fashion-collection",
    "winter-collection",
    "summer-collection",
    "kids-collection",
    "sport-collection",
    "leisure-collection",
    "industrial-collection",
    "african-collection",
    "camo-collection",
  ];
  return mainCategories.includes(category as MainCategory);
}

export const getAllCategories = cache(
  async (): Promise<CategoryActionResult> => {
    try {
      // Fetch all products with their variations, featured images, and dynamic pricing
      const products = await prisma.product.findMany({
        select: {
          id: true,
          userId: true,
          productName: true,
          category: true,
          description: true,
          sellingPrice: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          reviews: true,
          dynamicPricing: {
            select: {
              id: true,
              from: true,
              to: true,
              type: true,
              amount: true,
              productId: true,
            },
          },
          featuredImage: true,
          variations: {
            select: {
              id: true,
              name: true,
              color: true,
              size: true,
              sku: true,
              sku2: true,
              variationImageURL: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      console.log(
        `Found ${products.length} total products with variations and dynamic pricing`
      );

      // Extract and flatten categories
      const allCategories = products.flatMap(product => product.category);
      const uniqueCategories = _.uniq(allCategories);

      // Initialize main categories
      const mainCategories: Record<MainCategory, string[]> = {
        "apparel-collection": [],
        "headwear-collection": [],
        "fashion-collection": [],
        "winter-collection": [],
        "summer-collection": [],
        "kids-collection": [],
        "sport-collection": [],
        "leisure-collection": [],
        "industrial-collection": [],
        "african-collection": [],
        "camo-collection": [],
      };

      // Group products by category
      const categoryProducts: Record<string, PrismaProduct[]> = {};

      // Initialize categoryProducts for all unique categories
      uniqueCategories.forEach(category => {
        categoryProducts[category] = [];
      });

      // Populate categoryProducts
      products.forEach(product => {
        product.category.forEach(cat => {
          if (categoryProducts[cat]) {
            categoryProducts[cat].push(product);
          }
        });
      });

      // Group subcategories under main categories
      uniqueCategories.forEach(category => {
        Object.keys(mainCategories).forEach(mainCategory => {
          if (isMainCategory(mainCategory)) {
            if (
              category.includes(mainCategory) ||
              [
                "men",
                "women",
                "kids",
                "t-shirts",
                "golfers",
                "hoodies",
                "jackets",
                "bottoms",
                "hats",
                "beanies",
                "bucket-hats",
                "pre-curved-peaks",
                "trucker-caps",
              ].includes(category)
            ) {
              mainCategories[mainCategory].push(category);
            }
          }
        });
      });

      // Clean up empty main categories
      const filteredMainCategories = _.pickBy(
        mainCategories,
        arr => arr.length > 0
      ) as Partial<Record<MainCategory, string[]>>;

      return {
        success: true,
        data: {
          categories: uniqueCategories,
          mainCategories: filteredMainCategories,
          categoryProducts,
          allProducts: products,
        },
      };
    } catch (error) {
      console.error("Error fetching categories and products:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
