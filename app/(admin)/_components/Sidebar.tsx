"use client";

import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSession } from "../SessionProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenuItems } from "./MenuItems";
import type { MenuItem, MenuLink } from "./MenuItems";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const { user } = useSession();
  const pathname = usePathname();
  const menuItems = useMenuItems();

  const toggleDropdown = useCallback((index: number) => {
    setActiveDropdown(prev => (prev === index ? null : index));
    setActiveSubMenu(null);
  }, []);

  const toggleSubMenu = useCallback((title: string) => {
    setActiveSubMenu(prev => (prev === title ? null : title));
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const getDropdownClasses = useCallback((isOpen: boolean) => {
    return `transition-all duration-300 ease-in-out ${
      isOpen ? "max-h-[60vh] overflow-y-auto" : "max-h-0"
    } overflow-hidden`;
  }, []);

  const renderLink = useCallback(
    (link: MenuLink, isSubItem = false) => {
      const isActive = pathname === link.href;
      return (
        <Link
          href={link.href}
          className={`block ${
            isSubItem ? "pl-12" : "pl-8"
          } pr-4 py-2.5 text-sm transition-all duration-200 relative ${
            isActive
              ? "bg-primary/10 text-primary border-l-2 border-primary font-medium"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          }`}
        >
          <span>{link.name}</span>
        </Link>
      );
    },
    [pathname]
  );

  const renderSubMenu = useCallback(
    (subMenu: MenuItem, parentTitle: string) => {
      const isSubMenuOpen = activeSubMenu === subMenu.title;

      return (
        <div key={`${parentTitle}-${subMenu.title}`}>
          <button
            onClick={() => toggleSubMenu(subMenu.title)}
            className={`w-full pl-8 pr-4 py-2.5 flex items-center justify-between text-sm transition-all duration-200 ${
              isSubMenuOpen
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <span>{subMenu.title}</span>
            <div className="text-muted-foreground">
              {isSubMenuOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </button>

          <div className={getDropdownClasses(isSubMenuOpen)}>
            {subMenu.links.map((link, idx) => (
              <div key={`${subMenu.title}-${idx}`}>
                {renderLink(link as MenuLink, true)}
              </div>
            ))}
          </div>
        </div>
      );
    },
    [activeSubMenu, getDropdownClasses, toggleSubMenu, renderLink]
  );

  const renderMenuContent = useCallback(
    (item: MenuItem | MenuLink, parentTitle: string) => {
      if ("links" in item) {
        return renderSubMenu(item as MenuItem, parentTitle);
      }
      return renderLink(item as MenuLink);
    },
    [renderLink, renderSubMenu]
  );

  if (!isOpen) {
    return (
      <div className="relative h-full flex">
        <div className="w-0 overflow-hidden flex flex-col bg-background border-r" />
        <button
          onClick={toggleSidebar}
          className="absolute top-4 -right-10 bg-background text-muted-foreground p-2 rounded-r border hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Open sidebar"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex">
      <div className="w-[280px] bg-background border-r flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto select-scroll">
          <div className="p-6">
            {/* User Welcome Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground">
                Welcome back,
              </h2>
              <div className="flex items-center mt-2">
                <span className="text-xl font-bold text-foreground">
                  {user.displayName}
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Admin
                </span>
              </div>
            </div>

            <nav className="space-y-0.5">
              {menuItems.map((item, index) => {
                const isDropdownOpen = activeDropdown === index;

                return (
                  <div key={`${item.title}-${index}`}>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-200 rounded-md ${
                        isDropdownOpen
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <span className="font-medium">{item.title}</span>
                      <div
                        className={`text-muted-foreground transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      >
                        <ChevronDown size={18} />
                      </div>
                    </button>

                    <div className={getDropdownClasses(isDropdownOpen)}>
                      {item.links.map((link, idx) => (
                        <div key={`${item.title}-link-${idx}`}>
                          {renderMenuContent(link, item.title)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-10 bg-background text-muted-foreground p-2 rounded-r border hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Close sidebar"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};

export default CollapsibleSidebar;
