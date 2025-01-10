"use client";

import React from "react";
import { redirect, useRouter } from "next/navigation";
import {
  ChevronRight,
  Users,
  Star,
  Gift,
  Truck,
  Store,
  Edit,
  Shield,
  LucideIcon,
} from "lucide-react";

interface PanelItem {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

const panels: PanelItem[] = [
  {
    name: "Customer Panel",
    path: "/customer",
    icon: Users,
    description: "Manage customer accounts and interactions",
  },
  {
    name: "Subscriber Panel",
    path: "/subscriber",
    icon: Star,
    description: "Handle subscription and member services",
  },
  {
    name: "Promo Panel",
    path: "/promo",
    icon: Gift,
    description: "Control promotional campaigns and offers",
  },
  {
    name: "Distributor Panel",
    path: "/distributor",
    icon: Truck,
    description: "Oversee distribution networks",
  },
  {
    name: "Shop Manager Panel",
    path: "/shop",
    icon: Store,
    description: "Manage store operations",
  },
  {
    name: "Editor Panel",
    path: "/editor",
    icon: Edit,
    description: "Content management and editing",
  },
  {
    name: "Admin Panel",
    path: "/admin",
    icon: Shield,
    description: "System administration and settings",
  },
];

export default function SelectPanel() {
  const router = useRouter();

  const handlePanelSelect = (path: string): void => {
    const role = path.substring(1).toUpperCase();
    router.push(`${path}?as=${role}`);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl shadow-black w-full max-w-5xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Administration Hub
          </h1>
          <p className="text-gray-500">
            Select a panel to access different management areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {panels.map(({ name, path, icon: Icon, description }) => (
            <button
              key={path}
              onClick={() => handlePanelSelect(path)}
              className="group flex flex-col p-4 rounded-lg border border-gray-400 hover:border-blue-500 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="font-medium text-gray-900">{name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">{description}</p>
              <div className="mt-auto flex justify-end">
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-blue-500 transition-colors"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
