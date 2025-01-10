import { useFilterStore } from "@/app/(customer)/customer/_store/useFilterStore";
import { FilterProps } from "../_types/variations";

export const FiltersSection = ({
  data,
  selectedColors,
  selectedSizes,
  onColorSelect,
  onSizeSelect,
}: FilterProps) => {
  const getColorValue = useFilterStore(state => state.getColorValue);

  const uniqueColors = Array.from(
    new Set(data.product.variations.map(v => v.color))
  );

  const getSizeOrder = (size: string): number => {
    // Normalize size to lowercase and remove extra spaces
    const normalizedSize = size.toLowerCase().trim();

    // Define exact size order mapping
    const sizeOrder: { [key: string]: number } = {
      xs: 10,
      small: 20,
      s: 20,
      medium: 30,
      m: 30,
      large: 40,
      l: 40,
      xl: 50,
      xxl: 60,
      "2xl": 60,
      xxxl: 70,
      "3xl": 70,
      xxxxl: 80,
      "4xl": 80,
      xxxxxl: 90,
      "5xl": 90,
    };

    // Check direct match first
    if (sizeOrder.hasOwnProperty(normalizedSize)) {
      return sizeOrder[normalizedSize];
    }

    // Check for numeric sizes (e.g., "32", "34")
    const numericSize = parseInt(normalizedSize);
    if (!isNaN(numericSize)) {
      return numericSize + 200; // Put numeric sizes after letter sizes
    }

    // Handle any remaining xl variants
    if (normalizedSize.endsWith("xl")) {
      const prefix = normalizedSize.replace("xl", "");
      const multiplier =
        prefix === "" ? 1 : prefix === "x" ? 2 : parseInt(prefix);
      return !isNaN(multiplier) ? 50 + (multiplier - 1) * 10 : 999;
    }

    return 999; // Unknown sizes go to the end
  };

  // Sort sizes using the enhanced sorting function
  const uniqueSizes = Array.from(
    new Set(data.product.variations.map(v => v.size))
  ).sort((a, b) => {
    const orderA = getSizeOrder(a);
    const orderB = getSizeOrder(b);
    return orderA - orderB;
  });

  // Rest of your component remains the same
  const getColorStyle = (colorName: string): React.CSSProperties => {
    const colorValue = getColorValue(colorName);

    if (typeof colorValue === "string") {
      return {
        backgroundColor: colorValue,
      };
    }

    if (typeof colorValue === "object" && colorValue.colors) {
      if (colorValue.colors.length === 1) {
        return { backgroundColor: colorValue.colors[0] };
      }

      const segmentSize = 360 / colorValue.colors.length;
      const gradientStops = colorValue.colors.map((color, index) => {
        const startAngle = index * segmentSize;
        const endAngle = (index + 1) * segmentSize;
        return `${color} ${startAngle}deg ${endAngle}deg`;
      });

      return {
        background: `conic-gradient(${gradientStops.join(", ")})`,
        border: "1px solid #e5e7eb",
      };
    }

    return {};
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-2xl shadow-black space-y-6">
      <div>
        <h2 className="text-base md:text-lg font-semibold text-card-foreground mb-4">
          FILTER BY COLOUR
        </h2>
        <div className="flex flex-wrap gap-3">
          {uniqueColors.map(color => {
            const colorStyle = getColorStyle(color);
            return (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className="group relative"
                title={color}
              >
                <div
                  className={`h-8 w-8 rounded-full transition-all duration-200 hover:scale-110 ${
                    selectedColors.has(color)
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:ring-2 hover:ring-muted-foreground hover:ring-offset-1"
                  }`}
                  style={colorStyle}
                />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"></span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="text-base md:text-lg font-semibold text-card-foreground mb-4">
          FILTER BY SIZES
        </h2>
        <div className="flex flex-wrap gap-2">
          {uniqueSizes.map(size => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`min-w-[40px] px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-md border transition-colors ${
                selectedSizes.has(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-input hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
