
"use server";
// import { isInHousehold } from "@/actions/userActions";
import { currentUser } from "@clerk/nextjs/server";
import { getHouseholdMembers } from "@/actions/householdActions";

export const checkUserAccessToHousehold = async (userId: string, householdId: string) => {
  const members = await getHouseholdMembers(householdId);
  console.log("Members", members);
  const userList = members.map((member) => member.id);
  console.log("User List", userList);

  if (userList.includes(userId)) {
    return true;
  }

  return false;
};

export const getCurrentUser = async () => {
  return await currentUser();
};