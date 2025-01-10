import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getVendorOrderById, updateOrderStatus } from "./actions";
import OrderDetails from "./OrderDetails";
import { OrderStatus, User } from "@prisma/client";
import { VendorOrderResponse } from "./types";
import { validateRequest } from "@/auth";

interface OrderDetailsPageProps {
  params: {
    id: string;
    vendor_website: string;
  };
}

// Define the extended User type that includes storeSlug
interface ExtendedUser extends User {
  storeSlug: string | null;
}

// Define the complete order data type
interface CompleteOrderData {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  vendorBranch: string;
  methodOfCollection: string;
  salesRep: string | null;
  referenceNumber: string | null;
  firstName: string;
  lastName: string;
  companyName: string;
  countryRegion: string;
  streetAddress: string;
  apartmentSuite: string | null;
  townCity: string;
  province: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string | null;
  agreeTerms: boolean;
  receiveEmailReviews: boolean | null;
  user?: {
    id: string;
    role: string;
    storeSlug: string | null;
    username: string;
    email: string;
  };
  vendorOrderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    vendorVariation: {
      id: string;
      sku: string;
      color: string;
      size: string;
      vendorProduct: {
        id: string;
        productName: string;
        description: string;
        sellingPrice: number;
        isPublished: boolean;
        category: string[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
      };
    };
  }>;
}

type OrderData =
  | CompleteOrderData
  | { id: string; status: OrderStatus; updatedAt: Date };

function isCompleteOrderData(order: OrderData): order is CompleteOrderData {
  return "user" in order;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id, vendor_website } = params;

  if (!id || !vendor_website) {
    return notFound();
  }

  const auth = await validateRequest();
  const user = auth.user as ExtendedUser | null;

  if (!user) {
    redirect("/login");
  }

  const vendor = await prisma.user.findFirst({
    where: {
      storeSlug: vendor_website,
      role: "VENDOR",
    },
  });

  if (!vendor) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Store Not Found
          </h1>
          <p className="text-gray-600">
            Sorry, the store you are looking for does not exist or may have been
            removed.
          </p>
        </Card>
      </div>
    );
  }

  const hasAccess =
    user.role === "VENDOR" ||
    (user.role === "VENDORCUSTOMER" &&
      user.storeSlug?.startsWith(vendor_website));

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to view this order. Please contact your
            vendor if you believe this is an error.
          </p>
        </Card>
      </div>
    );
  }

  const orderData = await getVendorOrderById(id);

  if (!orderData.success) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Order
          </h1>
          <p className="text-gray-600">{orderData.error}</p>
        </Card>
      </div>
    );
  }

  const userCanAccessOrder =
    user.role === "VENDOR" ||
    ((isCompleteOrderData(orderData.data) &&
      orderData.data.user?.storeSlug?.startsWith(user.storeSlug ?? "")) ??
      false);

  if (!userCanAccessOrder) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to view this specific order.
          </p>
        </Card>
      </div>
    );
  }

  async function handleStatusUpdate(orderId: string, newStatus: OrderStatus) {
    "use server";

    const auth = await validateRequest();
    const user = auth.user as ExtendedUser | null;

    if (!user || user.role !== "VENDOR") {
      throw new Error("Unauthorized to update order status");
    }

    await updateOrderStatus(orderId, newStatus);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <OrderDetails
          order={orderData.data}
          storeSlug={vendor_website}
          onUpdateStatus={handleStatusUpdate}
        />
      </div>
    </div>
  );
}
