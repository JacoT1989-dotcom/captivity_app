"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface VendorSearchBarProps {
  isAuthenticated?: boolean;
}

export const VendorSearchBar = ({ isAuthenticated }: VendorSearchBarProps) => {
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(`/vendor/${vendorWebsite}/login`);
      return;
    }

    setIsSearching(true);
    try {
      router.push(
        `/vendor/${vendorWebsite}/searchLandingPage?q=${encodeURIComponent(query.trim())}`
      );
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const isDisabled = !isAuthenticated;
  const isButtonDisabled = isSearching || !query.trim() || isDisabled;

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={
          isAuthenticated
            ? "Search vendor products..."
            : "Login to search products"
        }
        className="flex-1 text-foreground"
        disabled={isSearching || isDisabled}
      />
      <Button
        type="submit"
        disabled={isButtonDisabled}
        variant="destructive"
        size="default"
      >
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search
          </>
        )}
      </Button>
    </form>
  );
};
