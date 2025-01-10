"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { VendorVariation } from "@prisma/client";
import {
  VendorProductWithRelations,
  VendorProductImageProps,
  VendorDynamicPricingRule,
} from "./types";
import Link from "next/link";
import {
  VendorColorSelector,
  VendorQuantitySelector,
  VendorSizeSelector,
} from "./VendorProductSelectors";
import VendorProductImage from "./VendorProductImage";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import VendorAddToCartButton from "./addToCart";
import { useParams } from "next/navigation";

const transformVendorProductForImage = (
  product: VendorProductWithRelations
): VendorProductImageProps["product"] => ({
  id: product.id,
  productName: product.productName,
  featuredImage: product.featuredImage
    ? {
        thumbnail: product.featuredImage.medium,
        medium: product.featuredImage.medium,
        large: product.featuredImage.medium,
      }
    : null,
  variations: product.variations.map(variation => ({
    id: variation.id,
    color: variation.color,
    variationImageURL: variation.variationImageURL,
  })),
});

type Props = {
  product: VendorProductWithRelations;
  vendorWebsite: string;
};

const VendorProductDetails: React.FC<Props> = ({ product, vendorWebsite }) => {
  // Memoize initial variation
  const initialVariation = useMemo(
    () => product.variations[0] || null,
    [product.variations]
  );

  const [selectedVariation, setSelectedVariation] =
    useState<VendorVariation | null>(initialVariation);
  const [quantity, setQuantity] = useState(1);
  const [recommendedBranding, setRecommendedBranding] = useState<string | null>(
    null
  );

  const params = useParams();

  const calculateDynamicPrice = useCallback(
    (qty: number) => {
      if (!product.dynamicPricing || product.dynamicPricing.length === 0) {
        return product.sellingPrice;
      }

      const applicableRule = product.dynamicPricing.find(
        (rule: VendorDynamicPricingRule) => {
          const from = parseInt(rule.from);
          const to = parseInt(rule.to);
          return qty >= from && qty <= to;
        }
      );

      if (!applicableRule) {
        return product.sellingPrice;
      }

      if (applicableRule.type === "fixed_price") {
        return parseFloat(applicableRule.amount);
      } else {
        const discount = parseFloat(applicableRule.amount) / 100;
        return product.sellingPrice * (1 - discount);
      }
    },
    [product.dynamicPricing, product.sellingPrice]
  );

  // Memoize current price
  const currentPrice = useMemo(
    () => calculateDynamicPrice(quantity),
    [calculateDynamicPrice, quantity]
  );

  // Parse recommended branding from description
  useEffect(() => {
    const match = product.description.match(
      /<strong><em>(.*?)<\/em><\/strong>/
    );
    if (match && match[1]) {
      setRecommendedBranding(match[1]);
    }
  }, [product.description]);

  // Memoize unique colors and sizes
  const uniqueColors = useMemo(
    () => Array.from(new Set(product.variations.map(v => v.color))),
    [product.variations]
  );

  const uniqueSizes = useMemo(
    () => Array.from(new Set(product.variations.map(v => v.size))),
    [product.variations]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedVariation(prev => {
        const newVariation = product.variations.find(
          v => v.color === color && v.size === prev?.size
        );
        return newVariation || prev;
      });
      setQuantity(1);
    },
    [product.variations]
  );

  const handleSizeSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const size = e.target.value;
      setSelectedVariation(prev => {
        const newVariation = product.variations.find(
          v => v.size === size && v.color === prev?.color
        );
        return newVariation || prev;
      });
      setQuantity(1);
    },
    [product.variations]
  );

  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(e.target.value);
      setQuantity(prev =>
        Math.min(newQuantity, selectedVariation?.quantity || 1)
      );
    },
    [selectedVariation]
  );

  const transformedProduct = useMemo(
    () => transformVendorProductForImage(product),
    [product]
  );

  const getDynamicPricingInfo = () => {
    if (!product.dynamicPricing || product.dynamicPricing.length === 0) {
      return null;
    }

    return (
      <div className="mt-2 text-sm text-muted-foreground">
        <p className="font-medium">Bulk Pricing Available:</p>
        {product.dynamicPricing.map((rule, index) => (
          <p key={index}>
            {rule.from}-{rule.to} items:{" "}
            {rule.type === "fixed_price"
              ? `R${parseFloat(rule.amount).toFixed(2)}`
              : `${rule.amount}% off`}
          </p>
        ))}
      </div>
    );
  };

  const renderPricing = () => {
    const isDynamicPrice = currentPrice !== product.sellingPrice;
    const hasMetQuantityThreshold = product.dynamicPricing?.some(
      rule => quantity >= parseInt(rule.from) && quantity <= parseInt(rule.to)
    );

    return (
      <div className="mb-2">
        {isDynamicPrice ? (
          <>
            {hasMetQuantityThreshold ? (
              <>
                <p className="text-sm text-muted-foreground line-through">
                  Original: R{product.sellingPrice.toFixed(2)}
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  R{currentPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-card-foreground">
                  R{product.sellingPrice.toFixed(2)}
                </p>
                <p className="text-sm text-red-500">
                  Bulk Price Available: R{currentPrice.toFixed(2)}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-2xl font-bold text-card-foreground">
            R{currentPrice.toFixed(2)}
          </p>
        )}
        {getDynamicPricingInfo()}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-3 bg-card my-8 shadow-2xl shadow-black rounded-lg border border-border mb-20">
      <div className="flex justify-end mb-4">
        <Link
          href={`/vendor/${vendorWebsite}/shop_product/cart`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          View Cart
        </Link>
      </div>

      <div className="flex flex-col md:flex-row mb-4">
        <VendorProductImage
          selectedVariation={selectedVariation}
          product={transformedProduct}
          uniqueColors={uniqueColors}
          onColorSelect={handleColorSelect}
        />

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-1 text-card-foreground">
            {product.productName}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="mb-4 text-muted-foreground"
          />
          {renderPricing()}

          <VendorColorSelector
            colors={uniqueColors}
            selectedColor={selectedVariation?.color}
            variations={product.variations}
            onColorSelect={handleColorSelect}
            productName={product.productName}
          />

          <VendorSizeSelector
            sizes={uniqueSizes}
            selectedSize={selectedVariation?.size}
            onSizeSelect={handleSizeSelect}
          />

          <VendorQuantitySelector
            quantity={quantity}
            maxQuantity={selectedVariation?.quantity || 1}
            onQuantityChange={handleQuantityChange}
          />

          <p className="mb-4 text-muted-foreground">
            {selectedVariation?.quantity || 0} in stock
          </p>

          <div className="space-y-2">
            <VendorAddToCartButton
              selectedVariation={selectedVariation}
              quantity={quantity}
              disabled={!selectedVariation || quantity < 1}
              className="h-12 bg-primary hover:bg-primary/90"
            />

            <Button asChild variant="destructive" className="w-full h-12">
              <Link href={`/vendor/${vendorWebsite}/shop_product/checkout`}>
                Checkout
              </Link>
            </Button>

            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Product Information</h3>
              <p className="text-sm text-muted-foreground">
                SKU: {selectedVariation?.sku || "N/A"}
              </p>
              {selectedVariation?.sku2 && (
                <p className="text-sm text-muted-foreground">
                  SKU 2: {selectedVariation.sku2}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Last Updated: {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProductDetails;
