"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { RiStarSFill } from "react-icons/ri";
import { useParams } from "next/navigation";
import { useSession } from "@/app/(vendor)/SessionProvider";
import {
  useBestSellers,
  useBestSellerLoading,
  useBestSellerError,
  useBestSellerData,
} from "../_store/BestSellerStore";

interface BestSellerItem {
  url: string;
  productName: string;
}

interface EmptyBlockProps {
  index: number;
  productName: string;
  onProductNameChange: (index: number, name: string) => void;
  onFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

interface FilledBlockProps {
  bestSeller: BestSellerItem;
  isVendor: boolean;
  onRemove: (url: string) => void;
}

const StarRating = memo(() => (
  <div className="rating flex justify-center">
    {[...Array(5)].map((_, i) => (
      <RiStarSFill key={i} className="my-3 text-yellow-400 text-2xl" />
    ))}
  </div>
));

StarRating.displayName = "StarRating";

const EmptyBlock = memo(
  ({
    index,
    productName,
    onProductNameChange,
    onFileSelect,
    fileInputRef,
  }: EmptyBlockProps) => {
    const handleUploadClick = useCallback(() => {
      if (fileInputRef?.current && productName.trim()) {
        fileInputRef.current.click();
      }
    }, [fileInputRef, productName]);

    return (
      <>
        <div
          className="aspect-square relative flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-t-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => onFileSelect(e, index)}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3 px-4">
            <div className="p-2 rounded-full bg-gray-100">
              <Plus
                size={20}
                className={`${productName.trim() ? "text-gray-500" : "text-gray-300"}`}
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">
                Best seller slot ({index + 1}/4)
              </p>
              <p className="text-[11px] text-gray-400">
                {productName.trim()
                  ? "Click to upload image (300 x 300px)"
                  : "⚠️ Enter product name below first"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Image Dimensions: width=300 x height=300
              </p>
            </div>
          </div>
        </div>
        <div className="card-body bg-gray-300 rounded-b p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter product name*"
              value={productName}
              onChange={e => onProductNameChange(index, e.target.value)}
              className="w-full p-2 mb-2 rounded border border-gray-400 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {!productName.trim() && (
              <div className="absolute -top-2 right-2 transform translate-y-[-50%]">
                <span className="text-[10px] text-red-500 bg-white px-1">
                  Required
                </span>
              </div>
            )}
          </div>
          <StarRating />
        </div>
      </>
    );
  }
);

EmptyBlock.displayName = "EmptyBlock";

const FilledBlock = memo(
  ({ bestSeller, isVendor, onRemove }: FilledBlockProps) => (
    <>
      <figure className="aspect-square relative">
        <Image
          src={bestSeller.url}
          alt={bestSeller.productName}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover rounded-t-md"
          priority
        />
        {isVendor && (
          <button
            onClick={() => onRemove(bestSeller.url)}
            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full 
                   opacity-0 group-hover:opacity-100 transition-opacity
                   hover:bg-white hover:text-red-500 z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </figure>
      <div className="card-body bg-gray-300 rounded-b p-4">
        <h2 className="text-center font-semibold text-gray-800 mb-2 line-clamp-1 hover:line-clamp-none transition-all duration-200 cursor-pointer">
          {bestSeller.productName}
        </h2>
        <StarRating />
      </div>
    </>
  )
);

FilledBlock.displayName = "FilledBlock";

const BestSellerGrid = memo(() => {
  const params = useParams();
  const vendorSlug =
    typeof params?.vendor_website === "string"
      ? params.vendor_website
      : undefined;

  const {
    bestSellers,
    upload: uploadBestSeller,
    remove: removeBestSeller,
  } = useBestSellerData(vendorSlug);

  const { user } = useSession();
  const isVendor = user?.role === "VENDOR";

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const fileInputRefs = useMemo(() => [ref1, ref2, ref3, ref4], []);

  const [productNames, setProductNames] = useState<string[]>(["", "", "", ""]);

  // Reset product names when vendor changes
  useEffect(() => {
    setProductNames(["", "", "", ""]);
  }, [vendorSlug]);

  const handleProductNameChange = useCallback((index: number, name: string) => {
    setProductNames(prev => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (!isVendor) return;

      const file = event.target.files?.[0];
      if (!file) return;

      if (bestSellers.length >= 4) {
        alert("Maximum 4 best seller images allowed");
        return;
      }

      const productName = productNames[index].trim();
      if (!productName) {
        alert("Please enter a product name first");
        return;
      }

      const formData = new FormData();
      formData.append("bestSeller", file);
      formData.append("productName", productName);

      try {
        await uploadBestSeller(formData);

        if (fileInputRefs[index]?.current) {
          fileInputRefs[index].current.value = "";
        }

        setProductNames(prev => {
          const newNames = [...prev];
          newNames[index] = "";
          return newNames;
        });
      } catch (error) {
        console.error("Error uploading best seller:", error);
      }
    },
    [
      isVendor,
      bestSellers.length,
      productNames,
      uploadBestSeller,
      fileInputRefs,
    ]
  );

  const handleRemoveBestSeller = useCallback(
    async (url: string) => {
      if (!isVendor) return;

      if (
        window.confirm(
          "Are you sure you want to remove this best seller image?"
        )
      ) {
        try {
          await removeBestSeller(url);
        } catch (error) {
          console.error("Error removing best seller:", error);
        }
      }
    },
    [isVendor, removeBestSeller]
  );

  const renderBlock = useCallback(
    (index: number) => {
      const bestSeller = bestSellers[index];
      const isEmpty = !bestSeller;

      return (
        <div key={index} className="py-3">
          <div className="card card-compact rounded-md object-cover w-90 relative group shadow-black shadow-2xl">
            {isEmpty && isVendor ? (
              <EmptyBlock
                index={index}
                productName={productNames[index]}
                onProductNameChange={handleProductNameChange}
                onFileSelect={handleFileSelect}
                fileInputRef={fileInputRefs[index]}
              />
            ) : (
              bestSeller && (
                <FilledBlock
                  bestSeller={bestSeller}
                  isVendor={isVendor}
                  onRemove={handleRemoveBestSeller}
                />
              )
            )}
          </div>
        </div>
      );
    },
    [
      bestSellers,
      isVendor,
      productNames,
      handleProductNameChange,
      handleFileSelect,
      handleRemoveBestSeller,
      fileInputRefs,
    ]
  );

  return (
    <div className="lg:ml-11 lg:mr-12 px-12 mb-4 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-1 grid-cols-2 sm:gap-4 gap-2 justify-center items-center">
      {[0, 1, 2, 3].map(renderBlock)}
    </div>
  );
});

BestSellerGrid.displayName = "BestSellerGrid";

const isVendorUser = (user: any): user is { role: "VENDOR" } => {
  return user?.role === "VENDOR";
};

export default function BestSeller() {
  const { user } = useSession();
  const params = useParams();
  const vendorSlug =
    typeof params?.vendor_website === "string"
      ? params.vendor_website
      : undefined;

  const isVendor = isVendorUser(user);

  const { isLoading, error } = useBestSellerData(
    user?.role === "VENDORCUSTOMER" ? vendorSlug : undefined
  );

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="max-container max-sm:mt-12">
        <div className="flex flex-col justify-center gap-2 mb-1">
          <h2 className="text-3xl sm:text-2xl md:text-2xl lg:text-3xl flex items-center justify-center text-red-600 font-semibold">
            BEST SELLERS
          </h2>
        </div>

        <BestSellerGrid />

        {isVendor && error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}
