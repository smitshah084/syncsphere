import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: Promise<{
    serverId: string;
  }>;
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return <RedirectToSignIn />;

  const resolvedParams = await params;
  const { serverId } = resolvedParams;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
      },
    },
  });

  if (!server) return <RedirectToSignIn />;

  const intialChannel = server?.channels[0];
  if (intialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${intialChannel?.id}`);
};

export default ServerIdPage;
