import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./_components/ErrorBoundary";

// Lazy load components
const CarouselPlugin = lazy(() => import("./_components/CarouselPlugin"));
const BestSeller = lazy(() => import("./_components/BestSeller"));
const CategoryImages = lazy(() => import("./_components/CategorySection"));

// Loading components
const CarouselLoader = () => (
  <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center bg-gray-50">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);

const SectionLoader = () => (
  <div className="w-full h-[200px] flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);

const WelcomePage = () => {
  return (
    <div className="my-4 space-y-8">
      <ErrorBoundary>
        <Suspense fallback={<CarouselLoader />}>
          <CarouselPlugin />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <BestSeller />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader />}>
          <CategoryImages />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default WelcomePage;
