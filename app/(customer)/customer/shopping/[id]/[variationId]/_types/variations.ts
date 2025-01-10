import { VariationWithRelations } from "./types";

export interface BaseProps {
  data: VariationWithRelations;
}

export interface FilterProps extends BaseProps {
  selectedColors: Set<string>;
  selectedSizes: Set<string>;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
}

export interface TableProps extends BaseProps {
  filteredVariations: VariationWithRelations["product"]["variations"];
}
