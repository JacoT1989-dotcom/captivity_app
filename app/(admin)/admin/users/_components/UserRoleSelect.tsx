"use client";

import React, { useState } from "react";
import { UserRole } from "@prisma/client";
import { updateUserRole } from "../actions";

interface UserRoleSelectProps {
  userId: string;
  initialRole: UserRole;
}

const UserRoleSelect: React.FC<UserRoleSelectProps> = ({
  userId,
  initialRole,
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setRole(newRole);
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateUserRole(userId, newRole);
      if (!result.success) {
        throw new Error(result.error);
      }
      // Reload the page after successful update to refresh all counts
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setRole(initialRole); // Revert to the initial role if there's an error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={role}
        onChange={handleRoleChange}
        disabled={isUpdating}
        className={`
          block w-full px-3 py-2 text-sm
          bg-background border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
      >
        <option value={UserRole.USER}>User</option>
        <option value={UserRole.CUSTOMER}>Customer</option>
        <option value={UserRole.SUBSCRIBER}>Subscriber</option>
        <option value={UserRole.PROMO}>Promo User</option>
        <option value={UserRole.DISTRIBUTOR}>Distributor</option>
        <option value={UserRole.SHOPMANAGER}>Shop Manager</option>
        <option value={UserRole.EDITOR}>Editor</option>
        <option value={UserRole.VENDOR}>Vendor</option>
      </select>

      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-spin border-t-transparent" />
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default UserRoleSelect;
