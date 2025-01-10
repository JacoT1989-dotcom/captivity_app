"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchFieldProps {
  onSearch: (query: string) => void;
}

export default function SearchField({ onSearch }: SearchFieldProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    onSearch(q);
    if (!q) {
      <div className="flex items-center justify-center h-full text-red-400">
        <p>Product not found</p>
      </div>;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
