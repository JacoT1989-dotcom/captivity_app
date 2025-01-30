// ScrollIndicator.tsx
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ScrollIndicatorProps {
  totalProducts: number;
  currentlyVisible: number;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  totalProducts,
  currentlyVisible,
}) => {
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      // Show scroll down when not at bottom and there are more products
      setShowScrollDown(scrolled < 100 && currentlyVisible < totalProducts);

      // Show scroll up when near bottom
      setShowScrollUp(scrolled + viewportHeight >= totalHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentlyVisible, totalProducts]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll Down Indicator */}
      {showScrollDown && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className="bg-primary/80 backdrop-blur-sm text-primary-foreground rounded-full p-3 shadow-lg cursor-pointer hover:bg-primary transition-colors duration-200 flex items-center gap-2"
            onClick={scrollDown}
          >
            <span className="text-sm font-medium">more</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>
      )}

      {/* Scroll Up Indicator */}
      {showScrollUp && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className="bg-primary/80 backdrop-blur-sm text-primary-foreground rounded-full p-3 shadow-lg cursor-pointer hover:bg-primary transition-colors duration-200 flex items-center gap-2"
            onClick={scrollToTop}
          >
            <span className="text-sm font-medium">Back to top</span>
            <ChevronUp className="h-6 w-6" />
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollIndicator;
