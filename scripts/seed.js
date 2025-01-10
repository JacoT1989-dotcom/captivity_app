import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch"; // Ensure you have installed node-fetch

const prisma = new PrismaClient();

async function main() {
  try {
    // Fetch the product data from the API
    const response = await fetch(
      "https://www.captivity.co.za/wp-json/OrderCtrl/v4/products"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const products = await response.json(); // Parse the JSON response

    for (const product of products) {
      // Check if the required fields are present
      if (!product.id || !product.product_name) {
        console.warn(
          `Skipping product with ID ${product.id} due to missing required fields.`
        );
        continue;
      }

      await prisma.product.create({
        data: {
          id: String(product.id), // Convert id to string
          userId: "jxflcpdmwi56c2md", // Ensure this is a valid user ID
          productName: product.product_name,
          category: product.category,
          description: product.description,
          sellingPrice: product.selling_price,
          isPublished: true, // Set to false by default
          dynamicPricing: {
            create: product.dynamic_pricing.map(pricing => ({
              from: pricing.from,
              to: pricing.to,
              type: pricing.type,
              amount: pricing.amount,
            })),
          },
          variations: {
            create: product.variations.map(variation => ({
              name: variation.name,
              color: variation.color,
              size: variation.size,
              sku: variation.sku,
              sku2: variation.sku2,
              variationImageURL: variation.variation_image_URL,
              quantity: variation.quantity,
            })),
          },
          featuredImage: product.featured_image
            ? {
                create: {
                  thumbnail: product.featured_image.thumbnail,
                  medium: product.featured_image.medium,
                  large: product.featured_image.large,
                },
              }
            : undefined,
          createdAt: new Date(), // Set the creation date
          updatedAt: new Date(), // Set the update date
        },
      });
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
