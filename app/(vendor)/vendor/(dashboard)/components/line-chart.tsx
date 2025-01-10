"use client";

import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { Button } from "@/components/ui/button";

export function LineChart() {
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
          type: "line",
          data: {
            labels: [
              "21 Oct",
              "25 Oct",
              "30 Oct",
              "5 Nov",
              "10 Nov",
              "15 Nov",
              "21 Nov",
            ],
            datasets: [
              {
                label: "Revenue",
                data: [2000, 3500, 4800, 4000, 3800, 3200, 1800],
                borderColor: isDarkMode
                  ? "rgb(96, 165, 250)"
                  : "rgb(37, 99, 235)",
                backgroundColor: isDarkMode
                  ? "rgba(96, 165, 250, 0.1)"
                  : "rgba(37, 99, 235, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
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
                  callback: function (value) {
                    return "$" + value.toLocaleString();
                  },
                },
              },
            },
          },
        };

        chartInstance.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
        <h3 className="text-lg font-medium text-card-foreground">
          Total Revenue
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            Manage
          </Button>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
