import { useState, useCallback } from "react";
import { useSession } from "@/app/SessionProvider";
import { useHighlightedProductsData } from "@/app/(editor)/_editor-store/highlighted-products-store";
import type { ContentProps, HighlightedProduct } from "../../types";
import { ProductSlider } from "../../ProductSlider";
import { NewArrivalEditModal } from "./NewArrivalEditModal";
import { NewArrivalFormModal } from "./NewArrivalFormModal";

export function NewArrivalsContent({
  currentSlide,
  slidesPerView,
  onNext,
  onPrev,
}: ContentProps) {
  const session = useSession();
  const isEditor = session?.user?.role === "EDITOR";
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<HighlightedProduct | null>(null);

  const {
    newArrivals,
    isLoading,
    error,
    uploadNewArrival,
    updateNewArrival,
    removeNewArrival,
  } = useHighlightedProductsData();

  const handleAddNew = useCallback(() => {
    console.log("handleAddNew called in NewArrivalsContent");
    setShowAddForm(true);
  }, []);

  const handleCloseAddForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleUploadComplete = useCallback(
    async (formData: FormData) => {
      try {
        await uploadNewArrival(formData);
        setShowAddForm(false);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [uploadNewArrival]
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
        products={newArrivals}
        currentSlide={currentSlide}
        slidesPerView={slidesPerView}
        onNext={onNext}
        onPrev={onPrev}
        onEdit={isEditor ? setEditingProduct : undefined}
        onRemove={isEditor ? removeNewArrival : undefined}
        onAddNew={isEditor ? handleAddNew : undefined}
      />

      {/* Edit Modal */}
      {editingProduct && (
        <NewArrivalEditModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onUpdate={updateNewArrival}
        />
      )}

      {/* Add Modal */}
      <NewArrivalFormModal
        isOpen={showAddForm}
        onClose={handleCloseAddForm}
        onSubmit={handleUploadComplete}
        error={error}
      />
    </div>
  );
}
