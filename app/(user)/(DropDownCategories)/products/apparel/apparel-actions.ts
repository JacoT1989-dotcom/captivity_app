"use server";

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

export async function getAllCategories(): Promise<CategoryActionResult> {
  try {
    const products = (await prisma.product.findMany({
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
          orderBy: {
            from: "asc",
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
    })) as unknown as PrismaProduct[];

    // Log only Activ-T Long Sleeve dynamic pricing
    const activT = products.find(p => p.productName === "Activ-T Long Sleeve");
    if (activT) {
      console.log(
        "Activ-T Long Sleeve Dynamic Pricing:",
        activT.dynamicPricing
      );
    }

    const allCategories = products.flatMap(product => product.category);
    const uniqueCategories = _.uniq(allCategories);

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

    const categoryProducts: Record<string, PrismaProduct[]> = {};
    uniqueCategories.forEach(category => {
      categoryProducts[category] = [];
    });

    products.forEach(product => {
      product.category.forEach(cat => {
        if (categoryProducts[cat]) {
          categoryProducts[cat].push(product);
        }
      });
    });

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
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getProduct(
  productId: string
): Promise<PrismaProduct | null> {
  try {
    const product = (await prisma.product.findUnique({
      where: { id: productId },
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
          orderBy: {
            from: "asc",
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
    })) as unknown as PrismaProduct | null;

    if (product?.productName === "Activ-T Long Sleeve") {
      console.log(
        "Activ-T Long Sleeve Dynamic Pricing:",
        product.dynamicPricing
      );
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function updateDynamicPricing(
  productId: string,
  pricingUpdates: {
    id: string;
    from: string;
    to: string;
    type: string;
    amount: string;
  }[]
): Promise<boolean> {
  try {
    await Promise.all(
      pricingUpdates.map(pricing =>
        prisma.dynamicPricing.update({
          where: {
            id: pricing.id,
            productId: productId,
          },
          data: {
            from: pricing.from,
            to: pricing.to,
            type: pricing.type,
            amount: pricing.amount,
          },
        })
      )
    );

    // Log updated pricing if it's Activ-T Long Sleeve
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        productName: true,
        dynamicPricing: true,
      },
    });

    if (updatedProduct?.productName === "Activ-T Long Sleeve") {
      console.log(
        "Updated Activ-T Long Sleeve Dynamic Pricing:",
        updatedProduct.dynamicPricing
      );
    }

    return true;
  } catch (error) {
    console.error("Error updating dynamic pricing:", error);
    return false;
  }
}
