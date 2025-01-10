"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ProductWithFeaturedImage } from "./ProductTypes";
import { Variation } from "@prisma/client";
import { fetchProductById } from "./actions";
import { useParams } from "next/navigation";
import RelatedProducts from "@/app/(user)/_components/RelatedProducts";
import Link from "next/link";
import ZoomImage from "@/app/(user)/_components/ZoomImage";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = params?.productid as string;

  const [product, setProduct] = useState<ProductWithFeaturedImage | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const result = await fetchProductById(id);
          if (result.success && result.data) {
            setProduct(result.data);
            setMainImage(result.data.featuredImage?.large || "");
            if (result.data.variations.length > 0) {
              setSelectedColor(result.data.variations[0].color);
              setSelectedSize(result.data.variations[0].size);
            }
          } else {
            setError(result.error || "Failed to fetch product");
          }
        } catch (err) {
          setError("An unexpected error occurred while fetching the product.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const variation = product.variations.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariation(variation || null);
      if (variation) {
        setMainImage(variation.variationImageURL);
      }
    }
  }, [product, selectedColor, selectedSize]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variation = product?.variations.find(v => v.color === color);
    if (variation) {
      setSelectedSize(variation.size);
      setMainImage(variation.variationImageURL);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(Math.min(newQuantity, selectedVariation?.quantity || 1));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const availableColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );
  const availableSizes = Array.from(
    new Set(product.variations.map(v => v.size))
  );

  // Create an array of unique thumbnail images
  const uniqueThumbnails = Array.from(
    new Set(product.variations.map(v => v.variationImageURL))
  );

  return (
    <div className="container mx-auto my-8 gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square lg:aspect-[4/3] xl:aspect-square max-w-[500px] mx-auto">
            <ZoomImage
              src={mainImage || "/captivityIcon.png"}
              alt={product.productName}
              className="w-full h-full"
            />
          </div>
          <div className="flex justify-center items-center">
            <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
              {uniqueThumbnails.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(imageUrl)}
                  className="relative h-16 w-16 flex-shrink-0"
                >
                  <Image
                    src={imageUrl}
                    alt={`${product.productName} - Variation ${index + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-md"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                    priority
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h1 className="flex w-auto mr-10 text-3xl font-bold mb-4 text-red-500">
            {product.productName}
          </h1>
          {/* <p className="text-2xl font-semibold mb-4">
            R{product.sellingPrice.toFixed(2)}
          </p> */}

          <div className="mb-4">
            <label className="block mb-2">Color:</label>
            <Select
              value={selectedColor || ""}
              onValueChange={handleColorChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {availableColors.map(color => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Size:</label>
            <Select value={selectedSize || ""} onValueChange={handleSizeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map(size => {
                  const variation = product.variations.find(
                    v => v.size === size && v.color === selectedColor
                  );
                  return (
                    <SelectItem key={size} value={size}>
                      {size} -{" "}
                      {variation
                        ? `In stock: ${variation.quantity}`
                        : "Out of stock"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Quantity:</label>
            <Input
              type="number"
              min="1"
              max={selectedVariation?.quantity || 1}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full"
              placeholder="0"
            />
          </div>

          {selectedVariation && (
            <div className="mb-4">
              <p>
                {selectedVariation.quantity > 0
                  ? `In stock: ${selectedVariation.quantity}`
                  : "Out of stock"}
              </p>
            </div>
          )}
          <Link href="/login">
            <Button
              className="w-full mb-4"
              disabled={
                !selectedVariation ||
                selectedVariation.quantity === 0 ||
                quantity > selectedVariation.quantity
              }
            >
              {selectedVariation && selectedVariation.quantity > 0
                ? "Login"
                : "Out of Stock"}
            </Button>
          </Link>
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </TabsContent>
            <TabsContent value="features">
              <ul className="list-disc pl-5">
                <li>Carton box size</li>
                <li>Carton box size</li>
                <li>Carton box size</li>
                <li>Carton box size</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
