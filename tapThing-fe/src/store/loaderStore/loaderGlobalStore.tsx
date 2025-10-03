// src/store/loadingStore/useLoadingStore.ts
import { create } from 'zustand';

type LoadingStore = {
    isLoading: boolean;
    setLoading: (value: boolean) => void;
};

interface LoadingState {
    isLoading: boolean;
}

export const useLoadingStore = create<LoadingStore>(
    (set: (partial: Partial<LoadingState>) => void) => ({
        isLoading: false,
        setLoading: (value: boolean) => set({ isLoading: value }),
    })
);