import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Weight, Utensils } from "lucide-react";
import { InventoryItem } from "../../../../../db/schema";
import useActionStore from "@/store/actionStore";
import Icons from "@/components/Icons";

export default function InventoryItemCard({
  inventoryItem,
  jarType,
  actions,
}: {
  inventoryItem: InventoryItem;
  jarType: number;
  actions: any;
}) {
  // Calculate percentage of weight
  const percentage = (inventoryItem.quantity / 1000) * 100;

  const { setInventoryOpen, setEditInventoryOpen, setEditInventoryItem } =
    useActionStore();

  return (
    <Card
      onClick={() => {
        setInventoryOpen(!setInventoryOpen);
        setEditInventoryItem(inventoryItem);
        setEditInventoryOpen(true);
      }}
      className="w-full h-[350px] overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl relative"
    >
      {/* Background fill based on weight */}
      <div
        className="absolute bottom-0 left-0 w-full bg-primary/10 transition-all duration-300 ease-in-out"
        style={{ height: `${percentage}%` }}
      />

      <CardContent className="p-0 h-full flex flex-col relative z-10">
        <div className="flex-grow flex flex-col items-center justify-center">
          <Icons
            name={inventoryItem.category}
            className="w-28 h-28 text-5xl rounded-md bg-transparent"
          />
          <h3 className="text-xl font-semibold text-center text-foreground mb-2">
            {inventoryItem.name}
          </h3>
          <Badge variant="secondary" className="text-xs font-normal mb-2">
            <Weight className="w-3 h-3 mr-1" />
            {inventoryItem.quantity} grams
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            {percentage.toFixed(1)}% full
          </Badge>
        </div>
        <div className="bg-muted p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Jar {jarType}
            </span>
          </div>
          <Badge variant={percentage < 10 ? "destructive" : "secondary"}>
            {percentage < 10
              ? "Empty"
              : inventoryItem.quantity > 0 && inventoryItem.quantity < 10
              ? "Low"
              : inventoryItem.quantity > 10 && inventoryItem.quantity < 20
              ? "Medium"
              : inventoryItem.quantity > 20 && inventoryItem.quantity < 30
              ? "High"
              : "Very High"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
