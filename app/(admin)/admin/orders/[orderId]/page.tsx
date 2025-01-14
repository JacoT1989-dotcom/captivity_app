import { getOrderDetails } from "../_components/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  try {
    if (!params.orderId) {
      throw new Error("Order ID is required");
    }

    const order = await getOrderDetails(params.orderId);

    const getStatusColor = (status: string): string => {
      const colors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PROCESSING: "bg-blue-100 text-blue-800",
        SHIPPED: "bg-purple-100 text-purple-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        REFUNDED: "bg-gray-100 text-gray-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/orders/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Reference Number
                  </dt>
                  <dd>{order.referenceNumber || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Order Date
                  </dt>
                  <dd>{new Date(order.createdAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Amount
                  </dt>
                  <dd className="text-lg font-bold">
                    R {order.totalAmount.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Method of Collection
                  </dt>
                  <dd>{order.methodOfCollection}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Captivity Branch
                  </dt>
                  <dd>{order.captivityBranch}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Sales Rep
                  </dt>
                  <dd>{order.salesRep || "N/A"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Customer Name
                  </dt>
                  <dd className="text-lg">{`${order.firstName} ${order.lastName}`}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd>{order.companyName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd>{order.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd>{order.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Shipping Address
                  </dt>
                  <dd className="whitespace-pre-line">
                    {order.streetAddress}
                    {order.apartmentSuite && `\n${order.apartmentSuite}`}
                    {`\n${order.townCity}, ${order.province}`}
                    {`\n${order.postcode}`}
                    {`\n${order.countryRegion}`}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-left">Color</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2">{item.variation.name}</td>
                        <td className="px-4 py-2">{item.variation.sku}</td>
                        <td className="px-4 py-2">{item.variation.size}</td>
                        <td className="px-4 py-2">{item.variation.color}</td>
                        <td className="px-4 py-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-right ">
                          R {item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          R {(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={6} className="px-4 py-2 text-right">
                        Total:
                      </td>
                      <td className="px-4 py-2 text-right">
                        R {order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.orderNotes && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{order.orderNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  } catch (error) {
  
    return (
      <div className="h-full flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Unable to load order details. Please try again later.</p>
            <Link href="/admin/orders/orders">
              <Button variant="outline" size="sm" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}
