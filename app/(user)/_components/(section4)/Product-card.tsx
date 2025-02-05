import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import type { ProductCardProps } from "./types";

export function ProductCard({
  id,
  image,
  title,
  price,
  salePrice,
  rating = 0,
  isEditor = false,
  onEdit,
  onRemove,
}: ProductCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden border-none shadow-none">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isEditor && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {onRemove && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {/* <div className="flex items-center gap-2">
            {salePrice ? (
              <>
                <span className="text-sm font-medium text-red-600">
                  R{salePrice}
                </span>
                <span className="text-sm text-gray-500 line-through decoration-gray-500">
                  R{price}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium">R{price}</span>
            )}
          </div> */}
          <div className="flex">
            <span className="text-yellow-400">★★★★★</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
