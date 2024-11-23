import { create } from "zustand";
import { ShoppingListItem } from "@/db/schema";

type ShoppingStore = {
    shoppingListItems: ShoppingListItem[];
    setAddToShoppingList: (shoppingListItems: ShoppingListItem[]) => void;
    setToShoppingList: (shoppingListItems: ShoppingListItem[]) => void;
    updateShoppingListItem: (item: Partial<ShoppingListItem>) => void;
}

const useShoppingStore = create<ShoppingStore>((set) => ({
    shoppingListItems: [],
    setAddToShoppingList: (shoppingListItems: ShoppingListItem[]) => set((state) => ({
        shoppingListItems: [...state.shoppingListItems, ...shoppingListItems],
    })),
    setToShoppingList: (shoppingListItems: ShoppingListItem[]) => set((state) => ({
        shoppingListItems: shoppingListItems,
    })),
    updateShoppingListItem: (updatedItem: Partial<ShoppingListItem>) => set((state) => ({
    shoppingListItems: state.shoppingListItems.map((item) => 
        item.id === updatedItem.id ? {...item, ...updatedItem} : item
    ),
})),
}));


export default useShoppingStore;