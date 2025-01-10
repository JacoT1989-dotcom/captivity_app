"use client";

import React, { useState, useMemo, useCallback } from "react";
import { User } from "lucide-react";
import { UserRole } from "@prisma/client";
import UserRoleSelect from "./UserRoleSelect";
import SearchField from "@/app/(admin)/_components/SearchField";
import _ from "lodash";

interface UserType {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  role: UserRole;
  createdAt: Date;
}

interface UserTableProps {
  users: UserType[];
  title: string;
}

const USERS_PER_PAGE = 10;

const UserTable = ({ users, title }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof UserType>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortUsers = useCallback(
    (usersToSort: UserType[]) => {
      return [...usersToSort].sort((a, b) => {
        if (sortField === "createdAt") {
          const dateA = new Date(a[sortField]).getTime();
          const dateB = new Date(b[sortField]).getTime();
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        }

        const valueA = String(a[sortField]).toLowerCase();
        const valueB = String(b[sortField]).toLowerCase();

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    },
    [sortField, sortDirection]
  );

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return sortUsers(users);

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = users.filter(user => {
      const searchFields = [
        user.displayName,
        user.firstName,
        user.lastName,
        user.email,
        user.companyName,
      ];

      return searchFields.some(field =>
        field?.toLowerCase().includes(lowerSearch)
      );
    });

    return sortUsers(filtered);
  }, [users, searchTerm, sortUsers]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  }, []);

  const debouncedSearch = useMemo(
    () => _.debounce(handleSearch, 300),
    [handleSearch]
  );

  const handleSort = (field: keyof UserType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIndicator = ({ field }: { field: keyof UserType }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {filteredUsers.length} users total
          </div>
          <div className="w-72">
            <SearchField onSearch={debouncedSearch} initialValue={searchTerm} />
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
          {searchTerm
            ? `No ${title.toLowerCase()} found matching "${searchTerm}"`
            : `No ${title.toLowerCase()} to display at this time`}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("displayName")}
                  >
                    User
                    <SortIndicator field="displayName" />
                  </th>
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("role")}
                  >
                    Role
                    <SortIndicator field="role" />
                  </th>
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("companyName")}
                  >
                    Company
                    <SortIndicator field="companyName" />
                  </th>
                  <th
                    className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At
                    <SortIndicator field="createdAt" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <User className="w-full h-full rounded-full text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {user.displayName ||
                              `${user.firstName} ${user.lastName}`}
                          </p>
                          <p className="text-gray-600 whitespace-no-wrap">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <UserRoleSelect
                        userId={user.id}
                        initialRole={user.role}
                      />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {user.companyName}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(user.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length)}
                </span>{" "}
                of <span className="font-medium">{filteredUsers.length}</span>{" "}
                results
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {totalPages <= 7 ? (
                [...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 bg-white hover:bg-gray-50"
                    } border border-gray-300 rounded-md`}
                  >
                    {index + 1}
                  </button>
                ))
              ) : (
                <>
                  {[
                    1,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    totalPages,
                  ]
                    .filter(
                      (page, index, array) =>
                        page > 0 &&
                        page <= totalPages &&
                        array.indexOf(page) === index
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 py-2">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "text-gray-700 bg-white hover:bg-gray-50"
                          } border border-gray-300 rounded-md`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </>
              )}
              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserTable;
