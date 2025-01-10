import React from "react";
import { LayoutGrid, List, Image, ImageIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface LayoutSwitcherProps {
  layout: "grid" | "detail" | "gallery";
  onLayoutChange: (layout: "grid" | "detail" | "gallery") => void;
}

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  layout,
  onLayoutChange,
}) => {
  return (
    <div className="flex items-center shadow-2xl z-10 shadow-black dark:shadow-gray-500 border rounded-lg">
      <Toggle
        pressed={layout === "grid"}
        onPressedChange={() => onLayoutChange("grid")}
        aria-label="Grid layout"
        className={`${
          layout === "grid"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={layout === "detail"}
        onPressedChange={() => onLayoutChange("detail")}
        aria-label="Detail layout"
        className={`${
          layout === "detail"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={layout === "gallery"}
        onPressedChange={() => onLayoutChange("gallery")}
        aria-label="Gallery layout"
        className={`${
          layout === "gallery"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
      >
        <ImageIcon className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default LayoutSwitcher;
