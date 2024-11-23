import { InventoryItem } from "@/db/schema";
import React from "react";
import Icons from "@/components/Icons";
import { cn } from "@/lib/utils";

type ExpiringSoonListProps = {
  item: InventoryItem;
  daysLeft: number;
};

const ExpiringSoonList = ({ item, daysLeft }: ExpiringSoonListProps) => {
  return (
    <>
      <div
        className={cn(
          "flex flex-col items-center justify-center border w-[80px] rounded-md p-3 text-center text-wrap bg-red-600 text-white gap-2",
          daysLeft > 0 && daysLeft <= 3 && "bg-[#f3bb1c]"
        )}
      >
        <Icons name={item.category} className="" />
        <h3 className="font-semibold">{item.name}</h3>
      </div>
    </>
  );
};

export default ExpiringSoonList;
