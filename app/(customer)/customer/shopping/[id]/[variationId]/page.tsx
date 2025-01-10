import React from "react";
import { notFound } from "next/navigation";
import { fetchVariationById } from "./actions";
import VariationDetails from "./VariationDetails";

interface PageProps {
  params: {
    variationId: string;
  };
}

async function VariationPage({ params }: PageProps) {
  // Changed to use fetchVariationById instead of fetchProductAndVariation
  const result = await fetchVariationById(params.variationId);

  if (!result.success) {
    notFound();
  }

  return <VariationDetails data={result.data} />;
}

export default VariationPage;
