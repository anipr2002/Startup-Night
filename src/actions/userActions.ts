"use server";
import db from "@/db/drizzle";
import { users, household_members, households, User } from "@/db/schema";
import { eq } from "drizzle-orm";

//check if user is in household by household id

export const isInHousehold = async (userId: string, householdId: string): Promise<boolean> => {
    const user = await db.query.users.findFirst({
        where(fields, operators) {
            return eq(fields.id, userId);
        },
    });
    if (!user) {
        return false;
    }

    const userInHousehold = await db.query.household_members.findFirst({
        where(fields, operators) {
            return eq(fields.user_id, userId) && eq(fields.household_id, householdId);
        },
    });

    if (!userInHousehold) {
        // console.log("User is in household");    
        return false;
    }

    return true;
}

export const getUserById = async (userId: string): Promise<User["username"] | undefined> => {
    const user = await db.query.users.findFirst({
        where(fields, operators) {
            return eq(fields.id, userId);
        },
    });
    return user?.username;
}

export const changeUsername = async (userId: string, username: string) => {
    const user = await db.query.users.findFirst({
        where(fields, operators) {
            return eq(fields.id, userId);
        },
    });
    if (user) {
        await db.update(users).set({
            username: username,
        }).where(eq(users.id, userId));
        console.log("Username changed");
    } else {
        console.log("User not found");
    }
};

export const getUserDetails = async (userId: string): Promise<User | undefined> => {
    const user = await db.query.users.findFirst({
        where(fields, operators) {
            return eq(fields.id, userId);
        },
    });
    return user;
};

