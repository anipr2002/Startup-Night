"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { checkUserAccessToHousehold } from "./utils";
import { FamilyButton } from "@/components/ui/family-button";
import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import useMeasure from "react-use-measure";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import useActionState from "@/store/actionStore";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Inventory from "./_Inventory/Inventory";
import ShoppingListForm from "./_components/forms/AddShoppingListForm";
import Image from "next/image";
import InventoryForm from "./_components/forms/AddInventoryForm";
import { getCurrentUser } from "../_components/util";
import useHouseholdStore from "@/store/store";
import useUserStore from "@/store/userStore";
import { Spinner } from "@/components/ui/spinner";
import { ClipboardPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const {
    shoppingListOpen,
    setShoppingListOpen,
    inventroyOpen,
    setInventoryOpen,
    setSection,
    section,
  } = useActionState();

  const { setUser, user } = useUserStore();

  const router = useRouter();

  const { householdId } = useHouseholdStore();

  const [userID, setUserID] = useState<string>("");

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserID(user);
        setUser({
          id: user,
        });
        console.log("User ID", user);
      }
    });
  }, []);

  //if user is not in household, redirect to home
  const [isInHousehold, setIsInHousehold] = useState<boolean>(true);

  const checkAccess = useCallback(async () => {
    const user = await getCurrentUser();
    if (user && householdId) {
      const access = await checkUserAccessToHousehold(user, householdId);
      setIsInHousehold(access);
      setUserID(user);
    }
  }, [householdId]);

  useEffect(() => {
    checkAccess();
  }, [householdId, router, userID, isInHousehold, checkAccess]);

  const AddButton = () => {
    return (
      <>
        <div
          className={cn(
            "z-[999999] h-14 w-14 rounded-full dark:bg-white bg-black/80 fixed bottom-7 right-7 transition-all duration-300 ease-linear",
            inventroyOpen
              ? "hidden"
              : " transition-all duration-[2000] ease-linear",
            shoppingListOpen
              ? "hidden"
              : " transition-all duration-1000 ease-linear"
          )}
          onClick={() => {
            if (section === "ShoppingList") {
              //sleep for a second to make sure the drawer closes
              //   setTimeout(() => {
              setShoppingListOpen(true);
              //   }, 200);
              //   setShoppingListOpen(true);
            } else {
              //   setTimeout(() => {
              setInventoryOpen(true);
              //   }, 200);
            }
          }}
        >
          <div className="flex items-center justify-center h-full w-full">
            {/* <PlusIcon className="h-10 w-10 text-white dark:text-black/80" /> */}
            <ClipboardPlus className="h-6 w-6 text-white dark:text-black/80" />
          </div>
        </div>
      </>
    );
  };

  return (
    <MaxWidthWrapper className="font-roger px-3" key={userID}>
      {isInHousehold && (
        <>
          <Drawer open={shoppingListOpen} onOpenChange={setShoppingListOpen}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Shopping List</DrawerTitle>
                <DrawerDescription>
                  Add a new Item into your Shopping List. Click save when
                  you&apos;re done.
                </DrawerDescription>
              </DrawerHeader>
              <ShoppingListForm />
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Drawer open={inventroyOpen} onOpenChange={setInventoryOpen}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Inventory</DrawerTitle>
                <DrawerDescription>
                  Create a new Household. Click save when you&apos;re done.
                </DrawerDescription>
              </DrawerHeader>
              <InventoryForm />
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <AddButton />
          {children}
        </>
      )}
      {/* After 10 seconds display a message */}
      {!isInHousehold && (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <Spinner />
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Go Back
          </Button>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Layout;

let tabs = [
  { id: 0, label: "List" },
  { id: 1, label: "Inventory" },
];
