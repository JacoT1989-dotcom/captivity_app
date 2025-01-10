import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format the description
export const formatDescription = (description: string) => {
  let formattedDesc = description.replace(/\\n/g, "");
  const lines = formattedDesc.split("*").filter(line => line.trim() !== "");
  const listItems = lines.map(line => `<li>${line.trim()}</li>`).join("");
  formattedDesc = `<ul>${listItems}</ul>`;
  formattedDesc = formattedDesc.replace(
    /<li>(Recommended Branding:.*?)<\/li>/,
    "</ul><p><strong>$1</strong></p>"
  );
  return { __html: formattedDesc };
};

// order history page

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export function getStatusColor(status: OrderStatus): string {
  const statusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500",
    PROCESSING: "bg-blue-500/10 text-blue-500",
    SHIPPED: "bg-purple-500/10 text-purple-500",
    DELIVERED: "bg-green-500/10 text-green-500",
    CANCELLED: "bg-red-500/10 text-red-500",
    REFUNDED: "bg-gray-500/10 text-gray-500",
  };

  return statusColors[status] || "bg-gray-500/10 text-gray-500";
}
