// app/actions/search.ts
"use server";

import prisma from "@/lib/prisma";

export async function searchProducts(query: string) {
  if (!query) {
    return [];
  }

  try {
    const searchResults = await prisma.product.findMany({
      where: {
        OR: [
          {
            productName: {
              search: query.split(" ").join(" & "),
            },
          },
          {
            description: {
              search: query.split(" ").join(" & "),
            },
          },
          {
            category: {
              hasSome: [query],
            },
          },
          {
            variations: {
              some: {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                  {
                    sku: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },

                  {
                    sku2: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        ],
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
    throw new Error("Failed to search products");
  }
}
