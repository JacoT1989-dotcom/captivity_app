"use client";
import React, { useEffect, useCallback, useRef, memo } from "react";
import {
  Activity,
  Users,
  Box,
  ShoppingCart,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useUserStatsStore } from "./useUserStatsStore";

// Interfaces
interface Stats {
  totalCustomers: number;
  pendingRegistrations: number;
  activeUserSessions: number;
  newlyUpgradedCustomers: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
}

interface BaseQuickActionProps {
  title: string;
  description: string;
  gradient: string;
}

interface LinkQuickActionProps extends BaseQuickActionProps {
  href: string;
  onClick?: never;
}

interface ButtonQuickActionProps extends BaseQuickActionProps {
  onClick: () => void;
  href?: never;
}

type QuickActionProps = LinkQuickActionProps | ButtonQuickActionProps;

interface ActivityItemProps {
  activity: {
    title: string;
    time: string;
    description: string;
    color: string;
  };
}

// Memoized stat card component
const StatCard = memo<StatCardProps>(
  ({ title, value, icon: Icon, gradient }) => (
    <Card className="transform transition-all hover:scale-105 hover:shadow-lg">
      <CardHeader
        className={`flex flex-row items-center justify-between pb-2 space-y-0 ${gradient} text-white rounded-t-lg`}
      >
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-white/80" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-3xl font-bold tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      </CardContent>
    </Card>
  )
);

StatCard.displayName = "StatCard";

// Memoized quick action button component
const QuickActionButton = memo<QuickActionProps>(
  ({ title, description, gradient, onClick, href }) => {
    const content = (
      <>
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
        <p className="text-sm">{description}</p>
      </>
    );

    const className = `p-6 w-full text-left transition-all ${gradient} rounded-xl hover:shadow-md`;

    if (href) {
      return (
        <Link className={className} href={href}>
          {content}
        </Link>
      );
    }

    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }
);

QuickActionButton.displayName = "QuickActionButton";

// Memoized activity item component
const ActivityItem = memo<ActivityItemProps>(({ activity }) => (
  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors">
    <div
      className="mt-1 p-2 rounded-full bg-opacity-20"
      style={{
        backgroundColor: activity.color === "blue" ? "#3B82F6" : "#8B5CF6",
      }}
    >
      <Activity
        className="w-4 h-4"
        style={{
          color: activity.color === "blue" ? "#3B82F6" : "#8B5CF6",
        }}
      />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
      <p className="text-xs text-gray-500">{activity.time}</p>
      <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
    </div>
  </div>
));

ActivityItem.displayName = "ActivityItem";

const AdminPanel: React.FC = () => {
  const { stats, isLoading, error, fetchStats } = useUserStatsStore();
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(false);

  // Stable fetch implementation
  const fetchStatsOnce = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      await fetchStats();
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, [fetchStats]);

  useEffect(() => {
    mountedRef.current = true;

    // Initial fetch
    fetchStatsOnce();

    // Set up interval
    fetchTimeoutRef.current = setInterval(fetchStatsOnce, 5 * 60 * 1000);

    return () => {
      mountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearInterval(fetchTimeoutRef.current);
      }
    };
  }, [fetchStatsOnce]);

  const statCards: StatCardProps[] = [
    {
      title: "Total Customers",
      value: isLoading ? "Loading..." : (stats?.totalCustomers ?? 0),
      icon: Users,
      gradient: "bg-gradient-to-br from-violet-500 to-violet-700",
    },
    {
      title: "Pending Registrations",
      value: isLoading ? "Loading..." : (stats?.pendingRegistrations ?? 0),
      icon: ShoppingCart,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      title: "Active Sessions",
      value: isLoading ? "Loading..." : (stats?.activeUserSessions ?? 0),
      icon: Box,
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    },
    {
      title: "New Customers",
      value: isLoading ? "Loading..." : (stats?.newlyUpgradedCustomers ?? 0),
      icon: AlertCircle,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-700",
    },
  ];

  const quickActions: (LinkQuickActionProps | ButtonQuickActionProps)[] = [
    {
      title: "View Pending Orders",
      description: "Handle new customer orders",
      gradient:
        "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200",
      onClick: () => console.log("Handle pending orders"),
    },
    {
      title: "Create Product",
      description: "Create a new product",
      gradient:
        "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200",
      href: "/admin/products/create",
    },
    {
      title: "Generate Report",
      description: "Report to the Distributor",
      gradient:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200",
      onClick: () => console.log("Generate report"),
    },
  ];

  const activities = [
    {
      title: "New order received",
      time: "2 minutes ago",
      description: "Order #1234 received from Customer A",
      color: "blue",
    },
    {
      title: "Project update",
      time: "1 hour ago",
      description: "Website redesign progress at 75%",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 mx-auto max-w-7xl">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {quickActions.map((action, index) => (
                <QuickActionButton key={index} {...action} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;
