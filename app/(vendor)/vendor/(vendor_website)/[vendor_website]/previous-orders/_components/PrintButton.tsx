"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { VendorOrder } from "../types";
import { VendorPrintTemplate } from "./PrintTemplate";

interface VendorPrintButtonProps {
  order: VendorOrder;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function VendorPrintButton({
  order,
  variant = "outline",
  size = "sm",
  className,
}: VendorPrintButtonProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(VendorPrintTemplate({ order }));
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={className}
    >
      <Printer className="h-4 w-4 mr-2" />
      Print
    </Button>
  );
}
