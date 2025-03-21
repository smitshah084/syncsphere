import { db } from "@/lib/db";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";


export const currentProfilePages = async (req:NextApiRequest) => {
    const { userId } = await getAuth(req);

    
    if(!userId) {
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    return profile;
}
