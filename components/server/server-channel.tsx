"use client";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Trash, Hash, Mic, Video, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";
const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useModal();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e:React.MouseEvent,action:ModalType) => {
    e.stopPropagation();
    openModal(action, { server, channel });
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-800",
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e,"editChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete ">
            <Trash
              onClick={(e) => onAction(e,"deleteChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </button>
  );
};
