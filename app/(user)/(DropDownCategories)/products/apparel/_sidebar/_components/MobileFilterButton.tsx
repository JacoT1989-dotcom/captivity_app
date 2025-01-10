import { Filter } from "lucide-react";

// MobileFilterButton.tsx
interface MobileFilterButtonProps {
  onClick: () => void;
}

const MobileFilterButton: React.FC<MobileFilterButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center bg-white rounded-full px-6 py-3 shadow-lg"
  >
    <Filter className="w-5 h-5 mr-2" />
    <span className="font-medium text-sm">Filters</span>
  </button>
);
