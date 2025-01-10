import React from "react";
import { Construction, Wrench, Code2 } from "lucide-react";

const UnderDevelopment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Animated Construction Icons */}
        <div className="flex justify-center space-x-4 mb-8">
          <Construction className="w-12 h-12 text-indigo-600 animate-bounce" />
          <Wrench className="w-12 h-12 text-indigo-600 animate-bounce delay-100" />
          <Code2 className="w-12 h-12 text-indigo-600 animate-bounce delay-200" />
        </div>

        {/* Main Heading with gradient text */}
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
          Under Development
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          We are working hard to bring you something amazing! Our team is
          crafting every pixel with care.
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full animate-pulse"
            style={{ width: "70%" }}
          />
        </div>

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-white bg-opacity-50 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              New Features
            </h3>
            <p className="text-gray-600">
              Exciting new features are being developed
            </p>
          </div>
          <div className="p-6 bg-white bg-opacity-50 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              Better UI
            </h3>
            <p className="text-gray-600">Enhanced user interface coming soon</p>
          </div>
          <div className="p-6 bg-white bg-opacity-50 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              Performance
            </h3>
            <p className="text-gray-600">Optimized for better performance</p>
          </div>
        </div>

        {/* Estimated Time */}
        <p className="text-gray-500 mt-8">Expected completion: Coming Soon</p>
      </div>
    </div>
  );
};

export default UnderDevelopment;
