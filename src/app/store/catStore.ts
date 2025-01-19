import { create } from 'zustand';
import { CatImage, fetchCatData } from '../api';

interface CatStore {
  catImages: CatImage[];
  loading: boolean;
  error: string | null;
  page: number;
  fetchCats: (limit?: number) => Promise<void>;
  setPage: (page: number) => void;
}

interface CatId {
  catId: string[];
  mouse: boolean;
  storeId: (id: string) => void;
}

export const useCatStore = create<CatStore>((set) => ({
  catImages: [],
  loading: false,
  error: null,
  page: 0,
  setPage: (page) => set({ page }),
  fetchCats: async (limit: number = 10) => {
    set({ loading: true, error: null });
    try {
      const state = useCatStore.getState();
      const data = await fetchCatData(limit, state.page);
      if (data.length === 0) {
        throw new Error('No data received');
      }
      set((state) => {
        const newImages = data.filter(newCat => 
          !state.catImages.some(existingCat => existingCat.id === newCat.id)
        );
        return {
          catImages: [...state.catImages, ...newImages],
          loading: false,
          page: state.page + 1
        };
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cats'
      });
    }
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
