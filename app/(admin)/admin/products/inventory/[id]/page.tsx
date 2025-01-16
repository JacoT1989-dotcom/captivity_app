import { notFound } from "next/navigation";
import { getProductDetails } from "./action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await getProductDetails(params.id);

    if (!product) {
      return notFound();
    }

    return (
      <div className="container mx-auto py-8">
        <Link href="/admin/products/inventory">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{product.productName}</CardTitle>
            <CardDescription>
              {product.variations.map(v => v.sku).join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Category
                </h3>
                <p>{product.category.join(", ")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Price
                </h3>
                <p>R{product.sellingPrice.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <p>{product.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
                <p>{product.isPublished ? "Published" : "Draft"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Variations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.variations.map(variation => (
                  <Card key={variation.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Name:</span>{" "}
                          {variation.name}
                        </div>
                        <div>
                          <span className="font-medium">Color:</span>{" "}
                          {variation.color}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span>{" "}
                          {variation.size}
                        </div>
                        <div>
                          <span className="font-medium">SKU:</span>{" "}
                          {variation.sku}
                        </div>
                        <div>
                          <span className="font-medium">Stock:</span>{" "}
                          <span
                            className={
                              variation.quantity <= 10
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {variation.quantity} units
                            {variation.quantity <= 10 && " (Low Stock)"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error in product details page:", error);
    return notFound();
  }
}
