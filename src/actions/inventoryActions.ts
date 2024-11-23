"use server";
import db from "@/db/drizzle";
import { inventory, inventoryItems, users, Household, HouseholdMember, User, Inventory, InventoryItem} from "@/db/schema";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const getInventoryForHousehold = async (householdID : string): Promise<InventoryItem[] | undefined | null> => {
    const inventory = await db.query.inventory.findMany({
        where(fields, operators) {
            return eq(fields.household_id, householdID);
        },
        with: {
            items: true,
        },
    });
    const items = inventory.flatMap((inventory) =>
        inventory.items.map((item) => ({
            id: item.id,
            inventory_id: inventory.id,
            name: item.name,
            unit: item.unit,
            quantity: item.quantity,
            category: item.category,
            addedAt: item.addedAt,
            expiryDate: item.expiryDate,
        }))
    );
    // return items;
    if (items.length > 0) {
        return items;
    }
    else {
        return null;
    }
};

//get inventory item by id
export const getInventoryItemById = async (itemId: string): Promise<InventoryItem | undefined> => {
    const item = await db.query.inventoryItems.findFirst({
        where(fields, operators) {
            return eq(fields.id, itemId);
        },
    });
    return item;
};

function generateAlphanumericId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


//update inventory item
export const updateInventoryItemById = async (itemId: string, item: Partial<InventoryItem>) => {
    const updatedItem = await db.update(inventoryItems)
        .set({
            name: item.name,
            unit: item.unit,
            quantity: item.quantity,
            category: item.category,
            expiryDate: item.expiryDate,
        }).where(eq(inventoryItems.id, itemId))
        .returning();

    return updatedItem[0];
}

export const deleteInventoryItem = async (itemId: string) => {
    const deletedItem = await db.delete(inventoryItems)
        .where(eq(inventoryItems.id, itemId));

    return deletedItem;
};

export const getInventoryId = async (householdId: string): Promise<string | undefined> => {
    const inventory = await db.query.inventory.findFirst({
        where(fields, operators) {
            return eq(fields.household_id, householdId);
        },
    });
    return inventory?.id;
};

//add a inventory item

export const addInventoryItem = async ( 
    item: InventoryItem,
    household_id: string,
) => {
   
    const uniqueId = generateAlphanumericId(9);

    const newItem = await db.insert(inventoryItems).values({
        id : uniqueId,
        inventory_id : item.inventory_id as string, 
        name: item.name,
        category: item.category,
        unit: item.unit,
        quantity: item.quantity,
        expiryDate: item.expiryDate,
    }).returning({
       //return the newly created item
        id: inventoryItems.id,
        name: inventoryItems.name,
        unit: inventoryItems.unit,
        quantity: inventoryItems.quantity,
        category: inventoryItems.category,
        expiryDate: inventoryItems.expiryDate,
    })
    revalidatePath(`/dashboard/${household_id}`,"page");
    return newItem;
};

export const decreaseItemQuantity = async (itemId: string, quantity: number) => {
    const item = await db.query.inventoryItems.findFirst({
        where(fields, operators) {
            return eq(fields.id, itemId);
        },
    });
    if (item) {
        await db.update(inventoryItems).set({
            quantity: item.quantity - quantity,
        }).where(eq(inventoryItems.id, itemId));
        console.log("Item quantity decreased");
    }
};