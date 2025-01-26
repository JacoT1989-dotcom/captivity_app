"use client";

import { useMemo } from "react";

interface MenuLink {
  name: string;
  href: string;
}

interface MenuItem {
  title: string;
  links: (MenuLink | MenuItem)[];
  isSubmenu?: boolean;
}

export function useMenuItems() {
  return useMemo<MenuItem[]>(
    () => [
      {
        title: "E-commerce",
        links: [
          {
            title: "Customers",
            isSubmenu: true,
            links: [
              {
                name: "Pending Approval",
                href: "/admin/users/update/role-user",
              },
              {
                name: "Customers",
                href: "/admin/users/update/role-customer",
              },
              {
                name: "Subscribers",
                href: "/admin/users/update/role-subscriber",
              },
              {
                name: "Promo Users",
                href: "/admin/users/update/role-promo",
              },
              {
                name: "Distributors",
                href: "/admin/users/update/role-distributors",
              },
              {
                name: "Shop Managers",
                href: "/admin/users/update/role-shop_manager",
              },
              {
                name: "Editors",
                href: "/admin/users/update/role-editor",
              },
              {
                name: "Vendors",
                href: "/admin/users/update/role-vendor",
              },
            ],
          },
          {
            title: "Orders",
            isSubmenu: true,
            links: [
              {
                name: "All Orders",
                href: "/admin/orders/orders",
              },
              {
                name: "Pending Orders",
                href: "/admin/pendingOrders",
              },
              {
                name: "Processing Orders",
                href: "/admin/orders/processing",
              },
              {
                name: "Shipped Orders",
                href: "/admin/orders/shipped",
              },
              {
                name: "Delivered Orders",
                href: "/admin/orders/completed",
              },
              {
                name: "Cancelled Orders",
                href: "/admin/orders/cancelled",
              },
              {
                name: "Refunded Orders",
                href: "/admin/orders/refunded",
              },
            ],
          },
          {
            title: "Collections",
            isSubmenu: true,
            links: [
              {
                name: "Winter Collection",
                href: "/admin/products/winter",
              },
              {
                name: "Summer Collection",
                href: "/admin/products/summer",
              },
              {
                name: "Camo Collection",
                href: "/admin/products/camo",
              },
              {
                name: "Baseball Collection",
                href: "/admin/products/baseball",
              },
              {
                name: "Signature Collection",
                href: "/admin/products/signature",
              },
              {
                name: "Fashion Collection",
                href: "/admin/products/fashion",
              },
              {
                name: "Leisure Collection",
                href: "/admin/products/leisure",
              },
              {
                name: "Sport Collection",
                href: "/admin/products/sport",
              },
              {
                name: "African Collection",
                href: "/admin/products/african",
              },
              {
                name: "Industrial Collection",
                href: "/admin/products/industrial",
              },
            ],
          },
          {
            title: "Products",
            isSubmenu: true,
            links: [
              { name: "Add Product", href: "/admin/products/create" },
              { name: "Update Stock Levels", href: "/admin/products/update" },
            ],
          },
        ],
      },
      {
        title: "Warehouse",
        links: [
          {
            title: "Inventory",
            isSubmenu: true,
            links: [
              {
                name: "Stock Levels",
                href: "/admin/warehouse/inventory/levels",
              },
              {
                name: "Stock History",
                href: "/admin/warehouse/inventory/history",
              },
            ],
          },
          {
            title: "Stock Management",
            isSubmenu: true,
            links: [
              { name: "Receiving", href: "/admin/warehouse/stock/receiving" },
              {
                name: "Transfer Orders",
                href: "/admin/warehouse/stock/transfers",
              },
              { name: "Pick Lists", href: "/admin/warehouse/stock/picklists" },
            ],
          },
          {
            title: "Supplies",
            isSubmenu: true,
            links: [
              {
                name: "Purchase Orders",
                href: "/admin/warehouse/supplies/orders",
              },
              {
                name: "Suppliers",
                href: "/admin/warehouse/supplies/suppliers",
              },
              { name: "Supply Chain", href: "/admin/warehouse/supplies/chain" },
            ],
          },
        ],
      },
      {
        title: "Representative",
        links: [
          {
            title: "Meetings",
            isSubmenu: true,
            links: [
              {
                name: "Schedule",
                href: "/admin/representative/meetings/schedule",
              },
              {
                name: "Minutes",
                href: "/admin/representative/meetings/minutes",
              },
              {
                name: "Follow-ups",
                href: "/admin/representative/meetings/followups",
              },
            ],
          },
          {
            title: "Kanban Board",
            isSubmenu: true,
            links: [
              { name: "Tasks", href: "/admin/representative/kanban/tasks" },
              { name: "Sprints", href: "/admin/representative/kanban/sprints" },
              {
                name: "Analytics",
                href: "/admin/representative/kanban/analytics",
              },
            ],
          },
          {
            title: "Client Management",
            isSubmenu: true,
            links: [
              {
                name: "Contacts",
                href: "/admin/representative/clients/contacts",
              },
              {
                name: "Opportunities",
                href: "/admin/representative/clients/opportunities",
              },
              {
                name: "History",
                href: "/admin/representative/clients/history",
              },
            ],
          },
        ],
      },
      {
        title: "Vendors",
        links: [
          { name: "Vendor Urls", href: "/admin/vendor/url" },
          { name: "Vendor ratings", href: "/admin/vendor/ratings" },
          { name: "Vendor Applications", href: "/admin/vendor/applications" },
          { name: "Total Income", href: "/admin/vendor/total_income" },
        ],
      },
      {
        title: "Marketing",
        links: [
          { name: "Promotions", href: "/admin/marketing/promotions" },
          { name: "Discounts", href: "/admin/marketing/discounts" },
          { name: "Coupons", href: "/admin/marketing/coupons" },
          { name: "Email Campaigns", href: "/admin/marketing/email" },
          { name: "Social Media", href: "/admin/marketing/social" },
          { name: "Analytics", href: "/admin/marketing/analytics" },
        ],
      },
      {
        title: "Settings",
        links: [
          { name: "General", href: "/admin/settings" },
          { name: "Security", href: "/admin/settings/security" },
          { name: "Shipping", href: "/admin/settings/shipping" },
          { name: "Payment", href: "/admin/settings/payment" },
          { name: "Taxes", href: "/admin/settings/taxes" },
          { name: "Notifications", href: "/admin/settings/notifications" },
          { name: "API", href: "/admin/settings/api" },
        ],
      },
      {
        title: "Reports",
        links: [
          { name: "Sales Report", href: "/admin/reports/sales" },
          { name: "Inventory Report", href: "/admin/reports/inventory" },
          { name: "Customer Report", href: "/admin/reports/customers" },
          { name: "Financial Report", href: "/admin/reports/financial" },
          { name: "Marketing Report", href: "/admin/reports/marketing" },
          { name: "Export Data", href: "/admin/reports/export" },
        ],
      },
      {
        title: "Help & Support",
        links: [
          { name: "Documentation", href: "/admin/help/docs" },
          { name: "FAQs", href: "/admin/help/faqs" },
          { name: "Contact Support", href: "/admin/help/support" },
          { name: "System Status", href: "/admin/help/status" },
        ],
      },
    ],
    []
  );
}

export type { MenuItem, MenuLink };
