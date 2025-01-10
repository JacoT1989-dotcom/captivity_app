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
      { value: "all-in-headwear", label: "All" },
      { value: "new-in-headwear", label: "New In Headwear" },
      { value: "flat-peaks", label: "Flat Peaks" },
      { value: "pre-curved-peaks", label: "Pre-curved Peaks" },
      { value: "hats", label: "Hats" },
      { value: "multifunctional-headwear", label: "Multifunctional Headwear" },
      { value: "beanies", label: "Beanies" },
      { value: "trucker-caps", label: "Trucker Caps" },
      { value: "bucket-hats", label: "Bucket Hats" },
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
