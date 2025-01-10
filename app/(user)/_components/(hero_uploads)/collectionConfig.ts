// collectionConfig.ts
export const COLLECTION_LINKS = [
  {
    href: "/products/all-collections/signature-collection",
    name: "Signature",
    label: "Signature Collection",
  },
  {
    href: "/products/all-collections/camo-collection",
    name: "Camo",
    label: "Camo Collection",
  },
  {
    href: "/products/all-collections/winter-collection",
    name: "Winter",
    label: "Winter Collection",
  },
  {
    href: "/products/all-collections/baseball-collection",
    name: "Baseball",
    label: "Baseball Collection",
  },
  {
    href: "/products/all-collections/fashion-collection",
    name: "Fashion",
    label: "Fashion Collection",
  },
  {
    href: "/products/all-collections/sport-collection",
    name: "Sport",
    label: "Sport Collection",
  },
  {
    href: "/products/all-collections/industrial-collection",
    name: "Industrial",
    label: "Industrial Collection",
  },
  {
    href: "/products/all-collections/leisure-collection",
    name: "Leisure",
    label: "Leisure Collection",
  },
  {
    href: "/products/all-collections/kids-collection",
    name: "Kids",
    label: "Kids Collection",
  },
  {
    href: "/products/all-collections/african-collection",
    name: "African",
    label: "African Collection",
  },
] as const;

export const getDisplayNameFromPath = (path: string): string => {
  // Find the matching collection by name (without -collection)
  const cleanPath = path.replace("-collection", "");
  const collection = COLLECTION_LINKS.find(
    link => link.href.replace("-collection", "") === cleanPath
  );

  if (collection) {
    return collection.name;
  }

  // Existing fallback logic
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];
  const nameWithoutSuffix = lastSegment
    .replace("-collection", "")
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return nameWithoutSuffix;
};
