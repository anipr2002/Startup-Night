import React from "react";
import { cn } from "@/lib/utils";

interface IconsProps {
  name: string;
  className?: string;
}

const Icons = ({ name, className }: IconsProps) => {
  if (name === "Fruits") {
    return (
      <div
        className={cn(
          "p-1 bg-red-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🍌
      </div>
    );
  }
  if (name === "Vegetables") {
    return (
      <div
        className={cn(
          "p-1 bg-blue-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🥕
      </div>
    );
  }
  if (name === "Meat/Eggs") {
    return (
      <div
        className={cn(
          "p-1 bg-green-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🍳
      </div>
    );
  }
  if (name === "Dairy") {
    return (
      <div
        className={cn(
          "p-1 bg-cyan-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🥛
      </div>
    );
  }
  if (name === "Grains") {
    return (
      <div
        className={cn(
          "p-1 bg-purple-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🍚
      </div>
    );
  }
  if (name === "Bread") {
    return (
      <div
        className={cn(
          "p-1 bg-rose-400 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🥐
      </div>
    );
  }
  if (name === "Cleaning") {
    return (
      <div
        className={cn(
          "p-1 bg-green-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🧹
      </div>
    );
  }
  if (name === "Beverages") {
    return (
      <div
        className={cn(
          "p-1 bg-blue-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🍺
      </div>
    );
  }
  if (name === "Other") {
    return (
      <div
        className={cn(
          "p-1 bg-indigo-200 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🛒
      </div>
    );
  }

  if (name === "Pasta") {
    return (
      <div
        className={cn(
          "p-1 bg-green-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🍝
      </div>
    );
  }

  if (name === "Condiments") {
    return (
      <div
        className={cn(
          "p-1 bg-purple-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🌶️
      </div>
    );
  }

  if (name === "Snacks") {
    return (
      <div
        className={cn(
          "p-1 bg-pink-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🍩
      </div>
    );
  }

  if (name === "Frozen") {
    return (
      <div
        className={cn(
          "p-1 bg-yellow-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        ❄️
      </div>
    );
  }

  if (name === "Canned") {
    return (
      <div
        className={cn(
          "p-1 bg-red-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        🥫
      </div>
    );
  }

  if (name === "High") {
    return (
      <div
        className={cn(
          "p-1 bg-red-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        ⌛
      </div>
    );
  }

  if (name === "Medium") {
    return (
      <div
        className={cn(
          "p-1 bg-yellow-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        ⌛
      </div>
    );
  }

  if (name === "Low") {
    return (
      <div
        className={cn(
          "p-1 bg-green-500 rounded-full flex w-full items-center justify-center",
          className
        )}
      >
        ⏳
      </div>
    );
  }

  if (name === "Cart") return <div className={cn("", className)}>🛒</div>;

  return null;
};

export default Icons;
// Fruits'| 'Vegetables'| 'Meat/Eggs'|'Dairy'| 'Grains'| 'Bread'| 'Cleaning'|'Beverages'|'Other',
