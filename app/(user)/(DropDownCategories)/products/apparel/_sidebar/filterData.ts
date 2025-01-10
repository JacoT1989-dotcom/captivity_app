// filterData.ts

import { Filter, FilterType } from "../_store/types";

export const filters: Filter[] = [
  {
    name: "Stock Level",
    type: "stockLevel" as FilterType,
    options: [
      { value: "all", label: "All" },
      { value: "in", label: "In Stock" },
      { value: "out", label: "Out of Stock" },
    ],
  },
  {
    name: "Product Type",
    type: "types" as FilterType,
    options: [
      { value: "all-in-apparel", label: "All" },
      { value: "new-in-apparel", label: "New In Apparel" },
      { value: "men", label: "Men" },
      { value: "women", label: "Women" },
      { value: "kids", label: "Kids" },
      { value: "t-shirts", label: "T-Shirts" },
      { value: "golfers", label: "Golfers" },
      { value: "hoodies", label: "Hoodies" },
      { value: "jackets", label: "Jackets" },
      { value: "bottoms", label: "Bottoms" },
    ],
  },
  {
    name: "Sizes",
    type: "sizes" as FilterType,
    options: [
      { value: "XS", label: "XS" },
      { value: "S", label: "S" },
      { value: "S/M", label: "S/M" },
      { value: "M/L", label: "M/L" },
      { value: "L", label: "L" },
      { value: "L/XL", label: "L/XL" },
      { value: "XL", label: "XL" },
      { value: "2XL", label: "2XL" },
      { value: "3XL", label: "3XL" },
      { value: "4XL", label: "4XL" },
      { value: "5XL", label: "5XL" },
      { value: "OSFM", label: "OSFM" },
    ],
  },
  {
    name: "Colours",
    type: "colors" as FilterType,
    options: [
      { value: "Black", label: "Black" },
      { value: "White", label: "White" },
      { value: "Navy", label: "Navy" },
      { value: "Grey", label: "Grey" },
      { value: "Red", label: "Red" },
      { value: "Green", label: "Green" },
      { value: "Blue", label: "Blue" },
      { value: "Yellow", label: "Yellow" },
      { value: "Purple", label: "Purple" },
      { value: "Orange", label: "Orange" },
    ],
  },
];
