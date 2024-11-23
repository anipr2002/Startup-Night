"use client";
import React, { useEffect } from "react";
import { getShoppingListForHousehold } from "@/actions/shoppingListActions";
import useHouseHoldIDStore from "@/store/store";
import { ShoppingListItem } from "@/db/schema";
import ListItem from "./ShoppingListItem";
import {
  deleteShoppingListItem,
  toggleItemCheckedStatus,
} from "@/actions/shoppingListActions";

import useShoppingStore from "@/store/shoppingStore";
import useActionState from "@/store/actionStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Timings from "@/components/ui/timings";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EditShoppingListForm from "../_components/forms/EditShoppingListForm";

const ShoppingList = () => {
  const {
    shoppingListItems,
    setAddToShoppingList,
    setToShoppingList,
    updateShoppingListItem,
  } = useShoppingStore();
  const { householdId } = useHouseHoldIDStore();

  const {
    shoppingListOpen,
    setShoppingListOpen,
    editShoppingListOpen,
    setEditShoppingListOpen,
    setSection,
  } = useActionState();

  const handleShoppingListOpen = () => {
    setShoppingListOpen(!shoppingListOpen);
  };
  const actions = {
    removeItem: (item: ShoppingListItem) => {
      deleteShoppingListItem(item.id).then((id) => {
        console.log("Item removed", id);
      });
    },
    checkItem: (item: ShoppingListItem) => {
      toggleItemCheckedStatus(item.id).then((id) => {
        console.log("Item checked", id);
      });
    },
  };

  const daysSinceAdded = (date: Date): number => {
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 3600 * 24)
    );

    console.log("Days since added", diff);
    return diff;
  };

  useEffect(() => {
    if (householdId) {
      getShoppingListForHousehold(householdId).then((list) => {
        if (list) {
          console.log("Shopping List", list);
          setToShoppingList(list);
        } else {
          setToShoppingList([]);
          console.log("No Shopping List");
        }
      });
    }
  }, [
    householdId,
    setAddToShoppingList,
    setToShoppingList,
    updateShoppingListItem,
  ]);

  useEffect(() => {
    setSection("ShoppingList");
  }, []);

  //if no shopping list items, return a message
  if (shoppingListItems.length === 0) {
    return (
      <>
        <Timings />
        <div className="flex items-center justify-start mt-4 px-2">
          <div className="text-muted-foreground text-sm">
            No items in your shopping list.
          </div>
        </div>
      </>
    );
  }

  if (shoppingListItems.length > 0) {
    return (
      <>
        <Timings />
        {shoppingListItems.map(
          (item) =>
            item.createdAt &&
            daysSinceAdded(item.createdAt) < 7 && (
              <ListItem key={item.id} item={item} actions={actions} />
            )
        )}

        <div className="text-muted-foreground text-sm mt-4">
          Added more than
          <span className="font-bold text-red-500"> 7 days </span>ago
        </div>

        {shoppingListItems.map(
          (item) =>
            item.createdAt &&
            daysSinceAdded(item.createdAt) >= 7 && (
              <>
                <ListItem key={item.id} item={item} actions={actions} />
              </>
            )
        )}

        <Drawer
          open={editShoppingListOpen}
          onOpenChange={setEditShoppingListOpen}
        >
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit Shopping List</DrawerTitle>
              <DrawerDescription>
                Edit an existing Shopping List. Click save when you&apos;re
                done.
              </DrawerDescription>
            </DrawerHeader>
            <EditShoppingListForm />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
};

export default ShoppingList;
