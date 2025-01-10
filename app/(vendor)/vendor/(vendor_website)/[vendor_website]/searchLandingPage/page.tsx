// app/vendor/[vendor_website]/searchLandingPage/page.tsx
import { searchVendorProducts } from "../navSearchActions/actions";
import { VendorSearchResultsContent } from "./VendorSearchResultsContent";

interface SearchPageProps {
  searchParams: { q: string };
  params: { vendor_website: string };
}

export default async function SearchPage({
  searchParams,
  params,
}: SearchPageProps) {
  const query = searchParams.q;
  const results = await searchVendorProducts(query);
  const vendorWebsite = params.vendor_website;

  return (
    <VendorSearchResultsContent
      results={results}
      query={query}
      vendorWebsite={vendorWebsite}
    />
  );
}
