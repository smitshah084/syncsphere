import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";

import { redirect } from "next/navigation";

interface ChannelIdProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdpage = async ({ params }: ChannelIdProps) => {
  const { serverId, channelId } = await params;

  const profile = await currentProfile();
  if (!profile) return <RedirectToSignIn />;

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });



  const members = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !members) return redirect("/");
  return (
    <div className="bg-white dark:bg-[#313338] flex felx-col h-full">
      <ChatHeader name={channel.name}
      serverId={channel.serverId} type="channel" />
    </div>
  );
};
export default ChannelIdpage;
