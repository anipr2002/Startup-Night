// src/actions/checkUser.ts
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";


export const checkUser = async() => {
    const user = await currentUser();

    //check for current logged in user
    if (!user) {
        return null;
    }

    const loggedInUser = await db.query.users.findFirst({
        where(fields, operators) {
            return eq(fields.id, user.id);
        },
    })

    if(loggedInUser) {
        console.log("User already exists in db");
        return loggedInUser;
    }
    
    //if not in db, create a new user

    const newUser = await db.insert(users).values({
        id : user.id,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        username: user.firstName ?? user.lastName ?? "noName",
    })

    return newUser;
}