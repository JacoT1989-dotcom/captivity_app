import React from "react";
import ContentWrapper from "./ContentWrapper";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full relative z-30">{children}</div>
      <div className="w-full flex-grow px-0.5 sm:px-4 lg:px-8">
        <ContentWrapper />
      </div>
    </div>
  );
}
