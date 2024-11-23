"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type PeopleListProps = {
  id: string;
  username: string;
  imageUrl?: string;
  currentUser: boolean;
  admin: boolean;
};

const PeopleList = ({
  id,
  username,
  imageUrl,
  currentUser,
  admin,
}: PeopleListProps) => {
  return (
    <div className="flex items-center gap-4 my-3 w-full">
      <Avatar>
        <AvatarImage src={imageUrl} alt="@shadcn" />
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div
        className={cn("flex flex-col flex-1", currentUser && "text-[#f56565]")}
      >
        <div className="flex items-center justify-start gap-x-4">
          <div className="text-sm font-medium">{username}</div>
          {admin && (
            <Badge
              variant="outline"
              className="bg-[#f56565] text-white text-xs"
            >
              Admin
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{id}</div>
      </div>
    </div>
  );
};

export default PeopleList;
