"use client";
import React, { useEffect, useState } from "react";
import { currentUser } from "@clerk/nextjs/server";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, House, HousePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Household } from "@/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getHouseholdNameFromId } from "@/actions/householdActions";
import useHouseHoldIDStore from "@/store/store";

type HouseholdListProps = {
  households: Household;
};

const HouseholdList = ({ households }: HouseholdListProps) => {
  const { setHouseholdId, householdId, setHouseholdName } =
    useHouseHoldIDStore();

  useEffect(() => {
    if (households.id) {
      getHouseholdNameFromId(households.id).then((name) => {
        if (name) {
          console.log("Name", name);
          setHouseholdName(name);
        }
      });
    }
  }, [households.id, setHouseholdName]);

  return (
    <>
      <Link
        href={`/dashboard/${households.id}`}
        onClick={() => {
          setHouseholdId(households.id);
          console.log(householdId);
        }}
      >
        <Card className="w-full mt-5 max-w-sm p-6 flex items-center justify-start">
          <div className="flex items-center gap-4">
            <div className="bg-muted rounded-md p-3 flex items-center justify-center">
              <House className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">
              {households.name}&apos;s Household
            </h3>
          </div>
        </Card>
      </Link>
    </>
  );
};

export default HouseholdList;
