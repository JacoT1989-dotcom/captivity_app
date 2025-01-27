"use client";

import * as React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TabNavigation } from "./TabNavigation";
import { ProductSlider } from "./ProductSlider";
import { Product, HighlightedProduct } from "./types";
import { useHighlightedProductsData } from "@/app/(editor)/_editor-store/highlighted-products-store";
import { useSession } from "@/app/SessionProvider";
import { BestSellerFormModal } from "./_components/(best_sellers)/BestSellerFormModal";
import { BestSellerEditModal } from "./_components/(best_sellers)/BestSellerEditModal";
import { NewArrivalFormModal } from "./_components/(new_arrivals)/NewArrivalFormModal";
import { NewArrivalEditModal } from "./_components/(new_arrivals)/NewArrivalEditModal";

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
    // ... other on-sale products
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
  const slidesPerView = 4;

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

  const handleNextSlide = () => {
    const currentProducts = (() => {
      switch (activeTab) {
        case "new-arrivals":
          return newArrivals;
        case "best-sellers":
          return bestSellers;
        default:
          return staticProducts[activeTab] || [];
      }
    })();

    setCurrentSlide(prev =>
      Math.min(prev + 1, Math.max(0, currentProducts.length - slidesPerView))
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

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
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [activeTab, uploadNewArrival, uploadBestSeller]
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
      } catch (error) {
        console.error("Remove error:", error);
      }
    },
    [activeTab, removeNewArrival, removeBestSeller]
  );

  const renderTabContent = (tabKey: string) => {
    if (tabKey === "new-arrivals" || tabKey === "best-sellers") {
      const products = tabKey === "new-arrivals" ? newArrivals : bestSellers;

      return (
        <>
          <ProductSlider
            products={products}
            currentSlide={currentSlide}
            slidesPerView={slidesPerView}
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

          {isEditor && (
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
        </>
      );
    }

    return (
      <ProductSlider
        products={staticProducts[tabKey]}
        currentSlide={currentSlide}
        slidesPerView={slidesPerView}
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

          {[...Object.keys(staticProducts), "new-arrivals", "best-sellers"].map(
            key => (
              <TabsContent key={key} value={key} className="relative">
                {renderTabContent(key)}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>

      {editingProduct && isEditor && (
        <>
          {activeTab === "new-arrivals" ? (
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

      <div className="container mx-auto px-4 mt-8">
        <div className="h-px bg-gray-200" />
      </div>
    </section>
  );
}
