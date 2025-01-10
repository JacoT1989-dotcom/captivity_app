"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createVendorOrder } from "../vendor-orders";
import { useParams, useRouter } from "next/navigation";
import {
  VendorFormValues,
  VendorOrder,
  VendorOrderActionResult,
} from "../_lib/types";
import { vendorFormSchema } from "../_lib/validation";
import useVendorCartStore from "../../cart/useCartStore";
import VendorBillingDetails from "./BillingDetails";
import { VendorAdditionalInformation } from "./AdditionalInformation";
import { VendorTermsAndConditions } from "./TermsAndConditions";
import VendorOrderSummary from "./OrderSummary";
import { getVendorUserDetails } from "../vendor-user";

const defaultVendorFormValues: VendorFormValues = {
  vendorBranch: "",
  methodOfCollection: "",
  salesRep: "",
  referenceNumber: "",
  firstName: "",
  lastName: "",
  companyName: "",
  countryRegion: "",
  streetAddress: "",
  apartmentSuite: "",
  townCity: "",
  province: "",
  postcode: "",
  phone: "",
  email: "",
  orderNotes: "",
  agreeTerms: false,
  receiveEmailReviews: false,
} as const;

const LoadingSpinner: React.FC = React.memo(() => (
  <div className="flex justify-center items-center min-h-[200px] dark:bg-gray-800">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const OrderNote: React.FC = React.memo(() => (
  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-colors duration-200">
    <p className="text-sm text-yellow-800 dark:text-yellow-200">
      Note: By placing your order, you agree to our vendor terms and conditions.
      A proforma invoice will be sent to your email address.
    </p>
  </div>
));

OrderNote.displayName = "OrderNote";

interface NavigationButtonsProps {
  isLoading: boolean;
  isSubmitting: boolean;
  hasItems: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = React.memo(
  ({ isLoading, isSubmitting, hasItems }) => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-[200px] dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
        asChild
      >
        <Link href="/vendor/shopping/cart">Go to Cart</Link>
      </Button>

      <Button
        type="submit"
        className="w-full sm:w-[200px] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors duration-200"
        disabled={isLoading || !hasItems || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Place Order</>
        )}
      </Button>
    </div>
  )
);

NavigationButtons.displayName = "NavigationButtons";

const CheckoutForm: React.FC = () => {
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingPreviousOrder, setIsLoadingPreviousOrder] =
    React.useState(true);

  const formResolver = useMemo(() => zodResolver(vendorFormSchema), []);

  const form = useForm<VendorFormValues>({
    resolver: formResolver,
    defaultValues: defaultVendorFormValues,
    mode: "onSubmit", // Only validate on form submission
  });

  const cart = useVendorCartStore(state => state.cart);
  const isLoading = useVendorCartStore(state => state.isLoading);
  const error = useVendorCartStore(state => state.error);
  const initialize = useVendorCartStore(state => state.initialize);
  const updateQuantity = useVendorCartStore(state => state.updateQuantity);
  const removeItem = useVendorCartStore(state => state.removeItem);
  const setCart = useVendorCartStore(state => state.setCart);

  const handleQuantityChange = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      if (newQuantity < 1) return;
      await updateQuantity(cartItemId, newQuantity);
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    async (cartItemId: string) => {
      await removeItem(cartItemId);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
    [removeItem, toast]
  );

  const onSubmit = useCallback(
    async (formData: VendorFormValues) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const result = await createVendorOrder(formData);
        if (result.success && result.data) {
          const orderData = result.data as VendorOrder;
          setCart(null);
          toast({
            title: "Success",
            description: "Order placed successfully!",
          });
          router.replace(
            `/vendor/${vendorWebsite}/order-success/${orderData.id}`
          );
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to place order",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, setCart, toast, router, vendorWebsite]
  );

  useEffect(() => {
    let mounted = true;

    const loadUserData = async () => {
      if (!mounted) return;

      try {
        const result = await getVendorUserDetails();
        if (!mounted || !result.success || !result.data) return;

        const userData = result.data;

        // Process address fields
        const countryRegion =
          userData.countryRegion?.toLowerCase() === "south africa"
            ? "southafrica"
            : userData.countryRegion || "";

        // Set user-related fields
        const userFields = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          companyName: userData.companyName || "",
          countryRegion,
          streetAddress: userData.streetAddress || "",
          apartmentSuite: userData.apartmentSuite || "",
          townCity: userData.townCity || "",
          province: userData.province || "",
          postcode: userData.postcode || "",
          salesRep: userData.salesRep || "",
        };

        // Reset form while preserving checkout-specific fields as empty
        form.reset(
          {
            ...defaultVendorFormValues,
            ...userFields,
          },
          {
            keepDefaultValues: false,
            keepDirty: false,
          }
        );
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description:
            "Failed to load your saved details. Please enter them manually.",
          variant: "destructive",
        });
      } finally {
        if (mounted) {
          setIsLoadingPreviousOrder(false);
        }
      }
    };

    loadUserData();
    return () => {
      mounted = false;
    };
  }, [form, toast]);

  useEffect(() => {
    if (!cart) {
      initialize();
    }
  }, [cart, initialize]);

  if (isLoadingPreviousOrder) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto p-4 sm:p-6 mb-16 dark:bg-background transition-colors duration-200"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <VendorBillingDetails form={form} />
            <VendorAdditionalInformation form={form} />
            <VendorTermsAndConditions form={form} />
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-4">
              <VendorOrderSummary
                cart={cart}
                isLoading={isLoading}
                error={error}
                handleQuantityChange={handleQuantityChange}
                handleRemoveItem={handleRemoveItem}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <OrderNote />
          <NavigationButtons
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            hasItems={Boolean(cart?.vendorCartItems?.length)}
          />
        </div>
      </form>
    </Form>
  );
};

export default React.memo(CheckoutForm);
