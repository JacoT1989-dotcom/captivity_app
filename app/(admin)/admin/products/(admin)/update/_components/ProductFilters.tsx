import React from "react";
import { Search, FilterX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterState } from "../types";

interface ProductFiltersProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  selectedHeadwear: string;
  selectedApparel: string;
  selectedCollection: string;
  onCategoryChange: (
    value: string,
    type: "headwear" | "apparel" | "collections"
  ) => void;
  filters: FilterState;
  onFilterChange: (value: FilterState["stockLevel"]) => void;
  onClearFilters: () => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearch,
  selectedHeadwear,
  selectedApparel,
  selectedCollection,
  onCategoryChange,
  filters,
  onFilterChange,
  onClearFilters,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Search and Stock Filter Row */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
          />
        </div>

        <Select value={filters.stockLevel} onValueChange={onFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stock Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock (5 or less)</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2" onClick={onClearFilters}>
          <FilterX className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Headwear Filter */}
        <Select
          value={selectedHeadwear}
          onValueChange={value => onCategoryChange(value, "headwear")}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Headwear" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-in-headwear">All Headwear</SelectItem>
            <SelectItem value="flat-peaks">Flat Peaks</SelectItem>
            <SelectItem value="pre-curved-peaks">Pre-curved Peaks</SelectItem>
            <SelectItem value="hats">Hats</SelectItem>
            <SelectItem value="multifunctional-headwear">
              Multifunctional Headwear
            </SelectItem>
            <SelectItem value="beanies">Beanies</SelectItem>
            <SelectItem value="trucker-caps">Trucker Caps</SelectItem>
            <SelectItem value="bucket-hats">Bucket Hats</SelectItem>
          </SelectContent>
        </Select>

        {/* Apparel Filter */}
        <Select
          value={selectedApparel}
          onValueChange={value => onCategoryChange(value, "apparel")}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Apparel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-in-apparel">All Apparel</SelectItem>
            <SelectItem value="new-in-apparel">New In Apparel</SelectItem>
            <SelectItem value="t-shirts">T-Shirts</SelectItem>
            <SelectItem value="golfers">Golfers</SelectItem>
            <SelectItem value="hoodies">Hoodies</SelectItem>
            <SelectItem value="jackets">Jackets</SelectItem>
            <SelectItem value="bottoms">Bottoms</SelectItem>
          </SelectContent>
        </Select>

        {/* Collections Filter */}
        <Select
          value={selectedCollection}
          onValueChange={value => onCategoryChange(value, "collections")}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Collections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-in-collections">All Collections</SelectItem>
            <SelectItem value="camo-collection">Camo Collection</SelectItem>
            <SelectItem value="winter-collection">Winter Collection</SelectItem>
            <SelectItem value="baseball-collection">
              Baseball Collection
            </SelectItem>
            <SelectItem value="fashion-collection">
              Fashion Collection
            </SelectItem>
            <SelectItem value="sport-collection">Sport Collection</SelectItem>
            <SelectItem value="industrial-collection">
              Industrial Collection
            </SelectItem>
            <SelectItem value="leisure-collection">
              Leisure Collection
            </SelectItem>
            <SelectItem value="kids-collection">Kids Collection</SelectItem>
            <SelectItem value="african-collection">
              African Collection
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items Per Page */}
      <div className="flex justify-end">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={value => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">Show 10</SelectItem>
            <SelectItem value="20">Show 20</SelectItem>
            <SelectItem value="40">Show 40</SelectItem>
            <SelectItem value="100">Show 100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;
