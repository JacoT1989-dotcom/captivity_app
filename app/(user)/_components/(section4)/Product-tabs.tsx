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
const SLIDES_PER_VIEW = 4;

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
  ],
};

export function ProductTabs() {
  const session = useSession();
  const isEditor = session?.user?.role === "EDITOR";
  const [activeTab, setActiveTab] = React.useState("new-arrivals");
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [editingProduct, setEditingProduct] =
    React.useState<HighlightedProduct | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

  const {
    newArrivals,
    bestSellers,
    isLoading: productsLoading,
    uploadNewArrival,
    updateNewArrival,
    removeNewArrival,
    uploadBestSeller,
    updateBestSeller,
    removeBestSeller,
  } = useHighlightedProductsData();

  const handleNextSlide = React.useCallback(() => {
    setCurrentSlide(prev => {
      const totalSlots = MAX_PRODUCTS;
      const maxSlides = Math.ceil(totalSlots / SLIDES_PER_VIEW) - 1;
      // Allow sliding if there are empty slots available
      const currentProducts =
        activeTab === "new-arrivals" ? newArrivals.length : bestSellers.length;
      if (currentProducts < MAX_PRODUCTS || prev < maxSlides) {
        return Math.min(prev + 1, maxSlides);
      }
      return prev;
    });
  }, [activeTab, newArrivals.length, bestSellers.length]);

  const handlePrevSlide = React.useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  // Reset slide when changing tabs
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

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
        if (currentSlide === 0 && products.length >= SLIDES_PER_VIEW) {
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
          currentSlide * SLIDES_PER_VIEW,
          (currentSlide + 1) * SLIDES_PER_VIEW
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
      handlePrevSlide,
    ]
  );

  const renderTabContent = (tabKey: string) => {
    if (tabKey === "new-arrivals" || tabKey === "best-sellers") {
      const products = tabKey === "new-arrivals" ? newArrivals : bestSellers;

      return (
        <>
          <ProductSlider
            products={products}
            currentSlide={currentSlide}
            slidesPerView={SLIDES_PER_VIEW}
            onNext={handleNextSlide}
            onPrev={handlePrevSlide}
            onEdit={
              isEditor
                ? product => setEditingProduct(product as HighlightedProduct)
                : undefined
            }
            onRemove={isEditor ? handleRemove : undefined}
            onAddNew={isEditor ? handleAddNew : undefined}
          />

          {isEditor && showAddForm && (
            <>
              {tabKey === "new-arrivals" ? (
                <NewArrivalFormModal
                  isOpen={showAddForm}
                  onClose={() => setShowAddForm(false)}
                  onSubmit={handleUploadComplete}
                />
              ) : (
                <BestSellerFormModal
                  isOpen={showAddForm}
                  onClose={() => setShowAddForm(false)}
                  onSubmit={handleUploadComplete}
                />
              )}
            </>
          )}

          {isEditor && editingProduct && (
            <>
              {tabKey === "new-arrivals" ? (
                <NewArrivalEditModal
                  isOpen={!!editingProduct}
                  onClose={() => setEditingProduct(null)}
                  product={editingProduct}
                  onUpdate={handleUpdate}
                />
              ) : (
                <BestSellerEditModal
                  isOpen={!!editingProduct}
                  onClose={() => setEditingProduct(null)}
                  product={editingProduct}
                  onUpdate={handleUpdate}
                />
              )}
            </>
          )}
        </>
      );
    }

    return (
      <ProductSlider
        products={staticProducts[tabKey] || []}
        currentSlide={currentSlide}
        slidesPerView={SLIDES_PER_VIEW}
        onNext={handleNextSlide}
        onPrev={handlePrevSlide}
      />
    );
  };

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
              {renderTabContent(key)}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="h-px bg-gray-200" />
      </div>
    </section>
  );
}
