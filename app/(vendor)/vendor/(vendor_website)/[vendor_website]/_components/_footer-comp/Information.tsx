"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";

interface InformationLink {
  href: string;
  label: string;
}

const Information = () => {
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;

  const links: InformationLink[] = [
    { href: `/vendor/${vendorWebsite}/about`, label: "About" },
    { href: `/vendor/${vendorWebsite}/help`, label: "Help" },
    { href: `/vendor/${vendorWebsite}/contact`, label: "Contact Us" },
    { href: `/vendor/${vendorWebsite}/custom-orders`, label: "Custom Orders" },
    { href: `/vendor/${vendorWebsite}/info-act`, label: "Information Act" },
    {
      href: `/vendor/${vendorWebsite}/terms-conditions`,
      label: "Terms & Conditions",
    },
    {
      href: `/vendor/${vendorWebsite}/international-tolerances`,
      label: "International Tolerances on Apparel",
    },
  ];

  return (
    <div className="w-full">
      <h3 className="font-bold text-white text-xl mb-6">INFORMATION</h3>
      <div className="bg-gray-800 rounded-lg p-4">
        <ul className="space-y-3">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between text-white hover:text-red-600 transition-colors group"
              >
                <span>{link.label}</span>
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-red-600 transition-colors"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Information;
