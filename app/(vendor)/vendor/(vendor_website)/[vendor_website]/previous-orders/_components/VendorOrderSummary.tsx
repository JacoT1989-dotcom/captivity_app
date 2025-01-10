import { Card, CardContent } from "@/components/ui/card";
import { Package, Store, Clock, TrendingUp } from "lucide-react";

interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  processingOrders: number;
}

interface VendorOrderSummaryProps {
  stats: OrderStats;
}

export function VendorOrderSummary({ stats }: VendorOrderSummaryProps) {
  const summaryCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      shadowColor: "shadow-blue-900/20",
    },
    {
      title: "Total Revenue",
      value: `R${stats.totalAmount.toFixed(2)}`,
      icon: TrendingUp,
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      shadowColor: "shadow-green-900/20",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      shadowColor: "shadow-orange-900/20",
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      icon: Store,
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      shadowColor: "shadow-purple-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => (
        <Card
          key={index}
          className={`transform transition-all duration-300 hover:scale-105 ${card.bgColor} shadow-2xl ${card.shadowColor}`}
        >
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-gray-800">{card.title}</p>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.textColor}`} />
              </div>
            </div>
            <p
              className={`text-3xl font-bold ${card.textColor} tracking-tight`}
            >
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
