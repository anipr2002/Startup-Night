"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getHouseholdNameFromId } from "@/actions/householdActions";
import useHouseHoldIDStore from "@/store/store";
import { UserButton } from "@clerk/nextjs";
import { House } from "lucide-react";
import Inventory from "./_Inventory/Inventory";
import ShoppingList from "./_ShoppingList/ShoppingList";
import People from "./_People/People";
import { FancySwitch } from "@/components/fancy-switch";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import SettingsMenu from "./_Settings/Settings";
import Image from "next/image";

const MainDashboard = () => {
  const { setHouseholdId } = useHouseHoldIDStore();
  const [name, setName] = useState<string>("");
  const pathname = usePathname();
  const householdId = pathname.split("/")[2];

  const orderTypes: string[] = ["Inventory", "Shopping", "People"];
  const [orderType, setOrderType] = useState<string>();

  useEffect(() => {
    if (householdId) {
      getHouseholdNameFromId(householdId).then((name) => {
        if (name) {
          setName(name);
          setHouseholdId(householdId);
        }
      });
    }
  }, [householdId, setHouseholdId, setName]);

  //default to shopping list when page loads

  useEffect(() => {
    setOrderType("Inventory");
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, x: 0, y: 0 },
    out: { opacity: 0, y: 20 },
  };

  const pageTransition = {
    type: "spring",
    ease: "anticipate",
    stiffness: 400,
    damping: 20,
    duration: 0.3,
  };

  const router = useRouter();

  return (
    <>
      {/* Header */}
      <div className="flex h-10 items-center justify-between mt-4 ">
        <div className="text-2xl font-bold flex items-center gap-2">
          <Image src="/logo.svg" alt="PantryPal Logo" width={20} height={20} />
          {name}&apos;s Dashboard
        </div>
        <div className="flex gap-4 items-center justify-center ">
          <div className="flex items-center text-muted-foreground gap-4">
            <div
              role="button"
              onClick={() => {
                console.log("Redirecting");
                router.push("/dashboard");
              }}
            >
              <House className="w-6 h-6 text-muted-foreground" />
            </div>
            <SettingsMenu />
          </div>
          <div className="flex items-center">
            <UserButton />
          </div>
        </div>
      </div>

      <FancySwitch
        // defaultValue={"Inventory"}
        value={orderType}
        onChange={(value) => setOrderType(value.toString())}
        options={orderTypes}
        className="flex rounded-md bg-muted p-2 my-4"
        highlighterClassName="bg-red-400 dark:bg-primary rounded-sm"
        radioClassName={cn(
          "whitespace-nowrap relative mx-2 flex w-full focus:outline-none h-9 cursor-pointer items-center justify-center rounded-sm px-3.5 text-sm font-medium transition-colors data-[checked]:text-primary-foreground"
        )}
        highlighterIncludeMargin={true}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={orderType}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {orderType === "Shopping" && <ShoppingList />}
          {orderType === "Inventory" && <Inventory />}
          {orderType === "People" && <People />}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MainDashboard;
