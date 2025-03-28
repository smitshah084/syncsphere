import { Member, Server, Profile } from "@prisma/client";
import { Server as NetServer } from "net";
import { Socket as NetSocket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type ServerWithMembersWithProfile = Server & {
  members: (Member & {profile: Profile})[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
