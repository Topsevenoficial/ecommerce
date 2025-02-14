import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "./use-toast";
import { ProductType } from "@/types/product";

interface CartStore {
  items: ProductType[];
  addItem: (data: ProductType) => void;
  removeItem: (id: number) => void;
  removeAll: () => void;
  totalAmount: () => number;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: ProductType) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast({
            title: "El producto ya existe en el carrito.",
            variant: "destructive",
            duration: 1500,
          });
        }

        set({ items: [...currentItems, data] });

        toast({
          title: "Producto añadido al carrito 🛒",
          duration: 1500,
        });
      },
      removeItem: (id: number) => {
        set({ items: get().items.filter((item) => item.id !== id) });

        toast({
          title: "Producto eliminado del carrito 🛒",
          duration: 2000,
        });
      },
      removeAll: () => set({ items: [] }),

      // 📌 Nueva función para calcular el total del carrito aplicando descuentos
      totalAmount: () => {
        return get().items.reduce((acc, item) => {
          const finalPrice = item.discount
            ? item.price - item.discount
            : item.price;
          return acc + finalPrice;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
