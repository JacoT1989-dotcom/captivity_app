import { Bell, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserButton from "@/app/(vendor)/_components/UserButton";

export function Header() {
  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 right-0 h-20 flex items-center justify-between border-b px-4 lg:px-4 bg-background z-40 lg:left-64 left-0">
        <div className="flex flex-1 items-center gap-4 lg:ml-0 ml-12">
          <div className="relative flex w-full max-w-96 items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search here..." className="pl-9 w-full" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 gap-1 text-muted-foreground hidden sm:flex"
            >
              K
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:text-foreground/80"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <UserButton />
        </div>
      </header>

      {/* Spacer div to prevent content from going under header */}
      <div className="h-20" />
    </>
  );
}
