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
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const { user } = useSession();
  const pathname = usePathname();
  const menuItems = useMenuItems();

  const toggleDropdown = useCallback((index: number) => {
    setOpenDropdowns(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  const toggleSubMenu = useCallback((title: string) => {
    setOpenSubMenus(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const getDropdownClasses = useCallback((isOpen: boolean) => {
    return `transition-all duration-200 ease-in-out bg-gray-800 ${
      isOpen ? "" : "h-0"
    } overflow-hidden`;
  }, []);

  const renderLink = useCallback(
    (link: MenuLink, isSubItem = false) => {
      const isActive = pathname === link.href;
      return (
        <Link
          href={link.href}
          className={`block ${isSubItem ? "px-8" : "px-6"} py-2 text-sm transition-colors duration-200 relative ${
            isActive
              ? "bg-gray-700 text-white border-l-4 border-blue-500"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{link.name}</span>
            {typeof link.count !== "undefined" && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {link.count}
              </span>
            )}
          </div>
        </Link>
      );
    },
    [pathname]
  );

  const renderSubMenu = useCallback(
    (subMenu: MenuItem, parentTitle: string) => {
      const isSubMenuOpen = openSubMenus.includes(subMenu.title);

      return (
        <div key={`${parentTitle}-${subMenu.title}`} className="pl-2">
          <button
            onClick={() => toggleSubMenu(subMenu.title)}
            className={`w-full px-6 py-2 flex items-center justify-between text-sm transition-colors duration-200 ${
              isSubMenuOpen
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <span>{subMenu.title}</span>
            <div className="text-gray-400">
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
    [openSubMenus, getDropdownClasses, toggleSubMenu, renderLink]
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
        <div className="w-0 overflow-hidden flex flex-col bg-gray-900" />
        <button
          onClick={toggleSidebar}
          className="absolute top-4 -right-10 bg-gray-900 text-white p-2 rounded-r hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
          aria-label="Open sidebar"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex">
      <div className="w-[300px] bg-gray-900 text-white flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* User Welcome Section */}
            <div className="mb-6 px-2">
              <h2 className="text-xl font-bold text-gray-200">
                Welcome, {user.username}
              </h2>
              <p className="text-sm text-gray-400 mt-1">Administrator</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-700 my-4" />

            <nav className="space-y-1">
              {menuItems.map((item, index) => {
                const isDropdownOpen = openDropdowns.includes(index);

                return (
                  <div key={`${item.title}-${index}`}>
                    <div className="rounded-md">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className={`w-full p-3 flex items-center justify-between hover:bg-gray-800 transition-colors duration-200 ${
                          isDropdownOpen ? "bg-gray-800" : ""
                        }`}
                      >
                        <span className="font-medium text-gray-200">
                          {item.title}
                        </span>
                        <div className="text-gray-400">
                          {isDropdownOpen ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </button>

                      <div className={getDropdownClasses(isDropdownOpen)}>
                        <div className="max-h-48 overflow-y-auto">
                          {item.links.map((link, idx) => (
                            <div key={`${item.title}-link-${idx}`}>
                              {renderMenuContent(link, item.title)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < menuItems.length - 1 && (
                      <div className="h-px bg-gray-700 my-1" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute top-4 -right-10 bg-gray-900 text-white p-2 rounded-r hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
        aria-label="Close sidebar"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};

export default CollapsibleSidebar;
