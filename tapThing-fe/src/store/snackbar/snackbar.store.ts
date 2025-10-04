// src/stores/useSnackbarStore.ts
import { create } from "zustand";

type SnackbarVariant = "success" | "error" | "info";

type SnackbarState = {
  message: string | null;
  variant: SnackbarVariant;
  visible: boolean;
  show: (message: string, variant?: SnackbarVariant) => void;
  hide: () => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => ({
  message: null,
  variant: "info",
  visible: false,
  show: (message, variant = "info") =>
    set({ message, variant, visible: true }),
  hide: () => set({ visible: false, message: null }),
}));
