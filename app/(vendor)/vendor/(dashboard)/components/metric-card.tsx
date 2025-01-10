import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    trend: "up" | "down";
    percentage: string;
  };
  subtitle: string;
}

export function MetricCard({
  title,
  value,
  change,
  subtitle,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold text-card-foreground">{value}</h3>
        <span
          className={cn(
            "flex items-center gap-0.5 text-sm font-medium",
            change.trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {change.trend === "up" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          {change.percentage}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
