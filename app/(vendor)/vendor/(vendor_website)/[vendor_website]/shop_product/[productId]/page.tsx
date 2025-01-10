import { notFound } from "next/navigation";
import { fetchVendorProductById } from "./actions";
import VendorProductDetails from "./VendorProductDetails";
import { VendorProductWithRelations, VendorDynamicPricingRule } from "./types";

interface VendorProductPageProps {
  params: {
    productId: string;
    vendor_website: string;
  };
}

// Type guard for pricing type
function isValidPricingType(
  type: string
): type is "fixed_price" | "percentage" {
  return type === "fixed_price" || type === "percentage";
}

// Validate dynamic pricing
function validateDynamicPricing(pricing: any[]): VendorDynamicPricingRule[] {
  return pricing.map(rule => {
    if (!isValidPricingType(rule.type)) {
      throw new Error(`Invalid pricing type: ${rule.type}`);
    }
    return {
      id: rule.id,
      vendorProductId: rule.vendorProductId,
      type: rule.type,
      from: rule.from,
      to: rule.to,
      amount: rule.amount,
    };
  });
}

// Validate product data
function validateProductData(data: any): VendorProductWithRelations {
  return {
    ...data,
    dynamicPricing: validateDynamicPricing(data.dynamicPricing),
    variations: data.variations || [],
    featuredImage: data.featuredImage || null,
  };
}

export default async function VendorProductPage({
  params,
}: VendorProductPageProps) {
  const { productId, vendor_website: vendorWebsite } = params;

  if (!productId || !vendorWebsite) {
    notFound();
  }

  const result = await fetchVendorProductById(productId, vendorWebsite);

  if (!result.success) {
    if (result.error === "Unauthorized. Please log in.") {
      return (
        <div className="flex items-center justify-center min-h-[400px] text-lg">
          Please log in to view this product.
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg text-red-500">
        Error: {result.error}
      </div>
    );
  }

  try {
    const validatedData = validateProductData(result.data);

    return (
      <div className="m-4">
        <VendorProductDetails
          product={validatedData}
          vendorWebsite={vendorWebsite}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg text-red-500">
        Error: Invalid product data format
      </div>
    );
  }
}
