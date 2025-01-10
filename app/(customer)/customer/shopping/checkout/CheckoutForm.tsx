"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { formSchema, FormValues } from "./_lib/validations";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useCartStore from "../../_store/useCartStore";
import { BillingDetails } from "./_components/BillingDetails";
import { AdditionalInformation } from "./_components/AdditionalInformation";
import { TermsAndConditions } from "./_components/TermsAndConditions";
import OrderSummary from "./_components/OrderSummary";
import { createOrder, getUserDetails } from "./actions";
import { useRouter } from "next/navigation";

// Memoize form default values
const defaultFormValues: FormValues = {
  captivityBranch: "",
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

// Memoized components
const LoadingSpinner = React.memo(() => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
));

const OrderNote = React.memo(() => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <p className="text-sm text-yellow-800">
      Note: By placing your order, you agree to our terms and conditions. A
      proforma invoice will be sent to your email address.
    </p>
  </div>
));

OrderNote.displayName = "OrderNote";

const NavigationButtons = React.memo(
  ({
    isLoading,
    isSubmitting,
    hasItems,
  }: {
    isLoading: boolean;
    isSubmitting: boolean;
    hasItems: boolean;
  }) => (
    <div className="flex justify-between items-center">
      <Button type="button" variant="outline" className="w-[200px]">
        <Link href="/customer/shopping/cart">Go to Cart</Link>
      </Button>

      <Button
        type="submit"
        className="w-[200px]"
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

const CheckoutForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingPreviousOrder, setIsLoadingPreviousOrder] =
    React.useState(true);

  // Memoize the form resolver
  const formResolver = useMemo(() => zodResolver(formSchema), []);

  // Initialize form with memoized values
  const form = useForm<FormValues>({
    resolver: formResolver,
    defaultValues: defaultFormValues,
    mode: "onChange",
  });

  // Use individual selectors for cart store
  const cart = useCartStore(state => state.cart);
  const isLoading = useCartStore(state => state.isLoading);
  const error = useCartStore(state => state.error);
  const fetchCart = useCartStore(state => state.fetchCart);
  const updateCartItemQuantity = useCartStore(
    state => state.updateCartItemQuantity
  );
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const setCart = useCartStore(state => state.setCart);

  // Memoize handlers
  const handleQuantityChange = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      if (newQuantity < 1) return;
      await updateCartItemQuantity(cartItemId, newQuantity);
    },
    [updateCartItemQuantity]
  );

  const handleRemoveItem = useCallback(
    async (cartItemId: string) => {
      await removeFromCart(cartItemId);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
    [removeFromCart, toast]
  );

  const onSubmit = useCallback(
    async (formData: FormValues) => {
      setIsSubmitting(true);
      try {
        const result = await createOrder(formData);
        if (result.success) {
          setCart(null);
          toast({
            title: "Success",
            description: "Order placed successfully!",
          });
          router.push(`/customer/order-success/${result.data.id}`);
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
    [router, setCart, toast]
  );

  // Load user data
  useEffect(() => {
    let mounted = true;

    const loadUserData = async () => {
      try {
        const result = await getUserDetails();
        if (!mounted) return;

        if (result.success && result.data) {
          form.reset({
            ...defaultFormValues,
            firstName: result.data.firstName || "",
            lastName: result.data.lastName || "",
            email: result.data.email || "",
            salesRep: result.data.salesRep || "",
            phone: result.data.phoneNumber?.toString() || "",
            companyName: result.data.companyName || "",
            countryRegion: result.data.country || "",
            streetAddress: result.data.streetAddress || "",
            apartmentSuite: result.data.addressLine2 || "",
            townCity: result.data.townCity || "",
            province: result.data.suburb || "",
            postcode: result.data.postcode || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
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
  }, [form]); // Include form in dependencies

  // Fetch cart
  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]); // Include required dependencies

  if (isLoadingPreviousOrder) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto p-6 mb-16"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <BillingDetails form={form} />
            <AdditionalInformation form={form} />
            <TermsAndConditions form={form} />
          </div>

          <div className="w-full lg:w-1/3">
            <OrderSummary
              cart={cart}
              isLoading={isLoading}
              error={error}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <OrderNote />
          <NavigationButtons
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            hasItems={Boolean(cart?.cartItems?.length)}
          />
        </div>
      </form>
    </Form>
  );
};

LoadingSpinner.displayName = "LoadingSpinner";

export default React.memo(CheckoutForm);
