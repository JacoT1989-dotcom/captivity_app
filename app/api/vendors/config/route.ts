// app/api/vendors/config/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const vendors = await prisma.user.findMany({
      where: {
        role: "VENDOR",
        isVendorActive: true,
        customDomain: {
          not: null,
        },
      },
      select: {
        id: true,
        storeSlug: true,
        customDomain: true,
        isVendorActive: true,
        storeName: true,
      },
    });

    const vendorConfigs = vendors.reduce((acc: any, vendor) => {
      if (vendor.storeSlug && vendor.customDomain) {
        const baseDomain = vendor.customDomain
          .replace(/^www\./, "")
          .toLowerCase();
        acc[vendor.storeSlug] = {
          path: vendor.storeSlug,
          domains: [baseDomain, `www.${baseDomain}`],
          isActive: vendor.isVendorActive,
          storeName: vendor.storeName || undefined,
        };
      }
      return acc;
    }, {});

    return NextResponse.json(vendorConfigs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch vendor configurations" },
      { status: 500 }
    );
  }
}
