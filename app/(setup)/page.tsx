import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModel } from "@/components/models/initial-model";

const SetupPage = async () => {
    const profile = await initialProfile();

    // Type guard to ensure profile is not an Element and has an id
    if (!profile || typeof profile !== 'object' || !('id' in profile)) {
        return null;
    }

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return <InitialModel />;
};

export default SetupPage;
