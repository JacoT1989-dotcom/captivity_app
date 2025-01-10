"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { User } from "@prisma/client";

interface TableProps {
  customers: Partial<User>[];
  sortField: keyof User;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof User) => void;
}

export function VendorCustomersTable({
  customers,
  sortField,
  sortDirection,
  onSort,
}: TableProps) {
  const SortIcon = ({ field }: { field: keyof User }) => {
    if (sortField !== field)
      return <ChevronDown className="w-4 h-4 text-muted-foreground" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:text-accent-foreground"
              onClick={() => onSort("companyName")}
            >
              <div className="flex items-center gap-1">
                Company
                <SortIcon field="companyName" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-accent-foreground"
              onClick={() => onSort("email")}
            >
              <div className="flex items-center gap-1">
                Email
                <SortIcon field="email" />
              </div>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead
              className="cursor-pointer hover:text-accent-foreground"
              onClick={() => onSort("createdAt")}
            >
              <div className="flex items-center gap-1">
                Joined
                <SortIcon field="createdAt" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(customer => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                {customer.companyName}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                <span className="text-foreground">
                  {customer.firstName} {customer.lastName}
                </span>
                <br />
                <span className="text-sm text-muted-foreground">
                  {customer.phoneNumber}
                </span>
              </TableCell>
              <TableCell>
                {customer.createdAt &&
                  new Date(customer.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {customers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No customers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
