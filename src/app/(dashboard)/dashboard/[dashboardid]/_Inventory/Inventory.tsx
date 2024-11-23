//@ts-nocheck
"use client";
import Icons from "@/components/Icons";
import { Button } from "@/components/ui/button";
import useActionState from "@/store/actionStore";
import useHouseHoldIDStore from "@/store/store";
import useInventoryStore from "@/store/inventoryStore";
import React, { useEffect, useState } from "react";
import {
  getInventoryForHousehold,
  deleteInventoryItem,
  decreaseItemQuantity,
} from "@/actions/inventoryActions";
import InventoryList from "./InventoryList";
import ExpiringSoon from "./components/ExpiringSoon";
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
import EditInventoryForm from "../_components/forms/EditInventoryForm";
import Switch from "./components/Switch";
import FancySwitch from "@/components/fancy-switch";
import InventoryItemCard from "./InventoryNew";
import { cn } from "@/lib/utils";

const Inventory = () => {
  const { householdId } = useHouseHoldIDStore();
  const {
    setAddToInventory,
    inventoryItems,
    setToInventory,
    updateInventoryItem,
  } = useInventoryStore();
  const {
    inventroyOpen,
    setInventoryOpen,
    editInventoryItem,
    setEditInventoryOpen,
    editInventoryOpen,
    setEditInventoryItem,
    setSection,
  } = useActionState();

  const handleInventoryOpen = () => {
    setInventoryOpen(!inventroyOpen);
  };

  useEffect(() => {
    if (householdId) {
      getInventoryForHousehold(householdId).then((list) => {
        if (list) {
          console.log("Inventory", list);
          setToInventory(list);
        } else {
          setToInventory([]);
          console.log("No Inventory");
        }
      });
    }
  }, [householdId, setAddToInventory, setToInventory, updateInventoryItem]);

  useEffect(() => {
    setSection("Inventory");
  }, []);

  // Group inventory items by category
  const groupedItems = inventoryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const actions = {
    deleteItem: (item: InventoryItem) => {
      deleteInventoryItem(item.id).then((id) => {
        console.log("Item deleted", id);
      });
    },
    decreaseItemQuantity: (item: InventoryItem, quantity: number) => {
      decreaseItemQuantity(item.id, quantity).then((id) => {
        console.log("Item quantity decreased", id);
      });
    },
  };

  const orderTypes: string[] = ["Analytics", "List"];
  const [orderType, setOrderType] = useState<string>();

  return (
    <>
      <div className="w-fit justify-end">{/* <Switch /> */}</div>

      <div className="flex flex-col items-center justify-center mt-4 w-full gap-4">
        {inventoryItems.map((item, index) => (
          <InventoryItemCard
            jarType={index + 1}
            key={item.id}
            inventoryItem={item}
          />
        ))}
      </div>
      {/* {
        <div className="flex flex-col items-center justify-center mt-4 w-full">
          {Object.keys(groupedItems).map((category) => (
            <div key={category} className="w-full mb-4">
              <div className="text-muted-foreground text-sm border border-dashed w-full text-center p-1 rounded-md my-2">
                {category}
              </div>
              {groupedItems[category].map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <InventoryList key={item.id} item={item} actions={actions} />
                </div>
              ))}
            </div>
          ))}
        </div>
      } */}

      <Drawer open={editInventoryOpen} onOpenChange={setEditInventoryOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Inventory Item</DrawerTitle>
            <DrawerDescription>
              Edit an existing Inventory Item. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <EditInventoryForm />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Inventory;
