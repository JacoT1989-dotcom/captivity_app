import { create } from "zustand";
import { ProductWithRelations } from "./types";

//writing just to recommit
interface FavoriteStore {
  favorites: ProductWithRelations[];
  isLoading: boolean;
  setFavorites: (favorites: ProductWithRelations[]) => void;
  addFavorite: (product: ProductWithRelations) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  setLoading: (loading: boolean) => void;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  isLoading: true,
  setFavorites: favorites => set({ favorites, isLoading: false }),
  addFavorite: product =>
    set(state => ({
      favorites: [...state.favorites, product],
    })),
  removeFavorite: productId =>
    set(state => ({
      favorites: state.favorites.filter(product => product.id !== productId),
    })),
  isFavorite: productId =>
    get().favorites.some(product => product.id === productId),
  setLoading: loading => set({ isLoading: loading }),
  clearFavorites: () => set({ favorites: [], isLoading: true }),
}));
