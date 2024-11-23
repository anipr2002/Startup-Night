import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, House, HousePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getHouseholds } from "@/actions/householdActions";
import { redirect } from "next/navigation";
import { households } from "@/db/schema";
import HouseholdList from "./_components/HouseholdList";
import AddHouseHold from "./_components/AddHouseHold";
import JoinHouseHold from "./_components/JoinHouseHold";

import { SignOutButton } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const householdListfromUser = await getHouseholds(user.id);

  return (
    <MaxWidthWrapper className="font-roger" key={user.id}>
      <div className="flex justify-between item-center mt-5 ">
        <div className="text-2xl flex items-center">
          Welcome, {user?.firstName}!
        </div>
        <div className="">
          <SignOutButton>
            <Button className="" variant={"outline"}>
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
      {householdListfromUser.length > 0 && (
        <p className="mt-4 text-muted-foreground">Choose your household</p>
      )}
      {householdListfromUser.length > 0 ? (
        householdListfromUser.map((household) => (
          <>
            <HouseholdList households={household} key={household.id} />
          </>
        ))
      ) : (
        <>
          <div className="mt-4 text-muted-foreground">
            Create or join a household to get started
          </div>
        </>
      )}

      <div className="flex gap-2 w-full justify-center mt-5">
        <AddHouseHold />
        <JoinHouseHold />
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
