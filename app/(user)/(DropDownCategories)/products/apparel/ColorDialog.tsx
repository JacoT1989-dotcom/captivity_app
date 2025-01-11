import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ColorVariation {
  color: string;
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }[];
}

interface ProductVariations {
  [productId: string]: {
    variations: ColorVariation[];
  };
}

interface ColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  groupedVariations: ProductVariations;
}

const ColorDialog: React.FC<ColorDialogProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  groupedVariations,
}) => {
  if (!selectedProduct || !groupedVariations[selectedProduct]) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Available Colors</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {groupedVariations[selectedProduct].variations.map(
            ({ color, variations }) => (
              <div key={color} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full border border-border"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                <span className="text-sm text-muted-foreground">{color}</span>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorDialog;
