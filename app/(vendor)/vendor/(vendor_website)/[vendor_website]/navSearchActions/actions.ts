"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function searchVendorProducts(query: string) {
  if (!query) {
    return [];
  }

  // Prepare search terms - split by hyphens and spaces
  const searchTerms = query
    .split(/[-\s]+/)
    .filter(Boolean)
    .map(term => term.trim());

  try {
    const searchResults = await prisma.vendorProduct.findMany({
      where: {
        OR: [
          // Search in product name
          {
            productName: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          // Search for each term in product name
          ...searchTerms.map(term => ({
            productName: {
              contains: term,
              mode: Prisma.QueryMode.insensitive,
            },
          })),
          // Search in description
          {
            description: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          // Search in categories
          {
            category: {
              hasSome: [
                query,
                query.toLowerCase(),
                query.toUpperCase(),
                ...searchTerms,
                ...searchTerms.map(term => term.toLowerCase()),
                ...searchTerms.map(term => term.toUpperCase()),
              ],
            },
          },
          // Search in variations
          {
            variations: {
              some: {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  ...searchTerms.map(term => ({
                    name: {
                      contains: term,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  })),
                  {
                    sku: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    sku2: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              },
            },
          },
        ] as Prisma.VendorProductWhereInput[],
      },
      include: {
        featuredImage: true,
        variations: true,
      },
      take: 10,
    });

    return searchResults;
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Failed to search vendor products");
  }
}
