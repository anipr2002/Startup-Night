"use client";
import React, { useState } from "react";
import { InventoryItem } from "@/db/schema";
import ExpiringSoonList from "./ExpiringSoonList";

type ExpiringSoonProps = {
  items: InventoryItem[];
};

const caluclateDaysLeft = (date: Date) => {
  const today = new Date();
  const diff = Math.floor(
    (date.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );
  return diff;
};

const ExpiringSoon = ({ items = [] }: ExpiringSoonProps) => {
  const expiredItems = items.filter((item) => {
    const daysLeft = caluclateDaysLeft(item.expiryDate);

    //return items that are expired and are about to expire
    return daysLeft <= 0 || (daysLeft > 0 && daysLeft <= 3);
  });

  console.log("Expired Items", expiredItems);

  return (
    <>
      <div className="flex gap-x-2 overflow-x-auto ">
        {expiredItems.map((item) => (
          <ExpiringSoonList
            key={item.id}
            item={item}
            daysLeft={caluclateDaysLeft(item.expiryDate)}
          />
        ))}
      </div>
    </>
  );
};

export default ExpiringSoon;
