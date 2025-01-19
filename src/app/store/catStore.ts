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
  fetchCats: async (limit: number = 10) => {
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


interface LocalStore {
  lovedCats: string[];
  loadLovedCats: () => void;
  addLovedCat: (catId: string) => void;
  removeLovedCat: (catId: string) => void;
}

export const useLocalStore = create<LocalStore>((set) => ({
  lovedCats: [],
  loadLovedCats: () => {
    const savedCats = localStorage.getItem('lovedCats');
    if (savedCats) {
      set({ lovedCats: JSON.parse(savedCats) });
    }
  },
  addLovedCat: (catId: string) => {
    set((state) => {
      const updatedCats = [...state.lovedCats, catId];
      localStorage.setItem('lovedCats', JSON.stringify(updatedCats)); // Обновляем localStorage
      return { lovedCats: updatedCats };
    });
  },
  removeLovedCat: (catId: string) => {
    set((state) => {
      const updatedCats = state.lovedCats.filter((id) => id !== catId);
      localStorage.setItem('lovedCats', JSON.stringify(updatedCats)); // Обновляем localStorage
      return { lovedCats: updatedCats };
    });
  },
}));
