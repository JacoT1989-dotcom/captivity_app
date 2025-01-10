import Link from "next/link";
import Image from "next/image";
import { searchProducts } from "../navSearchActions/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, PackageSearch } from "lucide-react";
import BackToCustomerPage from "./../_components/BackToCustomerButton";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;
  const results = await searchProducts(query);

  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto max-w-7xl p-6 space-y-6">
        <Card className="border-none shadow-md bg-gradient-to-r from-slate-50 to-slate-100">
          <CardHeader className="flex flex-row items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-2xl font-semibold">
              Results for &quot;{query}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {results.length} items found
            </Badge>
          </CardContent>
        </Card>

        {results.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
              <PackageSearch className="w-12 h-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground text-center">
                No products found matching your search.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map(product => (
              <Link
                href={`/customer/shopping/${product.id}`}
                key={product.id}
                className="block"
              >
                <Card className="group overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <AspectRatio ratio={4 / 3}>
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage.medium}
                          alt={product.productName}
                          fill
                          className="object-cover bg-slate-50"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <PackageSearch className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                    </AspectRatio>
                  </div>
                  <Separator />
                  <CardContent className="p-4">
                    <h2 className="font-semibold text-lg line-clamp-2 group-hover:line-clamp-none transition-all duration-300 mb-2">
                      {product.productName}
                    </h2>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <p className="text-lg font-semibold text-primary">
                      R{product.sellingPrice.toFixed(2)}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
