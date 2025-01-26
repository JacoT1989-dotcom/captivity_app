"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getStockLevels(
  page = 1,
  search = "",
  sortOrder: "asc" | "desc" = "asc",
  limit = 10
) {
  const skip = (page - 1) * limit;

  const where: Prisma.VariationWhereInput = search
    ? {
        OR: [
          { sku: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          {
            product: {
              OR: [
                {
                  productName: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                { category: { hasSome: [search] } },
              ],
            },
          },
        ],
      }
    : {};

  const [variations, total] = await Promise.all([
    prisma.variation.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        color: true,
        size: true,
        sku: true,
        quantity: true,
        product: {
          select: {
            productName: true,
            category: true,
          },
        },
      },
      orderBy: {
        quantity: sortOrder,
      },
    }),
    prisma.variation.count({ where }),
  ]);

  return { variations, total, pages: Math.ceil(total / limit) };
}
export async function updateStock(formData: FormData) {
  const variationId = formData.get("variationId") as string;
  const quantity = Math.abs(parseInt(formData.get("quantity") as string));

  await prisma.variation.update({
    where: { id: variationId },
    data: { quantity },
  });

  revalidatePath("/admin/warehouse/stock-levels");
}
