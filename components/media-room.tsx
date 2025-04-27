"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        const data = await resp.json();
        console.log("Data from /api/livekit:", data);

        if (data && typeof data.token === "string") {
          console.log("Token received:", data.token.substring(0, 20) + "...");
          setToken(data.token);
        } else {
          console.error("Invalid token data received:", data);
        }
      } catch (e) {
        console.error("Error fetching LiveKit token:", e);
      }
    };

    fetchToken();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  // Ensure token is definitely a string before passing to LiveKitRoom
  const tokenString = String(token);

  console.log("Connecting to LiveKit with token type:", typeof tokenString);

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={tokenString}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
