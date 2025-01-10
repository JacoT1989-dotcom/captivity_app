import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ColorState {
  selectedColors: { [productId: string]: string };
  setSelectedColor: (productId: string, color: string) => void;
  getSelectedColor: (productId: string) => string | null;
  clearSelectedColor: (productId: string) => void;
}

export const useColorStore = create<ColorState>()(
  persist(
    (set, get) => ({
      selectedColors: {},
      setSelectedColor: (productId, color) =>
        set(state => ({
          selectedColors: { ...state.selectedColors, [productId]: color },
        })),
      getSelectedColor: productId => {
        const state = get();
        return state.selectedColors[productId] || null;
      },
      clearSelectedColor: productId =>
        set(state => {
          const newSelectedColors = { ...state.selectedColors };
          delete newSelectedColors[productId];
          return { selectedColors: newSelectedColors };
        }),
    }),
    {
      name: "color-selection-storage",
    }
  )
);
