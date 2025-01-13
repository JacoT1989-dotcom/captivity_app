"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

interface MobileDropdownProps {
  title: string;
  href: string; // Add href for the parent link
  items: NavItem[];
  onItemClick?: () => void;
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({
  title,
  href,
  items,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <div className="flex items-center">
        <Link
          href={href}
          className="flex-1 px-4 py-3 hover:bg-muted text-foreground"
          onClick={onItemClick}
        >
          {title}
        </Link>
        <button
          className="px-4 py-3 hover:bg-muted text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      {isOpen && (
        <ul className="bg-muted/50">
          {items.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-6 py-2 text-sm hover:bg-muted text-muted-foreground hover:text-foreground"
                onClick={onItemClick}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MobileDropdown;
