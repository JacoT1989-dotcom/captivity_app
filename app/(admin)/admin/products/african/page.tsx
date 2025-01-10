import { FaBaseballBall } from "react-icons/fa";
import { TbBallBaseball } from "react-icons/tb";
import ProductsPage from "./ProductTablePage";

interface ThemeColors {
  primary: string;
  hover: string;
  text?: string;
  accent?: string;
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface BaseballIconProps {
  className?: string;
}

const africanTheme: ThemeColors = {
  primary: "#B45309",    // Earth brown
  hover: "#D97706",      // Warm amber
  text: "#FEF3C7",      // Light sand
  accent: "#92400E",    // Deep ochre
};

const AfricanTablePage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 rounded-lg bg-gradient-to-br from-amber-800 via-amber-700 to-yellow-900 p-6 shadow-lg">
          {/* Title and Icons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="relative">
              <FaBaseballBall className="h-8 w-8 text-amber-100" />
              <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">
              African Collection 2024
            </h1>
            <div className="relative">
              <TbBallBaseball className="h-8 w-8 text-amber-100" />
              <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatsCard
              title="New Arrivals"
              value="24 Products"
              icon={<BaseballIcon className="h-6 w-6 text-amber-600" />}
            />
            <StatsCard
              title="Featured Items"
              value="12 Products"
              icon={<BaseballIcon className="h-6 w-6 text-amber-600" />}
            />
            <StatsCard
              title="Limited Edition"
              value="6 Products"
              icon={<BaseballIcon className="h-6 w-6 text-amber-600" />}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-black/5">
          <ProductsPage themeColors={africanTheme} />
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 transform">
      <div className="absolute inset-0 opacity-10">
        <FaBaseballBall className="h-full w-full text-amber-800" />
      </div>
    </div>
    <div className="relative">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="mt-4 text-2xl font-semibold text-amber-800">{value}</div>
    </div>
  </div>
);

const BaseballIcon: React.FC<BaseballIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M4.93 4.93c4.08 4.08 10.06 4.08 14.14 0M4.93 19.07c4.08-4.08 10.06-4.08 14.14 0" />
  </svg>
);

export default AfricanTablePage;