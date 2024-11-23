"use server";
import db from "@/db/drizzle";
import { households, household_members, users, Household, HouseholdMember, User, shoppingLists, inventory} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getHouseholds = async (userId: string): Promise<Household[]> => {
  const userHouseholds = await db.query.household_members.findMany({
    where: eq(household_members.user_id, userId),
    with: {
      household: true,
    },
  });

  return userHouseholds.map((member) => member.household);
};


const generateCode = () => {
    const code = Math.floor(Math.random() * 100000).toString();
    return code;
};

function generateAlphanumericId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const uniqueId = generateAlphanumericId(10);
const uniqueId2 = generateAlphanumericId(9);
const uniqueId3 = generateAlphanumericId(8);

export const createHousehold = async (userId: string | undefined, householdName: string) => {
    const code = generateCode();
    const newHousehold = await db.insert(households).values({
        admin_id: userId as string,
        id : uniqueId,
        name: householdName,
        code: code,
    }).returning({
        id: households.id,
    })
    console.log("New Household", newHousehold);

    await db.insert(household_members).values({
        household_id : uniqueId,
        user_id : userId as string,
    })
    console.log("Membership Created");

    //add a default shopping list
    await db.insert(shoppingLists).values({
        id : uniqueId2,
        household_id : uniqueId,
    }).returning({
        id: shoppingLists.id,
    })

    //add a default inventory
    await db.insert(inventory).values({
        id : uniqueId3,
        household_id : uniqueId,
    }).returning({
        id: inventory.id,
    })


    console.log("Shopping List Created");

    revalidatePath("/dashboard");
     return newHousehold[0].id;
};


//join a household by id
export const joinHousehold = async (userId: string | undefined, householdId: string) => {
    const newMembership = await db.insert(household_members).values({
        household_id : householdId,
        user_id : userId as string,
    })
    console.log("Membership Created");
    return newMembership;
  };


  export const getHouseholdNameFromId = async (householdId: string) => {
    const household = await db.query.households.findFirst({
        where(fields, operators) {
            return eq(fields.id, householdId);
        },
    });
    revalidatePath("/dashboard");
    return household?.name
  };

//get all household members and return User objects
export const getHouseholdMembers = async (householdId: string): Promise<User[]> => {
    const members = await db.query.household_members.findMany({
        where(fields, operators) {
            return eq(fields.household_id, householdId);
        },
        with: {
            user: true,
        },
    });
    return members.map((member) => member.user);
};

//return admin id
export const getHouseholdAdminId = async (householdId: string): Promise<string | undefined> => {
    const household = await db.query.households.findFirst({
        where(fields, operators) {
            return eq(fields.id, householdId);
        },
    });
    return household?.admin_id;
};

export const deleteHousehold = async (householdId: string) => {
    await db.delete(household_members).where(eq(household_members.household_id, householdId));
    await db.delete(shoppingLists).where(eq(shoppingLists.household_id, householdId));
    await db.delete(inventory).where(eq(inventory.household_id, householdId));
    await db.delete(households).where(eq(households.id, householdId));

    revalidatePath("/dashboard");
};