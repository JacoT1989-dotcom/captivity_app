import { ApparelCollection } from "./_collections/ApparelCollection";
import { HeadwearCollection } from "./_collections/HeadwearCollection";
import { KidsCollection } from "./_collections/KidsCollection";
import { TshirtCollection } from "./_collections/TshirtCollection";

export function Section2() {
  return (
    <>
      <section className="container mx-auto px-4 py-8 md:py-16">
        {/* Mobile/Small: Simple 2-column grid */}
        {/* Medium+: Original 12-column layout */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <TshirtCollection />
            </div>
            <div className="col-span-1">
              <ApparelCollection />
            </div>
            <div className="col-span-1">
              <KidsCollection />
            </div>
            <div className="col-span-1">
              <HeadwearCollection />
            </div>
          </div>
        </div>

        {/* Original desktop layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <TshirtCollection />
            </div>
            <div className="col-span-6">
              <div className="flex flex-col gap-4">
                <ApparelCollection />
                <div className="grid grid-cols-2 gap-4">
                  <KidsCollection />
                  <HeadwearCollection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4">
        <div className="h-px bg-gray-200"></div>
      </div>
    </>
  );
}
