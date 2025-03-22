import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { Server } from "lucide-react";
import { redirect } from "next/navigation";

interface ChannelIdProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const ChannelIdpage = async ({ params }: ChannelIdProps) => {
  const resolvedParams = await params;
  const { serverId, channelId } = resolvedParams;

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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1 overflow-y-auto">

      <ChatMessages
  member={members}
  name={channel.name}
  chatId={channel.id}
  type="channel"
  apiUrl="/api/messages"
  socketUrl="/api/socket/messages"
  socketQuery={{
    channelId: channel.id,
    serverId: channel.serverId,
  }}
  paramKey="channelId"
  paramValue={channel.id}
/>
{channel.type == ChannelType.TEXT && (
            <>
             <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id
                }}
            />
            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                    conversationId: conversation.id
                }}
            /></>
        )}
      </div>
      {channel.type == ChannelType.AUDIO &&
      (<MediaRoom
        chatId={channel.id}
        video={false}
        audio={true}
      />)}
       {channel.type == ChannelType.VIDEO &&
      (<MediaRoom
        chatId={channel.id}
        video={true}
        audio={true}
      />)}


    </div>
  );
};

export default ChannelIdpage;
