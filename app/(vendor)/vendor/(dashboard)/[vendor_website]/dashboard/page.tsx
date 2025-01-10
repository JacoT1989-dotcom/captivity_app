// app/(vendor)/page.tsx
import { BarChart } from "../../components/bar-chart";
import { LineChart } from "../../components/line-chart";
import { MetricCard } from "../../components/metric-card";

const metrics = [
  {
    title: "Total Customers",
    value: "2,420",
    change: {
      value: "122",
      trend: "up" as const,
      percentage: "12.5%",
    },
    subtitle: "From previous month",
  },
  {
    title: "Average Order Value",
    value: "R 445.80",
    change: {
      value: "R 38.60",
      trend: "up" as const,
      percentage: "8.2%",
    },
    subtitle: "From previous month",
  },
  {
    title: "Pending Orders",
    value: "182",
    change: {
      value: "22",
      trend: "down" as const,
      percentage: "4.3%",
    },
    subtitle: "From previous week",
  },
  {
    title: "Active Support Tickets",
    value: "28",
    change: {
      value: "5",
      trend: "down" as const,
      percentage: "6.1%",
    },
    subtitle: "From yesterday",
  },
];

export default function VendorDashboardPage() {
  return (
    <div className="p-6 pt-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor your business performance and customer activity
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map(metric => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="col-span-1">
            <LineChart />
          </div>
          <div className="col-span-1">
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
}
