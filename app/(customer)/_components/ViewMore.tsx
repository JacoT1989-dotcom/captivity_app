import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ViewMoreProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "default" | "outline" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const variantStyles = {
  default: "bg-gray-800 text-white hover:bg-gray-900",
  outline: "border-2 border-gray-800 text-gray-800 hover:bg-gray-100",
  ghost: "text-gray-800 hover:bg-gray-100",
  light: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const sizeStyles = {
  sm: "py-2 text-sm",
  md: "py-3 text-base",
  lg: "py-4 text-lg",
};

const ViewMore: React.FC<ViewMoreProps> = ({
  href,
  variant = "default",
  size = "md",
  className,
  children = "View More",
  ...props
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "block w-full text-center rounded-md font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ViewMore;
