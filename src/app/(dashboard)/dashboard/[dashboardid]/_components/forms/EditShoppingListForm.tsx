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
  getShoppingListId,
  updateShoppingListItemById,
} from "@/actions/shoppingListActions";
import { getCurrentUser } from "../../../_components/util";
import useHouseHoldIDStore from "@/store/store";
import useActionState from "@/store/actionStore";
import useShoppingStore from "@/store/shoppingStore";

const formSchema = z.object({
  id: z.string().min(1, "Item id is required"),
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

const EditShoppingListForm = () => {
  const { householdId } = useHouseHoldIDStore();
  const {
    setEditShoppingListOpen,
    editShoppingListItem,
    setEditShoppingListItem,
  } = useActionState();
  const { updateShoppingListItem } = useShoppingStore();

  const item = editShoppingListItem;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || "",
      category: item.category,
      priority: item.priority,
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
    const item = {
      ...data,
      checked: false,
      unit: data.unit || null,
      addedBy: userID,
      createdAt: new Date(),
    };

    updateShoppingListItem(item);
    setEditShoppingListOpen(false);
    await updateShoppingListItemById(item.id, item);
  };

  const PRIORITY = ["Low", "Medium", "High"];

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
                    {PRIORITY.map((priority) => (
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
          Edit Item
        </Button>
      </form>
    </Form>
  );
};

export default EditShoppingListForm;
