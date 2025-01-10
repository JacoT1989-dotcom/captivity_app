"use client";

import { OrderStatus } from "@prisma/client";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

interface OrderFiltersProps {
  onStatusChange: (status: OrderStatus | "ALL") => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
}

export function OrderFilters({
  onStatusChange,
  onDateRangeChange,
  dateRange,
}: OrderFiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="shadow-2xl shadow-black">
        <Select
          onValueChange={(value: string) =>
            onStatusChange(value as OrderStatus | "ALL")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(OrderStatus).map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="shadow-2xl shadow-black">
        <DatePickerWithRange value={dateRange} onChange={onDateRangeChange} />
      </div>
    </div>
  );
}
