"use client";

import * as React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabNavigation } from "./TabNavigation";
import { ProductSlider } from "./ProductSlider";
import type { Product, HighlightedProduct } from "./types";
import { useHighlightedProductsData } from "@/app/(editor)/_editor-store/highlighted-products-store";
import { useSession } from "@/app/SessionProvider";
import { BestSellerFormModal } from "./_components/(best_sellers)/BestSellerFormModal";
import { BestSellerEditModal } from "./_components/(best_sellers)/BestSellerEditModal";
import { NewArrivalFormModal } from "./_components/(new_arrivals)/NewArrivalFormModal";
import { NewArrivalEditModal } from "./_components/(new_arrivals)/NewArrivalEditModal";

const MAX_PRODUCTS = 8;
const DESKTOP_SLIDES_PER_VIEW = 4;
const MOBILE_SLIDES_PER_VIEW = 2;

// Static products for the "On Sale" tab
const staticProducts: Record<string, Product[]> = {
  "on-sale": [
    {
      id: 9,
      title: "Summer Dress",
      price: 79.99,
      salePrice: 59.99,
      image: "/placeholder.png?height=600&width=400",
      rating: 4,
    },
    // Add more static products as needed
  ],
};

export function ProductTabs() {
  const session = useSession();
  const isEditor = session?.user?.role === "EDITOR";
  const [activeTab, setActiveTab] = React.useState("new-arrivals");
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [editingProduct, setEditingProduct] =
    React.useState<HighlightedProduct | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const slidesPerView = isMobile
    ? MOBILE_SLIDES_PER_VIEW
    : DESKTOP_SLIDES_PER_VIEW;

  const {
    newArrivals,
    bestSellers,
    isLoading,
    error,
    uploadNewArrival,
    updateNewArrival,
    removeNewArrival,
    uploadBestSeller,
    updateBestSeller,
    removeBestSeller,
  } = useHighlightedProductsData();

  const handleNextSlide = React.useCallback(() => {
    setCurrentSlide(prev => {
      const totalProducts =
        activeTab === "new-arrivals"
          ? newArrivals.length
          : activeTab === "best-sellers"
            ? bestSellers.length
            : MAX_PRODUCTS;

      const maxSlideIndex =
        Math.ceil(Math.max(totalProducts, MAX_PRODUCTS) / slidesPerView) - 1;
      return Math.min(prev + 1, maxSlideIndex);
    });
  }, [activeTab, newArrivals.length, bestSellers.length, slidesPerView]);

  const handlePrevSlide = React.useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  // Reset slide when changing tabs or screen size
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab, isMobile]);

  const handleAddNew = React.useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleUploadComplete = React.useCallback(
    async (formData: FormData) => {
      try {
        if (activeTab === "new-arrivals") {
          await uploadNewArrival(formData);
        } else if (activeTab === "best-sellers") {
          await uploadBestSeller(formData);
        }
        setShowAddForm(false);

        // If we're on the first slide and it's full, move to the next slide
        const products =
          activeTab === "new-arrivals" ? newArrivals : bestSellers;
        if (currentSlide === 0 && products.length >= slidesPerView) {
          handleNextSlide();
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [
      activeTab,
      uploadNewArrival,
      uploadBestSeller,
      newArrivals,
      bestSellers,
      currentSlide,
      slidesPerView,
      handleNextSlide,
    ]
  );

  const handleUpdate = React.useCallback(
    async (id: string, formData: FormData) => {
      try {
        if (activeTab === "new-arrivals") {
          await updateNewArrival(id, formData);
        } else if (activeTab === "best-sellers") {
          await updateBestSeller(id, formData);
        }
        setEditingProduct(null);
      } catch (error) {
        console.error("Update error:", error);
      }
    },
    [activeTab, updateNewArrival, updateBestSeller]
  );

  const handleRemove = React.useCallback(
    async (id: string) => {
      try {
        if (activeTab === "new-arrivals") {
          await removeNewArrival(id);
        } else if (activeTab === "best-sellers") {
          await removeBestSeller(id);
        }

        // If current slide is empty after removal, go back one slide
        const products =
          activeTab === "new-arrivals" ? newArrivals : bestSellers;
        const productsInCurrentSlide = products.slice(
          currentSlide * slidesPerView,
          (currentSlide + 1) * slidesPerView
        );

        if (productsInCurrentSlide.length === 1 && currentSlide > 0) {
          handlePrevSlide();
        }
      } catch (error) {
        console.error("Remove error:", error);
      }
    },
    [
      activeTab,
      removeNewArrival,
      removeBestSeller,
      newArrivals,
      bestSellers,
      currentSlide,
      slidesPerView,
      handlePrevSlide,
    ]
  );

  if (isLoading) {
    return (
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            GOTTA HAVE IT
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: slidesPerView }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            Error loading products: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
          GOTTA HAVE IT
        </h2>
        <Tabs
          defaultValue="new-arrivals"
          className="w-full"
          onValueChange={value => {
            setActiveTab(value);
            setCurrentSlide(0);
          }}
        >
          <TabNavigation activeTab={activeTab} />

          {["new-arrivals", "best-sellers", "on-sale"].map(key => (
            <TabsContent key={key} value={key} className="relative">
              <ProductSlider
                products={
                  key === "new-arrivals"
                    ? newArrivals
                    : key === "best-sellers"
                      ? bestSellers
                      : staticProducts[key] || []
                }
                currentSlide={currentSlide}
                slidesPerView={slidesPerView}
                onNext={handleNextSlide}
                onPrev={handlePrevSlide}
                onEdit={
                  isEditor && key !== "on-sale"
                    ? product =>
                        setEditingProduct(product as HighlightedProduct)
                    : undefined
                }
                onRemove={
                  isEditor && key !== "on-sale" ? handleRemove : undefined
                }
                onAddNew={
                  isEditor && key !== "on-sale" ? handleAddNew : undefined
                }
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Add new product modals */}
        {isEditor && showAddForm && (
          <>
            {activeTab === "new-arrivals" ? (
              <NewArrivalFormModal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSubmit={handleUploadComplete}
                error={error}
              />
            ) : activeTab === "best-sellers" ? (
              <BestSellerFormModal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSubmit={handleUploadComplete}
                error={error}
              />
            ) : null}
          </>
        )}

        {/* Edit product modals */}
        {isEditor && editingProduct && (
          <>
            {activeTab === "new-arrivals" ? (
              <NewArrivalEditModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
                onUpdate={handleUpdate}
              />
            ) : activeTab === "best-sellers" ? (
              <BestSellerEditModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
                onUpdate={handleUpdate}
              />
            ) : null}
          </>
        )}
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="h-px bg-gray-200" />
      </div>
    </section>
  );
}
