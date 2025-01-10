// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { fetchProductById } from "./actions";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;

  if (!productId) {
    notFound();
  }

  const result = await fetchProductById(productId);

  if (!result.success) {
    // Handle error cases
    if (result.error === "Unauthorized. Please log in.") {
      // Redirect to login page or show unauthorized message
      return <div>Please log in to view this product.</div>;
    }
    return <div>Error: {result.error}</div>;
  }

  return <ProductDetails product={result.data} />;
}
