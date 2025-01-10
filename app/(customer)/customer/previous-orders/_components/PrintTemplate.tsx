import { formatDate } from "@/lib/utils";
import { Order } from "../types";

interface PrintTemplateProps {
  order: Order;
}

export function PrintTemplate({ order }: PrintTemplateProps) {
  return `
    <html>
      <head>
        <title>Order #${order.referenceNumber || order.id.slice(-8)}</title>
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
        </style>
      </head>
      <body>
        <div class="print-content">
          <div class="header">
            <h2>Order #${order.referenceNumber || order.id.slice(-8)}</h2>
            <p>Date: ${formatDate(order.createdAt)}</p>
          </div>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p>Status: ${order.status}</p>
            <p>Collection Method: ${order.methodOfCollection}</p>
            <p>Branch: ${order.captivityBranch}</p>
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
              ${order.orderItems
                .map(
                  item => `
                <tr>
                  <td>${item.variation.name}</td>
                  <td>${item.variation.color} / ${item.variation.size}<br>SKU: ${
                    item.variation.sku
                  }${
                    item.variation.sku2 ? ` / ${item.variation.sku2}` : ""
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
        </div>
      </body>
    </html>
  `;
}
