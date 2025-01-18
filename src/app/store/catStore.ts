import {create} from 'zustand';
import { CatImage, fetchCatData } from '../api';

interface CatStore {
  catImages: CatImage[];
  loading: boolean;
  fetchCats: () => Promise<void>;
}

export const useCatStore = create<CatStore>((set) => ({
    catImages: [],
    loading: false,
    fetchCats: async (limit: number = 40) => {
      set({ loading: true });
      const data:CatImage[] = await fetchCatData(limit);
      set((state) => ({
        catImages: [...state.catImages, ...data], 
        loading: false,
      }));
    },
  }));
  