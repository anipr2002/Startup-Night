"use client";
import React, { useEffect, useState } from "react";
import { ShoppingListItem, User } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Clock, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icons from "@/components/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogContainer,
} from "@/components/core/dialog";
import { ScrollArea } from "@/components/core/scroll-area";
import { getUserDetails } from "@/actions/userActions";
import useActionStore from "@/store/actionStore";

const ListItem = ({
  item,
  actions,
}: {
  item: ShoppingListItem;
  actions: any;
}) => {
  const [checked, setChecked] = useState<boolean>(item.checked);
  const [deleted, setDeleted] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    actions.checkItem(item);
    setChecked(!checked);
  };

  const handleDeleteItem = () => {
    actions.removeItem(item);
    setDeleted(true);
  };

  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    getUserDetails(item.addedBy).then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [item.addedBy]);

  const { setEditShoppingListOpen, setEditShoppingListItem } = useActionStore();

  return (
    <>
      <AnimatePresence>
        {!deleted && (
          <>
            <Dialog
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 24,
              }}
            >
              <motion.div
                initial={{ opacity: 1, scale: 1, x: 0 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ scale: 0.9, x: 10, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "circIn",
                  bounce: 0.2,
                }}
                className={cn(
                  "bg- text-foreground sm:p-2 transition-all duration-300",
                  checked &&
                    "line-through text-gray-500 opacity-20 transition-all duration-300"
                )}
              >
                <ul className="grid gap-4 mt-1">
                  <li
                    key={item.id}
                    className={cn(
                      "bg-primary-foreground rounded-lg shadow-sm p-2 grid grid-cols-[1fr_auto] gap-2 tranisition-all duration-300",
                      checked &&
                        "line-through text-gray-500 opacity-20 transition-all duration-300",
                      item.priority === "Low" && "",
                      item.priority === "Medium" &&
                        "border border-yellow-500 border-dashed",
                      item.priority === "High" &&
                        "border border-red-500 border-dashed"
                    )}
                  >
                    <DialogTrigger>
                      <div className="flex items-center gap-x-3">
                        <div className="flex items-center gap-2">
                          <Icons name={item.category} />
                          <h3 className="font-semibold">{item.name}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                    </DialogTrigger>
                    <div className="flex items-center gap-5 justify-stretch w-full">
                      {/* <Icons name={item.priority} className="text-[10px]" /> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground w-fit h-fit"
                        onClick={() => {
                          setEditShoppingListOpen(true);
                          setEditShoppingListItem(item);
                        }}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground  w-fit h-fit"
                        onClick={handleDeleteItem}
                      >
                        🗑️
                        {/* <TrashIcon size={20} className="" /> */}
                        {/* <span className="sr-only">Delete {item.name}</span> */}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground w-fit h-fit"
                        onClick={handleCheckboxChange}
                      >
                        🛒
                        {/* <ShoppingCart size={20} className="" /> */}
                      </Button>
                    </div>
                  </li>
                </ul>
              </motion.div>

              <DialogContainer className="px-2 font-roger">
                <DialogContent
                  style={{
                    borderRadius: "12px",
                  }}
                  className="relative h-auto w-[500px] bg-secondary"
                >
                  <ScrollArea className="h-[40vh]" type="scroll">
                    <div className="relative p-6 ">
                      <div className="flex items-center justify-start gap-x-10">
                        <h1 className="font-roger text-2xl">📝 Item Details</h1>
                      </div>
                      <Separator className="mt-4 bg-primary" />
                    </div>
                    <div className="flex flex-col px-6 gap-3 ">
                      <div className="flex items-center gap-x-2">
                        <div className="border border-dashed border-muted-foreground rounded-sm px-1 bg-[#FF8080] dark:bg-[#03AED2] w-fit text-sm">
                          Name
                        </div>
                        <div>{item.name}</div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <div className="border border-dashed border-muted-foreground rounded-sm px-1 bg-[#F6FDC3] dark:bg-[#0079FF] w-fit text-sm">
                          Category
                        </div>
                        <div>
                          <Icons name={item.category} className="" />
                        </div>
                      </div>

                      <div className="flex items-center gap-x-10">
                        <div className="flex items-center gap-x-2">
                          <div className="border border-dashed border-muted-foreground rounded-sm px-1 bg-[#FFCF96] dark:bg-[#006769] w-fit text-sm">
                            Quantity
                          </div>
                          <div>{item.quantity}</div>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <div className="border border-dashed border-muted-foreground rounded-sm px-1 bg-[#CDFAD5] dark:bg-[#EA8FEA] w-fit text-sm">
                            Units
                          </div>
                          <div>{item.unit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <div className="border border-dashed border-muted-foreground rounded-sm px-1 bg-[#F6FB7A] dark:bg-[#FF0060] w-fit text-sm">
                          Priority
                        </div>
                        <div
                          className={cn(
                            item.priority === "Low" && "",
                            item.priority === "Medium" && "text-yellow-300",
                            item.priority === "High" && "text-red-500"
                          )}
                        >
                          {item.priority}
                        </div>
                      </div>

                      <div className="flex items-center justify-stretch gap-x-12 mt-3">
                        <div className="flex items-center gap-x-2">
                          <Clock className=" text-sm" />
                          <span className=" text-sm">
                            {item.createdAt?.toDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-x-2">
                          <CircleUserRound className=" text-sm" />
                          <span className=" text-sm">{user?.username}</span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <DialogClose className="text-zinc-500" />
                </DialogContent>
              </DialogContainer>
            </Dialog>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ListItem;
