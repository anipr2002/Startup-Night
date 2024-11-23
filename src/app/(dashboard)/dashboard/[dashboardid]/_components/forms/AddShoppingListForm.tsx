"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Icons from "@/components/Icons";

import {
  addShoppingListItem,
  getShoppingListId,
} from "@/actions/shoppingListActions";
import { getCurrentUser } from "../../../_components/util";
import useHouseHoldIDStore from "@/store/store";
import useActionState from "@/store/actionStore";
import useShoppingStore from "@/store/shoppingStore";
import { create } from "domain";

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().optional(),
  category: z.enum([
    "Fruits",
    "Vegetables",
    "Meat/Eggs",
    "Dairy",
    "Grains",
    "Bread",
    "Cleaning",
    "Beverages",
    "Pasta",
    "Condiments",
    "Snacks",
    "Frozen",
    "Canned",
    "Other",
  ]),
  priority: z.enum(["Low", "Medium", "High"]),
});

type FormValues = z.infer<typeof formSchema>;

const ShoppingListForm = () => {
  const { householdId } = useHouseHoldIDStore();
  const { setShoppingListOpen } = useActionState();
  const { setAddToShoppingList } = useShoppingStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      unit: "pack",
      category: "Other",
      priority: "Low",
    },
  });

  useEffect(() => {
    if (householdId) {
      getShoppingListId(householdId).then((id) => {
        if (id) {
          console.log("Shopping List ID", id);
        } else {
          console.log("No Shopping List");
        }
      });
    }
  }, [householdId]);

  const [userID, setUserID] = useState<string>("");

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserID(user);
      }
    });
  }, []);

  const onSubmit = async (data: FormValues) => {
    const uniqueId = generateAlphanumericId(9);
    const item = {
      id: uniqueId,
      ...data,
      shopping_list_id: (await getShoppingListId(householdId)) || "",
      checked: false,
      unit: data.unit || null,
      addedBy: userID,
      createdAt: new Date(),
    };

    setShoppingListOpen(false);
    setAddToShoppingList([item]);
    await addShoppingListItem(item, householdId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-full max-w-[800px] mx-auto p-4 py-0 bg-card rounded-lg"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 mt-2">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Units</FormLabel>
                <FormControl>
                  <Input placeholder="Enter units" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formSchema.shape.category._def.values.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        defaultValue={"Fruits"}
                      >
                        <div className="flex items-center gap-x-2">
                          <Icons
                            name={category}
                            className="w-5 h-5 text-[10px] flex items-center justify-center"
                          />
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="top">
                    {formSchema.shape.priority._def.values.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-4 w-full">
          Add to List
        </Button>
      </form>
    </Form>
  );
};

function generateAlphanumericId(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default ShoppingListForm;
