"use client";

import React from "react";
import { VendorVariation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import useVendorCartStore from "../cart/useCartStore";

interface VendorAddToCartButtonProps {
  selectedVariation: VendorVariation | null;
  quantity: number;
  disabled?: boolean;
  className?: string;
}

interface User {
  id: string;
  role: string;
}

interface SessionData {
  user: User | null;
}

const VendorAddToCartButton: React.FC<VendorAddToCartButtonProps> = ({
  selectedVariation,
  quantity,
  disabled,
  className = "",
}) => {
  const { user } = useSession() as SessionData;
  const { addToCart, isLoading, initialize, isInitialized } =
    useVendorCartStore();

  React.useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  const handleAddToCart = async () => {
    if (!selectedVariation) return;

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      toast({
        title: "Access Denied",
        description: "Only vendor customers can add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (quantity > selectedVariation.quantity) {
      toast({
        title: "Error",
        description: "Not enough stock available",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await addToCart(selectedVariation.id, quantity);

      if (success) {
        toast({
          title: "Success",
          description: "Item added to cart",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const isButtonDisabled =
    disabled ||
    isLoading ||
    !selectedVariation ||
    quantity < 1 ||
    quantity > (selectedVariation?.quantity || 0);

  return (
    <Button
      className={`w-full ${className}`}
      disabled={isButtonDisabled}
      onClick={handleAddToCart}
      variant="default"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding...
        </span>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
};

export default VendorAddToCartButton;
