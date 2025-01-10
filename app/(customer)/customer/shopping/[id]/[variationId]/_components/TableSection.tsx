import Image from "next/image";
import { TableProps } from "../_types/variations";

export const TableSection = ({ data, filteredVariations }: TableProps) => {
  return (
    <div className="bg-card rounded-lg shadow-2xl shadow-black overflow-hidden">
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Color
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Size
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Image
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredVariations.map(variation => (
              <tr
                key={variation.id}
                className={`group transition-colors ${
                  variation.id === data.id
                    ? "bg-accent/50"
                    : "hover:bg-accent/10"
                }`}
              >
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.color}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.sku2}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.size}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.sku}
                </td>
                <td className="px-6 py-4">
                  <div className="h-12 w-12 relative rounded-md overflow-hidden">
                    <Image
                      src={variation.variationImageURL}
                      alt={`${variation.color} ${variation.size}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden divide-y divide-border">
        {filteredVariations.map(variation => (
          <div
            key={variation.id}
            className={`p-6 ${
              variation.id === data.id ? "bg-accent/50" : "bg-card"
            }`}
          >
            {/* Centered Image */}
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40 bg-white rounded-lg shadow-md">
                <Image
                  src={variation.variationImageURL}
                  alt={`${variation.color} ${variation.size}`}
                  fill
                  className="object-contain p-2"
                  sizes="160px"
                  priority={variation.id === data.id}
                />
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3">
              {/* Color */}
              <div className="pb-2 border-b border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  COLOR
                </span>
                <p className="mt-1 text-base text-card-foreground">
                  {variation.color}
                </p>
              </div>

              {/* Size */}
              <div className="pb-2 border-b border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  SIZE
                </span>
                <p className="mt-1 text-base text-card-foreground">
                  {variation.size}
                </p>
              </div>

              {/* Code */}
              <div className="pb-2 border-b border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  CODE
                </span>
                <p className="mt-1 text-base text-card-foreground">
                  {variation.sku2}
                </p>
              </div>

              {/* Stock */}
              <div className="pb-2 border-b border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  STOCK
                </span>
                <p className="mt-1 text-base text-card-foreground">
                  {variation.quantity}
                </p>
              </div>

              {/* SKU */}
              <div className="pb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  SKU
                </span>
                <p className="mt-1 text-base text-card-foreground break-words">
                  {variation.sku}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSection;
