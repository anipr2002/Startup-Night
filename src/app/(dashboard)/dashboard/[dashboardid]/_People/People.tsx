"use client";
import React, { useEffect } from "react";
import useHouseHoldIDStore from "@/store/store";
import {
  getHouseholdAdminId,
  getHouseholdMembers,
} from "@/actions/householdActions";
import { getUserById } from "@/actions/userActions";
import { HouseholdMember, User } from "@/db/schema";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { getCurrentUser } from "../../_components/util";
import PeopleList from "./PeopleList";
import { BlockCopyButton } from "@/components/ui/block-copy-button";
import { Skeleton } from "@/components/ui/skeleton";

const People = () => {
  const { householdId } = useHouseHoldIDStore();

  const [users, setUsers] = React.useState<User[]>([]);
  const [currentUser, setCurrentUser] = React.useState<string | undefined>();
  const [adminId, setAdminId] = React.useState<string | undefined>();

  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log(user);
      setCurrentUser(user);
    });

    getHouseholdAdminId(householdId).then((adminId) => {
      console.log(adminId);
      setAdminId(adminId);
    });
  }, []);

  useEffect(() => {
    getHouseholdMembers(householdId).then((members) => {
      console.log(members);
      setUsers(members);
    });
  }, [householdId]);

  //return a list of usersnames,  if current user then hightlight

  if (users.length === 0) {
    return (
      <>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="">
      <div>
        {users.map((user) => (
          <PeopleList
            key={user.id}
            id={user.id}
            username={user.username}
            admin={adminId === user.id}
            currentUser={currentUser === user.id}
            imageUrl={user.imageUrl}
          />
        ))}
      </div>
      <div className="mt-10 flex items-center justify-between opacity-50">
        <div>Invite People to Household</div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">{householdId}</span>
          <BlockCopyButton name="Copy Code" code={householdId} />
        </div>
      </div>
    </div>
  );
};

export default People;
