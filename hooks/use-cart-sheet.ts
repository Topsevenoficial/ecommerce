import { create } from "zustand";

interface CartSheetState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCartSheet = create<CartSheetState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
