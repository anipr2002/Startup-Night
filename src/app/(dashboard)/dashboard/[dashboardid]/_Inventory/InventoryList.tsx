"use client";
import React, { useState } from "react";
import { InventoryItem } from "@/db/schema";
import Icons from "@/components/Icons";
import { cn } from "@/lib/utils";
import SwipeToDelete from "react-swipe-to-delete-ios";
import { Button } from "@/components/ui/button";
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
import useActionStore from "@/store/actionStore";
import { CircleUserRound, Clock } from "lucide-react";

type InventoryListProps = {
  item: InventoryItem;
  actions: any;
};

const caluclateDaysLeft = (date: Date) => {
  const today = new Date();
  const diff = Math.floor(
    (date.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );
  return diff;
};

const InventoryList = ({ item, actions }: InventoryListProps) => {
  const daysLeft = caluclateDaysLeft(item.expiryDate);

  const handleDelete = () => {
    actions.deleteItem(item);
    // setIsDeleted(false);
  };

  const [isDeleted, setIsDeleted] = useState(false);

  const {
    editInventoryItem,
    setEditInventoryOpen,
    editInventoryOpen,
    setEditInventoryItem,
  } = useActionStore();

  return (
    <>
      <AnimatePresence>
        {!isDeleted && (
          <>
            <Dialog
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 24,
              }}
            >
              <SwipeToDelete
                onDelete={handleDelete} // required
                // optional
                height={40} // default
                transitionDuration={250} // default
                deleteWidth={70} // default
                // deleteComponent={<TrashIcon className="h-5 w-5" />}
                // deleteThreshold={75} // default
                deleteColor="rgba(252, 58, 48, 1.00)" // default
                deleteText="Delete" // default
                disabled={false} // default
                id="swiper-1"
                className={cn("rounded-md overflow-visible mb-2")} // not default
                rtl={false} // default
                onDeleteConfirm={(onSuccess: any, onCancel: any) => {
                  setIsDeleted(true);
                  onSuccess();
                }}
              >
                <div
                  key={item.id}
                  className={cn(
                    "rounded-sm bg-muted p-1 flex items-center h-10 justify-start w-full px-2 relative z-50",
                    daysLeft <= 0 && "bg-red-600 text-white",
                    daysLeft > 0 && daysLeft <= 3 && " bg-[#f3bb1c] text-white"
                  )}
                >
                  <DialogTrigger className="flex-1">
                    <div className="flex items-center gap-x-3 w-full">
                      <div className="flex items-center gap-2">
                        <Icons name={item.category} className="text-[10px]" />
                        <h3 className="font-semibold">{item.name}</h3>
                      </div>
                      <div
                        className={cn(
                          "text-sm text-muted-foreground",
                          daysLeft <= 0 && "text-white",
                          daysLeft > 0 && daysLeft <= 3 && "text-white"
                        )}
                      >
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                  </DialogTrigger>
                  <div className="flex items-center gap-x-3 ">
                    <div
                      className={cn(
                        "text-muted-foreground text-sm",
                        daysLeft <= 0 && "text-white",
                        daysLeft > 0 && daysLeft <= 3 && "text-white"
                      )}
                    >
                      {daysLeft <= 0
                        ? "Expired"
                        : daysLeft > 0
                        ? `${daysLeft} days left`
                        : "Expired"}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground w-fit h-fit"
                      onClick={() => {
                        setEditInventoryOpen(true);
                        setEditInventoryItem(item);
                      }}
                    >
                      ✏️
                    </Button>
                  </div>
                </div>

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
                          <h1 className="font-roger text-2xl">
                            📝 Item Details
                          </h1>
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
                            Expiry Date
                          </div>
                          <div>
                            {item.expiryDate?.toDateString()}{" "}
                            <span
                              className={cn(
                                "text-sm text-muted-foreground",
                                daysLeft >= 0 &&
                                  daysLeft < 5 &&
                                  "text-yellow-300",
                                daysLeft <= 0 && "text-red-500"
                              )}
                            >
                              ({daysLeft} days left)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-stretch gap-x-12 mt-3">
                          <div className="flex items-center gap-x-2">
                            <Clock className=" text-sm" />
                            <span className=" text-sm">
                              {item.addedAt?.toDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-x-2">
                            <CircleUserRound className=" text-sm" />
                            {/* <span className=" text-sm">{user?.username}</span> */}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                    <DialogClose className="text-zinc-500" />
                  </DialogContent>
                </DialogContainer>
              </SwipeToDelete>
            </Dialog>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default InventoryList;
