import { ApparelCollection } from "./_collections/ApparelCollection";
import { HeadwearCollection } from "./_collections/HeadwearCollection";
import { KidsCollection } from "./_collections/KidsCollection";
import { TshirtCollection } from "./_collections/TshirtCollection";

// Section2.tsx
export function Section2() {
  return (
    <>
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <TshirtCollection />

          <div className="flex flex-col gap-4 md:col-span-6">
            <ApparelCollection />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KidsCollection />
              <HeadwearCollection />
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
