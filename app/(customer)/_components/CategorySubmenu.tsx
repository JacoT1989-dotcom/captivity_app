// CategorySubmenu.tsx
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavItem } from "./categoriesData";

interface CategorySubmenuProps {
  items: NavItem[];
  pathname: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CategorySubmenu: React.FC<CategorySubmenuProps> = ({ items, pathname, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="absolute top-full mt-1 w-56 rounded-md bg-background shadow-lg z-10"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map((item) => {
        const isActive = pathname ? pathname.startsWith(item.href) : false;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="inline-block mr-2 h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default CategorySubmenu;