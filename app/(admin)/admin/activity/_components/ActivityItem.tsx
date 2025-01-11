import { FC } from "react";
import { Activity as ActivityIcon } from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { Activity } from "../types";

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem: FC<ActivityItemProps> = ({ activity }) => {
  const getActivityColor = (type: string): string => {
    switch (type) {
      case "ORDER":
        return "#3B82F6";
      case "USER":
        return "#8B5CF6";
      case "PRODUCT":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const color = getActivityColor(activity.type);

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors">
      <div
        className="mt-1 p-2 rounded-full bg-opacity-20"
        style={{ backgroundColor: color }}
      >
        <ActivityIcon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(activity.createdAt), {
            addSuffix: true,
          })}
        </p>
        <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
      </div>
    </div>
  );
};
