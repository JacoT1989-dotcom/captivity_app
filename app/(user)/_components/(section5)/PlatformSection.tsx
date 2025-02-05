import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import styles from "./FwrdSection.module.css";

export function PlatformSection() {
  return (
    <section className="py-16">
      <div className="container w-full mx-auto px-4">
        <div className="space-y-4">
          {/* Vendor Platform and Loyalty Programme Section */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl overflow-hidden">
              <div className="p-8 text-center text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">VENDOR PLATFORM</h2>
                  <Image
                    src="/vendor.png"
                    alt="Vendor Platform"
                    width={400}
                    height={260}
                    className="mx-auto mb-4 rounded-lg"
                  />
                  <p className="text-lg mb-6 text-white/90">
                    Our dedicated vendor platform is coming soon! Stay tuned for
                    an enhanced business experience.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full font-semibold mx-auto">
                  <BadgeCheck className="w-5 h-5" />
                  Coming Soon
                </div>
              </div>
            </div>

 
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="p-8 text-center text-white h-full flex flex-col justify-center items-center">
                <div className="animate-pulse">
                  <h2 className="text-4xl font-bold mb-6">COMING SOON</h2>
                  <div className="w-24 h-24 mx-auto mb-6">
                    <BadgeCheck className="w-full h-full" />
                  </div>
                </div>
                <p className="text-xl mb-6 text-white/90">
                  We&apos;re working on something exciting! Stay tuned for our
                  new features and enhanced experiences.
                </p>
                <div className="text-2xl font-bold bg-white text-red-600 px-6 py-3 rounded-full">
                  Q1 2025
                </div>
              </div>
            </div>

  
            <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-xl overflow-hidden">
              <div className="p-8 text-center text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">LOYALTY PROGRAMME</h2>
                  <Image
                    src="/loyalty.png"
                    alt="Loyalty Programme"
                    width={400}
                    height={260}
                    className="mx-auto mb-4 rounded-lg"
                  />
                  <p className="text-lg mb-6 text-white/90">
                    Earn rewards and exclusive benefits with our upcoming
                    loyalty programme.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full font-semibold mx-auto">
                  <BadgeCheck className="w-5 h-5" />
                  Coming Soon
                </div>
              </div>
            </div>
          </div> */}

          {/* FWRD Section */}
          <div className="mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-[#efeeee] rounded-xl overflow-hidden">
              {/* Left side - Title and Description */}
              <div className="flex-1 p-12 text-center">
                <h2 className="text-4xl font-bold text-red-600 mb-4">
                  VISIT THE FWRD WEBSITE
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  The FWRD Brand is distributed via promotional companies,
                  advertising, event companies and resellers ONLY.
                </p>
                <Link
                  href="https://fwrd.co.za"
                  target="_blank"
                  className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Visit Site
                </Link>
              </div>

              {/* Right side - Flipping Card */}
              <div className={`flex-1 p-4 ${styles["perspective-1000"]}`}>
                <div
                  className={`relative w-full aspect-video ${styles["transform-style-preserve-3d"]} transition-transform duration-700 hover:${styles["rotate-y-180"]}`}
                >
                  {/* Front of card */}
                  <div
                    className={`absolute w-full h-full ${styles["backface-hidden"]}`}
                  >
                    <Image
                      src="/FWRD.jpg"
                      alt="FWRD Website Preview"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                    />
                  </div>

                  {/* Back of card */}
                  <div
                    className={`absolute w-full h-full ${styles["backface-hidden"]} ${styles["rotate-y-180"]} bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl`}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-white p-8">
                      <h3 className="text-3xl font-bold mb-2">FWRD</h3>
                      <p className="text-xl mb-8 text-center text-gray-300">
                        THE PROMOTIONAL BRAND FOR YOU
                      </p>
                      <Link
                        href="https://fwrd.co.za"
                        target="_blank"
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Take me there
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
