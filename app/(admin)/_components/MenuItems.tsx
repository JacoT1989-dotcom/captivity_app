"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { fetchAllRoleCounts } from "../admin/users/actions";
import { useCollectionsStore } from "../admin/products/_store/useCollectionsStore";
import {
  CollectionCounts,
  MenuItem,
  MenuLink,
  UserCounts,
} from "../admin/products/types";

const INITIAL_USER_COUNTS: UserCounts = {
  pendingApproval: 0,
  customers: 0,
  subscribers: 0,
  promo: 0,
  distributors: 0,
  shopManagers: 0,
  editors: 0,
  vendors: 0,
};

const INITIAL_COLLECTION_COUNTS: CollectionCounts = {
  winter: 0,
  summer: 0,
  camo: 0,
  baseball: 0,
  signature: 0,
  fashion: 0,
  leisure: 0,
  sport: 0,
  african: 0,
  industrial: 0,
};

// Constants outside component to prevent recreation
const TWO_HOURS = 2 * 60 * 60 * 1000;
const MINIMUM_FETCH_INTERVAL = 10000;

export function useMenuItems() {
  const [userCounts, setUserCounts] = useState<UserCounts>(INITIAL_USER_COUNTS);
  const lastFetchTime = useRef<number>(0);
  const isMounted = useRef(true);
  const fetchPromiseRef = useRef<Promise<void> | null>(null);

  // Get collections state from Zustand store
  const { counts: collectionCounts, fetchCollections } = useCollectionsStore();

  const loadCounts = useCallback(
    async (forceRefresh = false) => {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime.current;

      if (
        fetchPromiseRef.current ||
        !isMounted.current ||
        (!forceRefresh && timeSinceLastFetch < MINIMUM_FETCH_INTERVAL)
      ) {
        return;
      }

      lastFetchTime.current = now;

      try {
        const [userResult] = await Promise.all([
          fetchAllRoleCounts(),
          fetchCollections(),
        ]);

        if (!isMounted.current) return;

        if (userResult.success) {
          setUserCounts(prev =>
            JSON.stringify(prev) !== JSON.stringify(userResult.counts)
              ? userResult.counts
              : prev
          );
        }
      } catch (error) {
        console.error("Error loading counts:", error);
      } finally {
        fetchPromiseRef.current = null;
      }
    },
    [fetchCollections]
  );

  useEffect(() => {
    isMounted.current = true;

    loadCounts(true);

    const intervalId = setInterval(() => {
      loadCounts(true);
    }, TWO_HOURS);

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
      fetchPromiseRef.current = null;
    };
  }, [loadCounts]);

  return useMemo<MenuItem[]>(
    () => [
      {
        title: "Users",
        links: [
          {
            name: "Pending Approval",
            href: "/admin/users/update/role-user",
            count: userCounts.pendingApproval,
          },
          {
            name: "Customers",
            href: "/admin/users/update/role-customer",
            count: userCounts.customers,
          },
          {
            name: "Subscribers",
            href: "/admin/users/update/role-subscriber",
            count: userCounts.subscribers,
          },
          {
            name: "Promo Users",
            href: "/admin/users/update/role-promo",
            count: userCounts.promo,
          },
          {
            name: "Distributors",
            href: "/admin/users/update/role-distributors",
            count: userCounts.distributors,
          },
          {
            name: "Shop Managers",
            href: "/admin/users/update/role-shop_manager",
            count: userCounts.shopManagers,
          },
          {
            name: "Editors",
            href: "/admin/users/update/role-editor",
            count: userCounts.editors,
          },
          {
            name: "Vendors",
            href: "/admin/users/update/role-vendor",
            count: userCounts.vendors,
          },
        ],
      },
      {
        title: "Collections",
        links: [
          {
            name: "Winter Collection",
            href: "/admin/products/winter",
            count: collectionCounts.winter,
          },
          {
            name: "Summer Collection",
            href: "/admin/products/summer",
            count: collectionCounts.summer,
          },
          {
            name: "Camo Collection",
            href: "/admin/products/camo",
            count: collectionCounts.camo,
          },
          {
            name: "Baseball Collection",
            href: "/admin/products/baseball",
            count: collectionCounts.baseball,
          },
          {
            name: "Signature Collection",
            href: "/admin/products/signature",
            count: collectionCounts.signature,
          },
          {
            name: "Fashion Collection",
            href: "/admin/products/fashion",
            count: collectionCounts.fashion,
          },
          {
            name: "Leisure Collection",
            href: "/admin/products/leisure",
            count: collectionCounts.leisure,
          },
          {
            name: "Sport Collection",
            href: "/admin/products/sport",
            count: collectionCounts.sport,
          },
          {
            name: "African Collection",
            href: "/admin/products/african",
            count: collectionCounts.african,
          },
          {
            name: "Industrial Collection",
            href: "/admin/products/industrial",
            count: collectionCounts.industrial,
          },
        ],
      },
      {
        title: "Products",
        links: [
          { name: "Add Product", href: "/admin/products/create" },
          { name: "Categories", href: "/admin/products/categories" },
          { name: "Inventory", href: "/admin/products/inventory" },
        ],
      },
      {
        title: "Vendors",
        links: [
          { name: "Vendor Urls", href: "/admin/vendor/url" },
          { name: "Vendor ratings", href: "/admin/vendor/ratings" },
          {
            name: "Vendor Applications",
            href: "/admin/vendor/applications",
          },
          {
            name: "Total Income",
            href: "/admin/vendor/total_income",
          },
        ],
      },
      {
        title: "Orders",
        links: [
          { name: "All Orders", href: "/admin/orders/orders" },
          { name: "Pending Orders", href: "/admin/pendingOrders" },
          { name: "Processing Orders", href: "/admin/orders/processing" },
          { name: "Completed Orders", href: "/admin/orders/completed" },
          { name: "Cancelled Orders", href: "/admin/orders/cancelled" },
          { name: "Returns", href: "/admin/orders/returns" },
        ],
      },
      {
        title: "Customers",
        links: [
          { name: "All Customers", href: "/admin/customers" },
          { name: "Customer Groups", href: "/admin/customers/groups" },
          { name: "Customer Reviews", href: "/admin/customers/reviews" },
          { name: "Loyalty Program", href: "/admin/customers/loyalty" },
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
    [userCounts, collectionCounts]
  );
}

export type { MenuItem, MenuLink };
