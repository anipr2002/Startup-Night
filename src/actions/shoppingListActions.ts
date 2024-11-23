"use server";
import db from "@/db/drizzle";
import { shoppingLists, shoppingListItems, users, Household, HouseholdMember, User, ShoppingList, ShoppingListItem} from "@/db/schema";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getShoppingListForHousehold = async (householdID : string): Promise<ShoppingListItem[] | undefined | null> => {
    const shoppingLists = await db.query.shoppingLists.findMany({
        where(fields, operators) {
            return eq(fields.household_id, householdID);
        },
        with: {
            items: true,
        },
    });
    const items = shoppingLists.flatMap((shoppingList) =>
        shoppingList.items.map((item) => ({
            id: item.id,
            name: item.name,
            unit: item.unit,
            quantity: item.quantity,
            category: item.category,
            priority: item.priority,
            shopping_list_id: shoppingList.id,
            checked: item.checked,
             createdAt: item.createdAt ?? null,
            addedBy: item.addedBy ?? '',
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

//get shopping list item by id
export const getShoppingListItemById = async (itemId: string): Promise<ShoppingListItem | undefined> => {
    const item = await db.query.shoppingListItems.findFirst({
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


//update shopping list item by item id
export const updateShoppingListItemById = async (itemId: string, item: Partial<ShoppingListItem>) => {
  const updatedItem = await db
    .update(shoppingListItems)
    .set({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      category: item.category,
      priority: item.priority,
      checked: item.checked,
    })
    .where(eq(shoppingListItems.id, itemId))
    .returning();
  return updatedItem[0];
};

export const deleteShoppingListItem = async (itemId: string) => {
    const deletedItem = await db.delete(shoppingListItems)
        .where(eq(shoppingListItems.id, itemId));

    return deletedItem;
};


export const toggleItemCheckedStatus = async (itemId: string) => {
    const updatedItem = await db.update(shoppingListItems)
        .set({
            checked: not(shoppingListItems.checked)
        })
        .where(eq(shoppingListItems.id, itemId))
        .returning({
            id: shoppingListItems.id,
            checked: shoppingListItems.checked,
        });

    return updatedItem[0];
};

//get shoppinglist id from household id
export const getShoppingListId = async (householdId: string): Promise<string | undefined> => {
    const shoppingList = await db.query.shoppingLists.findFirst({
        where(fields, operators) {
            return eq(fields.household_id, householdId);
        },
    });
    return shoppingList?.id;
};


//add a shopping list item

export const addShoppingListItem = async ( 
    item: ShoppingListItem,
    household_id: string,
) => {
   
    const uniqueId = generateAlphanumericId(9);

    const newItem = await db.insert(shoppingListItems).values({
        id : uniqueId,
        shopping_list_id : item.shopping_list_id as string, 
        name: item.name,
        category: item.category,
        unit: item.unit,
        quantity: item.quantity,
        priority: item.priority,
        checked: false,
        createdAt: item.createdAt ?? null,
        addedBy: item.addedBy ?? '',
    }).returning({
       //return the newly created item
        id: shoppingListItems.id,
        name: shoppingListItems.name,
        unit: shoppingListItems.unit,
        quantity: shoppingListItems.quantity,
        category: shoppingListItems.category,
        priority: shoppingListItems.priority,
        checked: shoppingListItems.checked,
    })
    revalidatePath(`/dashboard/${household_id}`,"page");
    return newItem;
};