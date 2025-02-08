import { RedirectToSignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server'
import { db } from "@/lib/db";

export const initialProfile = async () => {
    try {
        const user = await currentUser()

        if (!user) {
            return RedirectToSignIn({ signInForceRedirectUrl: "/sign-in" });
        }

        const profile = await db.profile.findUnique({
            where: {
                userId: user.id
            }
        });

        if (profile) {
            return profile;
        }

        const newProfile = await db.profile.create({
            data: {
                userId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress
            }
        });

        return newProfile;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}
