"use client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { createHousehold, joinHousehold } from "@/actions/householdActions";
import { getCurrentUser } from "./util";
import { cn } from "@/lib/utils";
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
  houseHoldId: z.string().min(2, {
    message: "HouseHold Name must be at least 2 characters.",
  }),
});

const JoinHouseHold = () => {
  const { openJoinHousehold, setOpenJoinHousehold } = useHouseholdStore();
  // useEffect(() => {}, [open]);
  return (
    <Drawer open={openJoinHousehold} onOpenChange={setOpenJoinHousehold}>
      <DrawerTrigger asChild>
        <Button variant="accent">
          Join Household <ArrowRight className="ml-2" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Join Household</DrawerTitle>
          <DrawerDescription>
            Create a new Household. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <JoinHouseholdForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default JoinHouseHold;

function JoinHouseholdForm({ className }: React.ComponentProps<"form">) {
  const { openJoinHousehold, setOpenJoinHousehold } = useHouseholdStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      houseHoldId: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    joinHousehold(userID, data.houseHoldId);
    setOpenJoinHousehold(false);
  }

  const [householdId, setHouseholdId] = useState<string>("");
  const [userID, setUserID] = React.useState<string>("");

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserID(user);
      }
    });
    console.log("Submitted");
  }, []);

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

  //if submit is true refresh the page

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-4 p-4 py-0 bg-card"
      >
        <FormField
          control={form.control}
          name="houseHoldId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Household ID</FormLabel>
              <FormControl>
                <Input placeholder="123456789" {...field} />
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
