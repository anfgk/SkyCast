import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { City } from "@/shared/config/cities";

interface FavoriteStore {
  favorites: City[];
  addFavorite: (city: City) => void;
  removeFavorite: (cityName: string) => void;
  isFavorite: (cityName: string) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (city) => {
        if (!get().isFavorite(city.name)) {
          set((state) => ({ favorites: [...state.favorites, city] }));
        }
      },
      removeFavorite: (cityName) => {
        set((state) => ({
          favorites: state.favorites.filter((city) => city.name !== cityName),
        }));
      },
      isFavorite: (cityName) => {
        return get().favorites.some((city) => city.name === cityName);
      },
    }),
    {
      name: "favorite-cities",
    }
  )
);
