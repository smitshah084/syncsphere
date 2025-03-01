import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: {
    inviteCode: string;
  }
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const { inviteCode } = params;

  if (!inviteCode) {
    return redirect("/");
  }

  // Find existing membership
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // Find server first
  const server = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
    },
  });

  if (!server) {
    return redirect("/");
  }

  // Then update with the found server's id
  const updatedServer = await db.server.update({
    where: {
      id: server.id,
    },
    data: {
      members: {
        create: [{
          profileId: profile.id,
        }]
      }
    }
  });

  if (updatedServer) {
    return redirect(`/servers/${updatedServer.id}`);
  }

  return null;
}

export default InvitePage;
