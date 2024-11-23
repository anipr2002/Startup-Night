"use client";

import { useEffect } from "react";
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

import { addInventoryItem, getInventoryId } from "@/actions/inventoryActions";
import useHouseHoldIDStore from "@/store/store";
import useActionState from "@/store/actionStore";
import useInventoryStore from "@/store/inventoryStore";

const formSchema = z.object({
  jar: z.enum(["Jar 1", "Jar 2", "Jar 3", "Jar 4"]),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(0, "Quantity must be at least 1"),
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

const InventoryForm = () => {
  const { householdId } = useHouseHoldIDStore();
  const { setInventoryOpen } = useActionState();
  const { setAddToInventory } = useInventoryStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      unit: "piece",
      category: "Other",
      expiryDate: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  useEffect(() => {
    if (householdId) {
      getInventoryId(householdId).then((id) => {
        if (id) {
          console.log("Inventory ID", id);
        } else {
          console.log("No Inventory");
        }
      });
    }
  }, [householdId]);

  const onSubmit = async (data: FormValues) => {
    const uniqueId = generateAlphanumericId(8);
    const item = {
      id: uniqueId,
      ...data,
      expiryDate: data.expiryDate.to,
      inventory_id: await getInventoryId(householdId),
      addedAt: new Date(),
    };

    setInventoryOpen(false);
    setAddToInventory([
      {
        ...item,
        unit: item.unit ?? null,
        inventory_id: item.inventory_id || "",
        addedAt: item.addedAt ?? null,
      },
    ]);
    await addInventoryItem(
      {
        ...item,
        unit: item.unit ?? null,
        inventory_id: item.inventory_id || "",
        addedAt: item.addedAt ?? null,
      },
      householdId
    );
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
            name="jar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jar</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a jar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formSchema.shape.jar._def.values.map((jar) => (
                      <SelectItem key={jar} value={jar}>
                        {jar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default InventoryForm;
