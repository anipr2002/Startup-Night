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
import { CalendarDatePicker } from "@/components/calendar-date-picker";

import {
  updateInventoryItemById,
  getInventoryId,
} from "@/actions/inventoryActions";
import useHouseHoldIDStore from "@/store/store";
import useActionState from "@/store/actionStore";
import useInventoryStore from "@/store/inventoryStore";

const formSchema = z.object({
  id: z.string().min(1, "Item id is required"),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(0, "Quantity must be at least 1").multipleOf(0.01),
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
  expiryDate: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EditInventoryForm = () => {
  const { householdId } = useHouseHoldIDStore();
  const { editInventoryOpen, setEditInventoryOpen, editInventoryItem } =
    useActionState();
  const { updateInventoryItem } = useInventoryStore();

  const item = editInventoryItem;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: item.id,
      name: item.name,
      quantity: item.quantity || 0,
      unit: item.unit || "",
      category: item.category,
      expiryDate: {
        from: item.expiryDate || new Date(),
        to: item.expiryDate || new Date(),
      },
    },
  });

  const [inventoryId, setInventoryId] = useState<string>("");

  useEffect(() => {
    if (householdId) {
      getInventoryId(householdId).then((id) => {
        if (id) {
          setInventoryId(id);
          console.log("Inventory ID", id);
        } else {
          console.log("No Inventory");
        }
      });
    }
  }, [householdId]);

  const onSubmit = async (data: FormValues) => {
    const item = {
      ...data,
      expiryDate: data.expiryDate.to,
      inventory_id: inventoryId,
      addedAt: new Date(),
    };

    setEditInventoryOpen(false);
    updateInventoryItem(item);
    await updateInventoryItemById(item.id, item);
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

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.01}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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

        <div className="grid grid-cols-2 gap-4 mt-4">
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
                      <SelectItem key={category} value={category}>
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
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <CalendarDatePicker
                    date={field.value}
                    onDateSelect={field.onChange}
                    variant="outline"
                    numberOfMonths={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-4">
          Edit Item
        </Button>
      </form>
    </Form>
  );
};

export default EditInventoryForm;
