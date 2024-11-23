"use client";
import React, { useState } from "react";
import { FancySwitch } from "@/components/fancy-switch";
import { cn } from "@/lib/utils";

const Switch = () => {
  const orderTypes = ["List", "Analytics"];
  const [orderType, setOrderType] = useState<string>("List");

  return (
    <FancySwitch
      // defaultValue={""}
      value={orderType}
      onChange={(value) => setOrderType(value.toString())}
      options={orderTypes}
      className="flex rounded-md bg-muted"
      highlighterClassName="bg-red-400 dark:bg-primary rounded-sm"
      radioClassName={cn(
        "whitespace-nowrap relative mx-2 flex w-fit focus:outline-none h-9 cursor-pointer items-center justify-center rounded-sm px-3.5 text-sm font-medium transition-colors data-[checked]:text-primary-foreground"
      )}
      highlighterIncludeMargin={true}
    />
  );
};

export default Switch;
