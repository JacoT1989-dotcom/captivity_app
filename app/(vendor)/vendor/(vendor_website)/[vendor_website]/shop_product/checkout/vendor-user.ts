"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

interface AuthUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
}

export async function getVendorUserDetails() {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };
    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view details",
      };
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        salesRep: true,
        companyName: true,
        country: true,
        streetAddress: true,
        addressLine2: true,
        townCity: true,
        suburb: true,
        postcode: true,
        storeLocation: true,
      },
    });

    if (!userDetails) {
      return {
        success: false,
        message: "User details not found",
        error: "No user details found",
      };
    }

    const shippingData =
      userDetails.storeLocation &&
      typeof userDetails.storeLocation === "object" &&
      (userDetails.storeLocation as any).type === "shipping"
        ? (userDetails.storeLocation as any)
        : null;

    // Get initial province value and log it
    let provinceValue = shippingData?.suburb || userDetails.suburb || "";
    console.log("Initial province value from database:", provinceValue);

    if (provinceValue) {
      // Convert to lowercase for consistent comparison
      const lowercaseProvince = provinceValue.toLowerCase().trim();
      console.log("Lowercase province value:", lowercaseProvince);

      // Map to exact VENDOR_PROVINCES values
      const provinceMapping: Record<string, string> = {
        gauteng: "Gauteng",
        "western cape": "Western Cape",
        westerncape: "Western Cape",
        "kwazulu-natal": "KwaZulu-Natal",
        "kwazulu natal": "KwaZulu-Natal",
        kwazulunatal: "KwaZulu-Natal",
        "eastern cape": "Eastern Cape",
        easterncape: "Eastern Cape",
        "free state": "Free State",
        freestate: "Free State",
        limpopo: "Limpopo",
        mpumalanga: "Mpumalanga",
        "north west": "North West",
        northwest: "North West",
        "northern cape": "Northern Cape",
        northerncape: "Northern Cape",
        // Add abbreviated versions
        wc: "Western Cape",
        gp: "Gauteng",
        kzn: "KwaZulu-Natal",
        ec: "Eastern Cape",
        fs: "Free State",
        lp: "Limpopo",
        mp: "Mpumalanga",
        nw: "North West",
        nc: "Northern Cape",
      };

      provinceValue = provinceMapping[lowercaseProvince] || provinceValue;
      console.log("Final transformed province value:", provinceValue);
    }

    const transformedData = {
      firstName: shippingData?.firstName || userDetails.firstName || "",
      lastName: shippingData?.lastName || userDetails.lastName || "",
      email: shippingData?.email || userDetails.email || "",
      salesRep: userDetails.salesRep || "",
      phone: shippingData?.phoneNumber || userDetails.phoneNumber || "",
      companyName: shippingData?.companyName || userDetails.companyName || "",
      countryRegion: "southAfrica",
      streetAddress:
        shippingData?.streetAddress || userDetails.streetAddress || "",
      apartmentSuite:
        shippingData?.addressLine2 || userDetails.addressLine2 || "",
      townCity: shippingData?.townCity || userDetails.townCity || "",
      province: provinceValue,
      postcode: shippingData?.postcode || userDetails.postcode || "",
      vendorBranch: "",
      methodOfCollection: "",
      referenceNumber: "",
      orderNotes: "",
      agreeTerms: false,
      receiveEmailReviews: false,
      shippingAddress: shippingData,
    };

    console.log("Transformed data being sent to client:", {
      province: transformedData.province,
      countryRegion: transformedData.countryRegion,
    });

    return {
      success: true,
      message: "User details retrieved successfully",
      data: transformedData,
    };
  } catch (error) {
    console.error("Error in getVendorUserDetails:", error);
    return {
      success: false,
      message: "Failed to retrieve user details",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
