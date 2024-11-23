import { create } from "zustand";
import { InventoryItem } from "@/db/schema";

type InventoryStore = {
    inventoryItems: InventoryItem[];
    setAddToInventory: (inventoryItems: InventoryItem[]) => void;
    setToInventory: (inventoryItems: InventoryItem[]) => void;
    updateInventoryItem: (item: Partial<InventoryItem>) => void;
}

const useInventoryStore = create<InventoryStore>((set) => ({
    inventoryItems: [],
    setAddToInventory: (inventoryItems: InventoryItem[]) => set((state) => ({
        inventoryItems: [...state.inventoryItems, ...inventoryItems],
    })),
    setToInventory: (inventoryItems: InventoryItem[]) => set((state) => ({
        inventoryItems: inventoryItems,
    })),
    updateInventoryItem: (updatedItem: Partial<InventoryItem>) => set((state) => ({
        inventoryItems: state.inventoryItems.map((item) => 
            item.id === updatedItem.id ? {...item, ...updatedItem} : item
        ),
    })),
}));


export default useInventoryStore;