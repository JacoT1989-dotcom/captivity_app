import { formatDate } from "@/lib/utils";
import { VendorOrder } from "../types";

interface VendorPrintTemplateProps {
  order: VendorOrder;
}

export function VendorPrintTemplate({ order }: VendorPrintTemplateProps) {
  const customerType =
    order.user?.role === "VENDORCUSTOMER"
      ? "Vendor Customer"
      : "Regular Customer";

  return `
    <html>
      <head>
        <title>Vendor Order #${order.referenceNumber || order.id.slice(-8)}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
            line-height: 1.6;
          }
          .print-content { 
            max-width: 800px; 
            margin: 0 auto; 
          }
          .header {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .customer-type {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            background-color: #e5e7eb;
            font-size: 0.875rem;
            margin-bottom: 10px;
          }
          .order-details, .delivery-details {
            margin-bottom: 20px;
          }
          .items-list {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .items-list th, .items-list td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .items-list th {
            background-color: #f5f5f5;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 1.2em;
            margin-top: 20px;
          }
          .vendor-info {
            margin-top: 20px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="print-content">
          <div class="header">
            <h2>Vendor Order #${order.referenceNumber || order.id.slice(-8)}</h2>
            <div class="customer-type">${customerType}</div>
            <p>Date: ${formatDate(order.createdAt)}</p>
          </div>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p>Status: ${order.status}</p>
            <p>Collection Method: ${order.methodOfCollection}</p>
            <p>Vendor Branch: ${order.vendorBranch}</p>
            ${order.salesRep ? `<p>Sales Rep: ${order.salesRep}</p>` : ""}
          </div>

          <div class="delivery-details">
            <h3>Delivery Information</h3>
            <p>${order.firstName} ${order.lastName}</p>
            <p>${order.companyName}</p>
            <p>${order.streetAddress}</p>
            ${order.apartmentSuite ? `<p>${order.apartmentSuite}</p>` : ""}
            <p>${order.townCity} ${order.province}</p>
            <p>${order.postcode}</p>
            <p>${order.countryRegion}</p>
            <p>Phone: ${order.phone}</p>
            <p>Email: ${order.email}</p>
          </div>

          <table class="items-list">
            <thead>
              <tr>
                <th>Item</th>
                <th>Details</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.vendorOrderItems
                .map(
                  item => `
                <tr>
                  <td>${item.vendorVariation.name}</td>
                  <td>${item.vendorVariation.color} / ${item.vendorVariation.size}<br>
                      SKU: ${item.vendorVariation.sku}${
                        item.vendorVariation.sku2
                          ? ` / ${item.vendorVariation.sku2}`
                          : ""
                      }</td>
                  <td>R${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>R${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total">
            Total Amount: R${order.totalAmount.toFixed(2)}
          </div>

          ${
            order.orderNotes
              ? `
            <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
              <h3>Order Notes:</h3>
              <p>${order.orderNotes}</p>
            </div>
          `
              : ""
          }

          ${
            order.user
              ? `
            <div class="vendor-info">
              <h3>Customer Account Information</h3>
              <p>Account Type: ${customerType}</p>
              <p>Company: ${order.user.companyName}</p>
              <p>Username: ${order.user.username}</p>
              ${
                order.user.storeSlug
                  ? `<p>Store URL: ${order.user.storeSlug}</p>`
                  : ""
              }
            </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `;
}
