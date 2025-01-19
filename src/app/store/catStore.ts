import { create } from 'zustand';
import { CatImage, fetchCatData } from '../api';

interface CatStore {
  catImages: CatImage[];
  loading: boolean;
  fetchCats: () => Promise<void>;
}

interface CatId {
  catId: string[];
  mouse: boolean;
  storeId: (id: string) => void;
}

export const useCatStore = create<CatStore>((set) => ({
  catImages: [],
  loading: false,
  fetchCats: async (limit: number = 5) => {
    set({ loading: true });
    const data: CatImage[] = await fetchCatData(limit);
    set((state) => ({
      catImages: [...state.catImages, ...data],
      loading: false,
    }));
  },
}));

export const useIdCatStore = create<CatId>((set) => ({
  catId: [],
  mouse: false,
  storeId: (id) => {
    set((state) => ({
      catId: [...state.catId, id],
      mouse: true
    }))
  }
}))
