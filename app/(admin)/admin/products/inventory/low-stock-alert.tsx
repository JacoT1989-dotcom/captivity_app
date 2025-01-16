import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type LowStockProduct = {
  id: string;
  productName: string;
  variations: {
    id: string;
    name: string;
    sku: string;
    quantity: number;
  }[];
};

interface LowStockAlertProps {
  items: LowStockProduct[];
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  // Only show alert if there are items with low stock
  const lowStockItems = items.filter(item =>
    item.variations.some(v => v.quantity <= 10)
  );

  if (lowStockItems.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <p>The following items are running low on stock:</p>
          <ul className="mt-2 space-y-1">
            {lowStockItems.map(item => (
              <li key={item.id}>
                {item.productName}:
                {item.variations
                  .filter(v => v.quantity <= 10)
                  .map(v => (
                    <span key={v.id} className="ml-2 text-sm">
                      {v.name} ({v.quantity} left)
                    </span>
                  ))}
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}
