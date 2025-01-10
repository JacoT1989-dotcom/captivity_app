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
  items: NavItem[];
  onItemClick?: () => void;
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({
  title,
  items,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        className="w-full px-4 py-3 flex justify-between items-center hover:bg-muted text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-left">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </button>
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
