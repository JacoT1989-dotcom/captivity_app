import React from "react";
import { HardHat, Wrench, Loader2 } from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-lg">
        {/* Construction Icons with Animation */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <HardHat
            className="w-12 h-12 text-yellow-500 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <Wrench
            className="w-12 h-12 text-blue-500 animate-bounce"
            style={{ animationDelay: "0.4s" }}
          />
          <Loader2 className="w-12 h-12 text-gray-600 animate-spin" />
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Under Construction
        </h1>

        {/* Subtitle with typing animation */}
        <div className="relative">
          <p className="text-xl text-gray-600 font-light">
            We are working hard to bring you something amazing!
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 animate-pulse"></div>
        </div>

        {/* Additional Info */}
        <p className="text-gray-500 mt-8">
          This page is currently being built and will be available soon. Thank
          you for your patience!
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-8">
          <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
        </div>

        {/* Return Link */}
        <a
          href="/customer"
          className="inline-block mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 ease-in-out"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default UnderConstruction;
