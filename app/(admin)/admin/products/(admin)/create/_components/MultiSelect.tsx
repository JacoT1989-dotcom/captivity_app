"use client";
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(value.filter(i => i !== item));
  };

  const handleSelect = (item: string) => {
    setInputValue("");
    if (value.includes(item)) {
      onChange(value.filter(i => i !== item));
    } else {
      onChange([...value, item]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && value.length > 0) {
          onChange(value.slice(0, -1));
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={cn(
        "overflow-visible bg-white border border-input rounded-md",
        className
      )}
    >
      <div className="flex flex-wrap gap-1 p-2">
        {value.map(item => (
          <Badge key={item} variant="secondary" className="hover:bg-secondary">
            {item}
            <button
              className="ml-1 hover:bg-secondary-hover rounded-full outline-none"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleUnselect(item);
                }
              }}
              onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => handleUnselect(item)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <CommandPrimitive.Input
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder="Select categories..."
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] text-sm"
        />
      </div>
      <div className="relative mt-2">
        {open && (
          <div className="absolute top-0 z-10 w-full bg-popover rounded-md border border-input shadow-md">
            <CommandGroup className="h-full overflow-auto max-h-[200px]">
              {options.map(option => (
                <CommandItem
                  key={option}
                  onSelect={() => handleSelect(option)}
                  className={cn(
                    "cursor-pointer",
                    value.includes(option) && "bg-secondary"
                  )}
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  );
}
