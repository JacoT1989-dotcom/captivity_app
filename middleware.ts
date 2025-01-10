// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type VendorConfig = {
  path: string;
  domains: string[];
  isActive: boolean;
  storeName?: string;
};

type VendorCache = {
  vendors: { [key: string]: VendorConfig };
  lastFetched: number;
};

const CACHE_DURATION = 5 * 60 * 1000;
let vendorCache: VendorCache = {
  vendors: {},
  lastFetched: 0,
};

async function fetchVendorConfigurations(
  request: NextRequest
): Promise<{ [key: string]: VendorConfig }> {
  try {
    const protocol = request.nextUrl.protocol;
    const host = request.headers.get("host");
    const apiUrl = `${protocol}//${host}/api/vendors/config`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vendor configurations: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {};
  }
}

async function getVendorConfigurations(
  request: NextRequest
): Promise<{ [key: string]: VendorConfig }> {
  const now = Date.now();
  if (now - vendorCache.lastFetched < CACHE_DURATION) {
    return vendorCache.vendors;
  }

  const vendors = await fetchVendorConfigurations(request);
  vendorCache = {
    vendors,
    lastFetched: now,
  };
  return vendors;
}

async function getVendorPath(
  hostname: string,
  request: NextRequest
): Promise<string | null> {
  const vendors = await getVendorConfigurations(request);
  const lowercaseHostname = hostname.toLowerCase();
  
  const matchedVendor = Object.values(vendors).find(
    vendor =>
      vendor.isActive &&
      vendor.domains.some(domain => domain.toLowerCase() === lowercaseHostname)
  );
  
  return matchedVendor ? matchedVendor.path : null;
}

const commonPaths = [
  "/about",
  "/Help",
  "/custom-orders",
  "/info-act",
  "/terms-conditions",
  "/contact",
  "/international-tolerances",
];

const bypassPaths = [
  "/api",
  "/_next",
  "/assets",
  "/_components",
  "/(user)",
  "/(vendor)",
  "/vendor/vendor_auth",
  "/vendor/registration-pending",
  "/vendor/setup-store",
  "/actions",
  "/SessionProvider",
  "/error",
  "/loading",
  "/not-found",
  "/layout",
  "/globals.css",
  "/manifest.json",
  "/robots.txt",
  "/favicon.ico",
];

function shouldBypass(request: NextRequest): boolean {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  return (
    bypassPaths.some(bypass => path.startsWith(bypass)) ||
    path.includes(".") ||
    path.includes("api/") ||
    path.includes("auth/") ||
    path === "/api/vendors/config" ||
    (search.includes("_rsc=") && !commonPaths.some(p => path.startsWith(p)))
  );
}

export async function middleware(request: NextRequest) {
  try {
    if (shouldBypass(request)) {
      return NextResponse.next();
    }

    const hostname = request.headers.get("host") || "";
    const cleanHostname = hostname.split(":")[0];

    if (request.method === "OPTIONS") {
      return NextResponse.next();
    }

    const vendorPath = await getVendorPath(cleanHostname, request);

    if (vendorPath) {
      const url = request.nextUrl.clone();
      const path = url.pathname;
      const isRscRequest = url.search.includes("_rsc=");

      if (commonPaths.includes(path)) {
        if (isRscRequest) {
          url.pathname = `/vendor/${vendorPath}${path}`;
          return NextResponse.rewrite(url);
        }
        return NextResponse.next();
      }

      if (path === "/") {
        url.pathname = `/vendor/${vendorPath}/welcome`;
        return NextResponse.rewrite(url);
      }

      if (!path.startsWith("/vendor")) {
        url.pathname = `/vendor/${vendorPath}${path}`;
        return NextResponse.rewrite(url);
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};