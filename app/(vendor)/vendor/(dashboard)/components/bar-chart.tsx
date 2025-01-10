"use client";

import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BarChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const isDarkMode = document.documentElement.classList.contains("dark");

        const config: ChartConfiguration = {
          type: "bar",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Created",
                data: [65, 59, 80, 81, 56, 55, 40, 88, 75, 43, 65, 38],
                backgroundColor: isDarkMode
                  ? "rgba(96, 165, 250, 0.2)"
                  : "rgba(37, 99, 235, 0.2)",
              },
              {
                label: "Solved",
                data: [45, 79, 50, 41, 36, 35, 60, 68, 65, 33, 45, 28],
                backgroundColor: isDarkMode
                  ? "rgb(96, 165, 250)"
                  : "rgb(37, 99, 235)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                },
              },
              tooltip: {
                backgroundColor: isDarkMode ? "#374151" : "#1e1e1e",
                padding: 12,
                cornerRadius: 8,
                titleColor: isDarkMode ? "#e5e7eb" : "#ffffff",
                bodyColor: isDarkMode ? "#e5e7eb" : "#ffffff",
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                },
              },
              y: {
                border: {
                  dash: [5, 5],
                },
                grid: {
                  color: isDarkMode
                    ? "rgba(156, 163, 175, 0.1)"
                    : "rgba(107, 114, 128, 0.1)",
                },
                ticks: {
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                },
              },
            },
          },
        };

        chartInstance.current = new Chart(ctx, config);
      }
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h3 className="text-lg font-medium text-card-foreground">
          Avg. Sales Generated
        </h3>
        <Select defaultValue="yearly">
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
