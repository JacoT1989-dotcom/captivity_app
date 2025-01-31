"use client";
import React from "react";
import { LayoutGrid, List, ImageIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface LayoutSwitcherProps {
  layout: "grid" | "detail" | "gallery";
  onLayoutChange: (layout: "grid" | "detail" | "gallery") => void;
}

const layouts = [
  {
    value: "grid",
    icon: LayoutGrid,
    label: "Grid View",
    description: "Compact grid layout",
  },
  {
    value: "detail",
    icon: List,
    label: "Detail View",
    description: "Detailed list layout",
  },
  {
    value: "gallery",
    icon: ImageIcon,
    label: "Gallery View",
    description: "Large image gallery",
  },
] as const;

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  layout,
  onLayoutChange,
}) => {
  return (
    <div className="relative group">
      <div className="flex items-center gap-1 p-1 shadow-xl shadow-black/10 dark:shadow-gray-500/20 border rounded-lg bg-background/80 backdrop-blur-sm transition-all duration-300">
        {layouts.map(item => {
          const Icon = item.icon;
          return (
            <Toggle
              key={item.value}
              pressed={layout === item.value}
              onPressedChange={() => onLayoutChange(item.value)}
              aria-label={item.label}
              className={cn(
                "relative group/item data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                "transition-all duration-300 hover:bg-muted",
                "px-3 py-2 rounded-md",
                "hover:scale-105 active:scale-95"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
              </div>

              {/* Tooltip */}
              <div className="absolute hidden group-hover/item:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-md bg-background border shadow-lg whitespace-nowrap">
                <div className="font-medium">{item.label}</div>
                <div className="text-muted-foreground text-[10px]">
                  {item.description}
                </div>
                {/* Arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-background border-r border-b" />
              </div>
            </Toggle>
          );
        })}
      </div>

      {/* Active Layout Label */}
      {/* <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-medium text-muted-foreground">
          Current: {layouts.find(l => l.value === layout)?.label}
        </span>
      </div> */}
    </div>
  );
};

export default LayoutSwitcher;
