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

const staticProducts: Record<string, Product[]> = {
  "new-arrivals": [
    {
      id: 1,
      title: "Faux suede biker jacket",
      price: 60.0,
      image: "/placeholder.png?height=600&width=400",
      rating: 4,
    },
    {
      id: 2,
      title: "Pocketed denim jacket",
      price: 56.0,
      image: "/placeholder.png?height=600&width=400",
      rating: 0,
    },
    {
      id: 3,
      title: "Oversized jacket with denim panels",
      price: 33.0,
      image: "/placeholder.png?height=600&width=400",
      rating: 4.5,
    },
    {
      id: 4,
      title: "Eco Aware organic cotton top",
      price: 39.0,
      image: "/placeholder.png?height=600&width=400",
      rating: 4.5,
    },
  ],
  "on-sale": [
    {
      id: 9,
      title: "Summer Dress",
      price: 79.99,
      salePrice: 59.99,
      image: "/placeholder.png?height=600&width=400",
      rating: 4,
    },
    {
      id: 10,
      title: "Casual Blazer",
      price: 129.99,
      salePrice: 89.99,
      image: "/placeholder.png?height=600&width=400",
      rating: 4.5,
    },
    {
      id: 11,
      title: "Printed Blouse",
      price: 45.99,
      salePrice: 29.99,
      image: "/placeholder.png?height=600&width=400",
      rating: 4,
    },
    {
      id: 12,
      title: "Slim Fit Pants",
      price: 69.99,
      salePrice: 49.99,
      image: "/placeholder.png?height=600&width=400",
      rating: 4.5,
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
  const slidesPerView = 4;

  console.log("ProductTabs isEditor:", isEditor); // Debug log
  console.log("ProductTabs showAddForm:", showAddForm); // Debug log

  const {
    bestSellers,
    isLoading: bestSellersLoading,
    uploadBestSeller,
    updateBestSeller,
    removeBestSeller,
  } = useHighlightedProductsData();

  const handleNextSlide = () => {
    const currentProducts =
      activeTab === "best-sellers" ? bestSellers : staticProducts[activeTab];

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
    console.log("handleAddNew called in ProductTabs"); // Debug log
    setShowAddForm(true);
  }, []);

  const handleUploadComplete = React.useCallback(
    async (formData: FormData) => {
      try {
        await uploadBestSeller(formData);
        setShowAddForm(false);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [uploadBestSeller]
  );

  const renderTabContent = (tabKey: string) => {
    if (tabKey === "best-sellers") {
      return (
        <>
          <ProductSlider
            products={bestSellers}
            currentSlide={currentSlide}
            slidesPerView={slidesPerView}
            onNext={handleNextSlide}
            onPrev={handlePrevSlide}
            onEdit={
              isEditor
                ? product => setEditingProduct(product as HighlightedProduct)
                : undefined
            }
            onRemove={isEditor ? removeBestSeller : undefined}
            onAddNew={isEditor ? handleAddNew : undefined}
          />

          {isEditor && (
            <BestSellerFormModal
              isOpen={showAddForm}
              onClose={() => setShowAddForm(false)}
              onSubmit={handleUploadComplete}
            />
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

          {Object.keys(staticProducts)
            .concat("best-sellers")
            .map(key => (
              <TabsContent key={key} value={key} className="relative">
                {renderTabContent(key)}
              </TabsContent>
            ))}
        </Tabs>
      </div>

      {editingProduct && isEditor && (
        <BestSellerEditModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onUpdate={updateBestSeller}
        />
      )}

      <div className="container mx-auto px-4 mt-8">
        <div className="h-px bg-gray-200" />
      </div>
    </section>
  );
}
