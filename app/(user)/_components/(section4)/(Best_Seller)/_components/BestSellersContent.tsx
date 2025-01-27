import { useState, useCallback } from "react";
import { useSession } from "@/app/SessionProvider";
import { useHighlightedProductsData } from "@/app/(editor)/_editor-store/highlighted-products-store";
import { BestSellerFormModal } from "./BestSellerFormModal";
import { BestSellerEditModal } from "./BestSellerEditModal";
import type { BestSellersContentProps, HighlightedProduct } from "../types";
import { ProductSlider } from "../ProductSlider";

export function BestSellersContent({
  currentSlide,
  slidesPerView,
  onNext,
  onPrev,
}: BestSellersContentProps) {
  const session = useSession();
  const isEditor = session?.user?.role === "EDITOR";
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<HighlightedProduct | null>(null);

  const {
    bestSellers,
    isLoading,
    error,
    uploadBestSeller,
    updateBestSeller,
    removeBestSeller,
  } = useHighlightedProductsData();

  const handleAddNew = useCallback(() => {
    console.log("handleAddNew called in BestSellersContent"); // Debug log
    setShowAddForm(true);
  }, []);

  const handleCloseAddForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleUploadComplete = useCallback(
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

  if (isLoading) {
    return (
      <div className="relative">
        {Array.from({ length: slidesPerView }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <ProductSlider
        products={bestSellers}
        currentSlide={currentSlide}
        slidesPerView={slidesPerView}
        onNext={onNext}
        onPrev={onPrev}
        onEdit={isEditor ? setEditingProduct : undefined}
        onRemove={isEditor ? removeBestSeller : undefined}
        onAddNew={isEditor ? handleAddNew : undefined}
      />

      {/* Edit Modal */}
      {editingProduct && (
        <BestSellerEditModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onUpdate={updateBestSeller}
        />
      )}

      {/* Add Modal */}
      <BestSellerFormModal
        isOpen={showAddForm}
        onClose={handleCloseAddForm}
        onSubmit={handleUploadComplete}
        error={error}
      />
    </div>
  );
}
