"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

type VendorCustomerResponse = {
  success: boolean;
  message: string;
  data?: Partial<User>[];
  error?: string;
};

export async function fetchVendorCustomers(): Promise<VendorCustomerResponse> {
  try {
    const { user } = await validateRequest();

    // Check if user is authenticated and is a vendor
    if (!user || user.role !== "VENDOR") {
      throw new Error("Unauthorized. Only vendors can access customer list.");
    }

    // Get vendor's store slug
    const vendorDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: { storeSlug: true },
    });

    if (!vendorDetails?.storeSlug) {
      throw new Error("Vendor store configuration not found.");
    }

    // Fetch all customers associated with this vendor
    const vendorCustomers = await prisma.user.findMany({
      where: {
        storeSlug: {
          startsWith: `${vendorDetails.storeSlug}-customer-`,
        },
        role: "VENDORCUSTOMER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        phoneNumber: true,
        streetAddress: true,
        townCity: true,
        country: true,
        createdAt: true,
        storeSlug: true,
        // Add any other fields you want to return
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!vendorCustomers.length) {
      return {
        success: true,
        message: "No customers found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Customers retrieved successfully",
      data: vendorCustomers,
    };
  } catch (error) {
    console.error("Error fetching vendor customers:", error);
    return {
      success: false,
      message: "Failed to retrieve customers",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Optional: Add a function to fetch a single vendor customer by ID
export async function fetchVendorCustomerById(
  customerId: string
): Promise<VendorCustomerResponse> {
  try {
    const { user } = await validateRequest();

    // Check if user is authenticated and is a vendor
    if (!user || user.role !== "VENDOR") {
      throw new Error(
        "Unauthorized. Only vendors can access customer details."
      );
    }

    // Get vendor's store slug
    const vendorDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: { storeSlug: true },
    });

    if (!vendorDetails?.storeSlug) {
      throw new Error("Vendor store configuration not found.");
    }

    // Fetch specific customer and verify they belong to this vendor
    const customer = await prisma.user.findFirst({
      where: {
        id: customerId,
        storeSlug: {
          startsWith: `${vendorDetails.storeSlug}-customer-`,
        },
        role: "VENDORCUSTOMER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        phoneNumber: true,
        streetAddress: true,
        townCity: true,
        country: true,
        createdAt: true,
        storeSlug: true,
        // Add any other fields you want to return
      },
    });

    if (!customer) {
      throw new Error("Customer not found or doesn't belong to your store.");
    }

    return {
      success: true,
      message: "Customer retrieved successfully",
      data: [customer],
    };
  } catch (error) {
    console.error("Error fetching vendor customer:", error);
    return {
      success: false,
      message: "Failed to retrieve customer",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
