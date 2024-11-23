"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, House, HousePlus } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "./util";
import { createHousehold, joinHousehold } from "@/actions/householdActions";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useHouseholdStore } from "@/store/store";
import confetti from "canvas-confetti";

const FormSchema = z.object({
  houseHoldName: z.string().min(2, {
    message: "HouseHold Name must be at least 2 characters.",
  }),
});

const AddHouseHold = () => {
  const { openCreateHousehold, setOpenCreateHousehold } = useHouseholdStore();
  return (
    <>
      {/* <div className="flex gap-2 w-full justify-center mt-5"> */}
      <Drawer open={openCreateHousehold} onOpenChange={setOpenCreateHousehold}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            Create Household <HousePlus className="ml-2" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Create Household</DrawerTitle>
            <DrawerDescription>
              Create a new Household. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <AddHouseholdForm className="px-4" />
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

export default AddHouseHold;

function AddHouseholdForm({ className }: React.ComponentProps<"form">) {
  const { openCreateHousehold, setOpenCreateHousehold } = useHouseholdStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      houseHoldName: "",
    },
  });

  const handleClick = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("User ID", userID);
    console.log("Household Name", data.houseHoldName);
    createHousehold(userID, data.houseHoldName);
    setOpenCreateHousehold(false);
  }

  const [householdName, setHouseholdName] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [userID, setUserID] = React.useState<string>("");

  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log(user);
      if (user) {
        setUserID(user);
      }
    });
    console.log("Submitted");
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-4 p-4 py-0 bg-card"
      >
        <FormField
          control={form.control}
          name="houseHoldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Household Name</FormLabel>
              <FormControl>
                <Input placeholder="Shady Household" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onClick={handleClick}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
