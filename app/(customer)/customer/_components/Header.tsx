"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    router.push("/customer/shopping/product_categories/summer");
  };

  // Reset loading state when component unmounts
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <header className="text-center mb-8 bg-gradient-to-r mt-5 from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-2">Instant Purchase Power</h1>
      <p className="text-xl mb-4">
        Unlock the Speed of Our Quick Order Page Today!
      </p>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className="mt-2 bg-green-500 hover:bg-green-600 text-white relative"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Quick Order"
        )}
      </Button>
    </header>
  );
};

export default Header;
