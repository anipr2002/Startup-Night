import { InventoryItem, ShoppingListItem } from "@/db/schema";
import { create } from "zustand";

type actionStoreProps = {
    section: 'ShoppingList' | 'Inventory';
    setSection: (section: 'ShoppingList' | 'Inventory') => void;
    shoppingListOpen: boolean;
    setShoppingListOpen: (shoppingListOpen: boolean) => void;
    editShoppingListOpen: boolean;
    setEditShoppingListOpen: (editShoppingListOpen: boolean) => void;
    editShoppingListItem : Partial<ShoppingListItem>;
    setEditShoppingListItem: (editShoppingListItem: Partial<ShoppingListItem>) => void;

    inventroyOpen: boolean;
    setInventoryOpen: (inventroyOpen: boolean) => void;
    editInventoryOpen: boolean;
    setEditInventoryOpen: (editInventoryOpen: boolean) => void;
    editInventoryItem : Partial<InventoryItem>;
    setEditInventoryItem: (editInventoryItem: Partial<InventoryItem>) => void;
}

const useActionStore = create<actionStoreProps>((set) => ({
    section: 'ShoppingList',
    setSection: (section: 'ShoppingList' | 'Inventory') => set({
        section: section,
    }),
    shoppingListOpen: false,
    setShoppingListOpen: (shoppingListOpen: boolean) => set({
        shoppingListOpen: shoppingListOpen,
    }),
    editShoppingListItem : {} as Partial<ShoppingListItem>,
    setEditShoppingListItem: (editShoppingListItem: Partial<ShoppingListItem>) => set({
        editShoppingListItem: editShoppingListItem,
    }),
    editInventoryOpen: false,
    setEditInventoryOpen: (editInventoryOpen: boolean) => set({
        editInventoryOpen: editInventoryOpen,
    }),
    editShoppingListOpen: false,
    setEditShoppingListOpen: (editShoppingListOpen: boolean) => set({
        editShoppingListOpen: editShoppingListOpen,
    }),
    inventroyOpen: false,
    setInventoryOpen: (inventroyOpen: boolean) => set({
        inventroyOpen: inventroyOpen,
    }),
    editInventoryItem : {} as Partial<ShoppingListItem>,
    setEditInventoryItem: (editInventoryItem: Partial<ShoppingListItem>) => set({
        editInventoryItem: editInventoryItem,
    }),
}));

export default useActionStore;
